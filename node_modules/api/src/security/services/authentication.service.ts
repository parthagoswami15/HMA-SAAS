import { Injectable, Logger, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { MfaService } from './mfa.service';
import { SessionService } from './session.service';
import { DeviceService } from './device.service';
import { IpService } from './ip.service';
import { AuditService } from './audit.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly mfaService: MfaService,
    private readonly sessionService: SessionService,
    private readonly deviceService: DeviceService,
    private readonly ipService: IpService,
    private readonly auditService: AuditService,
  ) {}

  async login(loginDto: any, req: any) {
    this.logger.log(`Login attempt for user: ${loginDto.email}`);

    const { email, password, deviceInfo, ipAddress } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: true,
        tenant: true,
      },
    });

    if (!user) {
      await this.recordLoginAttempt(email, false, ipAddress, deviceInfo);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      await this.recordLoginAttempt(email, false, ipAddress, deviceInfo);
      throw new UnauthorizedException('Account is disabled');
    }

    // Check IP allowlist
    if (user.tenant.ipAllowlistEnabled) {
      const ipAllowed = await this.ipService.isIpAllowed(ipAddress, user.tenantId);
      if (!ipAllowed) {
        await this.recordLoginAttempt(email, false, ipAddress, deviceInfo);
        throw new UnauthorizedException('IP address not allowed');
      }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await this.recordLoginAttempt(email, false, ipAddress, deviceInfo);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if MFA is required
    if (user.mfaEnabled) {
      // Return MFA required response
      return {
        requiresMfa: true,
        mfaToken: await this.generateMfaToken(user.id),
        message: 'MFA verification required',
      };
    }

    // Create session
    const session = await this.sessionService.createSession(user.id, deviceInfo, ipAddress);

    // Generate tokens
    const tokens = await this.generateTokens(user, session.id);

    // Record successful login
    await this.recordLoginAttempt(email, true, ipAddress, deviceInfo);

    // Log successful login
    await this.auditService.logActivity({
      action: 'USER_LOGIN',
      entityType: 'USER',
      entityId: user.id,
      userId: user.id,
      details: {
        ipAddress,
        deviceInfo,
        userAgent: req.headers['user-agent'],
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles.map(r => r.name),
        tenantId: user.tenantId,
      },
      ...tokens,
    };
  }

  async logout(user: any) {
    this.logger.log(`Logout for user: ${user.id}`);

    // Revoke current session
    await this.sessionService.revokeSession(user.sessionId, user);

    // Log logout
    await this.auditService.logActivity({
      action: 'USER_LOGOUT',
      entityType: 'USER',
      entityId: user.id,
      userId: user.id,
    });

    return { success: true };
  }

  async refreshToken(refreshToken: string) {
    this.logger.log('Token refresh attempt');

    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const session = await this.sessionService.getSession(decoded.sessionId);
      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { roles: true, tenant: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user, session.id);

      // Log token refresh
      await this.auditService.logActivity({
        action: 'TOKEN_REFRESHED',
        entityType: 'USER',
        entityId: user.id,
        userId: user.id,
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async changePassword(passwordDto: any, user: any) {
    this.logger.log(`Password change for user: ${user.id}`);

    const { currentPassword, newPassword } = passwordDto;

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Validate new password
    await this.validatePasswordStrength(newPassword);

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordChangedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Revoke all existing sessions
    await this.sessionService.revokeAllSessions(user);

    // Log password change
    await this.auditService.logActivity({
      action: 'PASSWORD_CHANGED',
      entityType: 'USER',
      entityId: user.id,
      userId: user.id,
    });

    return { success: true };
  }

  async resetPassword(resetDto: any) {
    this.logger.log(`Password reset for: ${resetDto.email}`);

    const { email, resetToken, newPassword } = resetDto;

    // Find user
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify reset token
    const isTokenValid = await this.verifyResetToken(user.id, resetToken);
    if (!isTokenValid) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Validate new password
    await this.validatePasswordStrength(newPassword);

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordChangedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Revoke all existing sessions
    await this.sessionService.revokeAllSessions(user);

    // Invalidate reset token
    await this.invalidateResetToken(user.id);

    // Log password reset
    await this.auditService.logActivity({
      action: 'PASSWORD_RESET',
      entityType: 'USER',
      entityId: user.id,
      userId: user.id,
    });

    return { success: true };
  }

  async forgotPassword(forgotDto: any) {
    this.logger.log(`Password reset request for: ${forgotDto.email}`);

    const { email } = forgotDto;

    // Find user
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if user exists
      return { success: true, message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store reset token
    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: await bcrypt.hash(resetToken, 12),
        expiresAt: resetTokenExpiry,
      },
    });

    // In production, send reset email
    // await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    // Log password reset request
    await this.auditService.logActivity({
      action: 'PASSWORD_RESET_REQUESTED',
      entityType: 'USER',
      entityId: user.id,
      userId: user.id,
    });

    return { success: true, message: 'If the email exists, a reset link has been sent' };
  }

  async initiateSamlLogin(req: any) {
    this.logger.log('Initiating SAML login');

    // In production, integrate with SAML provider
    // For now, return mock SAML request
    return {
      samlRequest: 'mock_saml_request',
      redirectUrl: 'https://saml-provider.example.com/sso',
    };
  }

  async handleSamlCallback(callbackDto: any) {
    this.logger.log('Handling SAML callback');

    // In production, validate SAML response
    // For now, return mock user
    const mockUser = {
      id: 'saml_user_id',
      email: 'user@saml-provider.com',
      name: 'SAML User',
      roles: ['PATIENT'],
      tenantId: 'tenant_id',
    };

    // Create session
    const session = await this.sessionService.createSession(mockUser.id, 'SAML', '0.0.0.0');
    const tokens = await this.generateTokens(mockUser, session.id);

    return { user: mockUser, ...tokens };
  }

  async initiateOidcLogin(req: any) {
    this.logger.log('Initiating OIDC login');

    // In production, redirect to OIDC provider
    return {
      authorizationUrl: 'https://oidc-provider.example.com/auth',
      state: 'random_state',
    };
  }

  async handleOidcCallback(callbackDto: any) {
    this.logger.log('Handling OIDC callback');

    // In production, exchange code for tokens and validate
    // For now, return mock user
    const mockUser = {
      id: 'oidc_user_id',
      email: 'user@oidc-provider.com',
      name: 'OIDC User',
      roles: ['PATIENT'],
      tenantId: 'tenant_id',
    };

    // Create session
    const session = await this.sessionService.createSession(mockUser.id, 'OIDC', '0.0.0.0');
    const tokens = await this.generateTokens(mockUser, session.id);

    return { user: mockUser, ...tokens };
  }

  private async generateTokens(user: any, sessionId: string) {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map(r => r.name),
      tenantId: user.tenantId,
      sessionId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION', '15m'),
      }),
      this.jwtService.signAsync({ sessionId, userId: user.id }, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async generateMfaToken(userId: string) {
    const payload = { userId, type: 'mfa' };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '5m',
    });
  }

  private async recordLoginAttempt(email: string, success: boolean, ipAddress: string, deviceInfo: any) {
    // Find user by email
    const user = await this.prisma.user.findUnique({ where: { email } });

    await this.prisma.loginAttempt.create({
      data: {
        userId: user?.id || null,
        email,
        success,
        ipAddress,
        userAgent: deviceInfo?.userAgent || '',
        deviceInfo: JSON.stringify(deviceInfo),
        attemptedAt: new Date(),
      },
    });

    // If failed attempt, check for brute force
    if (!success && user) {
      const recentFailedAttempts = await this.prisma.loginAttempt.count({
        where: {
          userId: user.id,
          success: false,
          attemptedAt: {
            gte: new Date(Date.now() - 15 * 60 * 1000), // Last 15 minutes
          },
        },
      });

      if (recentFailedAttempts >= 5) {
        // Lock account temporarily
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            isLocked: true,
            lockedAt: new Date(),
          },
        });

        // Log security event
        await this.auditService.logActivity({
          action: 'ACCOUNT_LOCKED',
          entityType: 'USER',
          entityId: user.id,
          userId: user.id,
          details: { reason: 'Too many failed login attempts' },
        });
      }
    }
  }

  private async validatePasswordStrength(password: string) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSymbols) {
      throw new BadRequestException(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol'
      );
    }
  }

  private async verifyResetToken(userId: string, token: string): Promise<boolean> {
    const resetRecord = await this.prisma.passwordReset.findFirst({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
    });

    if (!resetRecord) {
      return false;
    }

    return await bcrypt.compare(token, resetRecord.token);
  }

  private async invalidateResetToken(userId: string) {
    await this.prisma.passwordReset.deleteMany({
      where: { userId },
    });
  }
}
