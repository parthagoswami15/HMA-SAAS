import { 
  Injectable, 
  UnauthorizedException, 
  BadRequestException, 
  ForbiddenException, 
  ConflictException,
  NotFoundException,
  Logger
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role, User, Tenant } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenService, TokenPayload } from './services/token.service';
import { v4 as uuidv4 } from 'uuid';

export type UserWithTenant = User & { tenant?: Tenant };

export type UserWithRequiredFields = {
  id: string;
  email: string;
  role: Role;
  tenantId: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  tenant?: Tenant;
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  /**
   * Extract device information from user agent string
   * @param userAgent The user agent string
   * @returns Device information object
   */
  private getDeviceInfo(userAgent: string): any {
    const deviceInfo: any = {
      browser: this.parseUserAgent(userAgent),
      os: this.detectOS(userAgent),
      deviceType: this.detectDeviceType(userAgent),
    };
    return deviceInfo;
  }

  private parseUserAgent(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  private detectOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS') || /iPad|iPhone|iPod/.test(userAgent)) return 'iOS';
    return 'Unknown';
  }

  private detectDeviceType(userAgent: string): string {
    if (/Mobile|Android|iP(ad|hone|od)/i.test(userAgent)) {
      return 'Mobile';
    }
    if (/Tablet|iPad/i.test(userAgent)) {
      return 'Tablet';
    }
    return 'Desktop';
  }

  async validateUser(email: string, password: string): Promise<UserWithRequiredFields> {
    try {
      const user = await this.prisma.user.findUnique({ 
        where: { email },
        include: { tenant: true }
      });
      
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if the user has a password hash (for social logins, etc.)
      if (!user.passwordHash) {
        throw new UnauthorizedException('Invalid authentication method');
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isActive) {
        throw new ForbiddenException('Account is deactivated');
      }

      // Ensure required fields are present
      if (!user.id || !user.tenantId || !user.role) {
        throw new Error('User data is incomplete');
      }

      // Return the user with required fields
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        tenant: user.tenant
      };
    } catch (error) {
      this.logger.error(`Error validating user ${email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async register(registerDto: RegisterDto): Promise<UserWithRequiredFields> {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      // Generate a unique slug for the tenant
      const baseSlug = registerDto.firstName
        ? `${registerDto.firstName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`
        : `user-${Date.now()}`;
      
          // Create tenant first with required fields
      const tenant = await this.prisma.tenant.create({
        data: {
          name: registerDto.firstName 
            ? `${registerDto.firstName}'s Organization` 
            : 'New Organization',
          slug: baseSlug,
          isActive: true,
          email: registerDto.email,
          settings: {},
        },
      });

      // Hash the password
      const hashedPassword = await bcrypt.hash(registerDto.password, this.SALT_ROUNDS);
      
      // Create user with default PATIENT role
      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email.toLowerCase().trim(),
          passwordHash: hashedPassword,
          firstName: registerDto.firstName || '',
          lastName: registerDto.lastName || '',
          role: Role.PATIENT,
          isActive: true,
          tenantId: tenant.id,
          // Set default values for required fields
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          tenant: true
        }
      });

      // Return user data with required fields
      const userWithTenant: UserWithRequiredFields = {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        tenant: user.tenant || undefined
      };
      
      return userWithTenant;
    } catch (error) {
      this.logger.error(`Error registering user ${registerDto.email}: ${error.message}`, error.stack);
      throw error instanceof ConflictException 
        ? error 
        : new BadRequestException('Registration failed. Please try again.');
    }
  }

  async login(loginDto: LoginDto) {
    const requestId = uuidv4();
    const startTime = Date.now();
    
    this.logger.log({
      message: 'Login attempt',
      requestId,
      email: loginDto.email,
      ip: loginDto.ipAddress,
      userAgent: loginDto.userAgent,
    });

    try {
      // Validate input
      if (!loginDto.email || !loginDto.password) {
        throw new BadRequestException('Email and password are required');
      }

      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
        include: { tenant: true },
      });

      if (!user) {
        this.logger.warn({
          message: 'Login failed: User not found',
          requestId,
          email: loginDto.email,
          ip: loginDto.ipAddress,
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
      if (!isPasswordValid) {
        this.logger.warn({
          message: 'Login failed: Invalid password',
          requestId,
          userId: user.id,
          email: loginDto.email,
          ip: loginDto.ipAddress,
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isActive) {
        this.logger.warn({
          message: 'Login failed: Account deactivated',
          requestId,
          userId: user.id,
          email: loginDto.email,
          ip: loginDto.ipAddress,
        });
        throw new ForbiddenException('Account is deactivated');
      }

      const jti = this.generateJti();
      
      try {
        // Generate tokens with device information
        const { accessToken, refreshToken } = await this.tokenService.generateTokens({
          id: user.id,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          isActive: user.isActive,
        }, jti);
        
        // Create refresh token with device information
        const deviceInfo = loginDto.userAgent ? this.getDeviceInfo(loginDto.userAgent) : null;
        
        await this.prisma.refreshToken.create({
          data: {
            jti,
            userId: user.id,
            token: await bcrypt.hash(refreshToken, this.SALT_ROUNDS),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            revoked: false,
            tenantId: user.tenantId,
            ipAddress: loginDto.ipAddress || null,
            userAgent: loginDto.userAgent || null,
          },
        });
        
        // Update user's last login time
        await this.prisma.user.update({
          where: { id: user.id },
          data: { 
            lastLoginAt: new Date(),
            updatedAt: new Date()
          },
        });

        // Log successful login
        this.logger.log({
          message: 'Login successful',
          requestId,
          userId: user.id,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
          ip: loginDto.ipAddress,
          deviceType: deviceInfo?.deviceType,
          duration: Date.now() - startTime,
        });
        
        return {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            tenantId: user.tenantId,
            isActive: user.isActive,
          }
        };
      } catch (error) {
        this.logger.error({
          message: 'Error during token generation',
          requestId,
          userId: user.id,
          error: error.message,
          stack: error.stack,
          duration: Date.now() - startTime,
        });
        throw new BadRequestException('Login failed. Please try again.');
      }
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`, error.stack);
      throw error instanceof UnauthorizedException 
        ? error 
        : new UnauthorizedException('Login failed. Please try again.');
    }
  }

  private generateJti(): string {
    return require('crypto').randomBytes(16).toString('hex');
  }

  async refreshTokens(refreshToken: string) {
    try {
      // Verify the refresh token
      const payload = await this.tokenService.verifyRefreshToken(refreshToken);
      
      // Get the user with tenant information
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { tenant: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      const jti = this.generateJti();
      const { accessToken, refreshToken: newRefreshToken } = await this.tokenService.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        isActive: user.isActive,
      }, jti);

      // Store the new refresh token
      await this.prisma.refreshToken.create({
        data: {
          jti,
          userId: user.id,
          token: await bcrypt.hash(newRefreshToken, this.SALT_ROUNDS),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          tenantId: user.tenantId,
        },
      });

      // Revoke the old token
      await this.prisma.refreshToken.updateMany({
        where: { jti: payload.jti },
        data: { 
          revoked: true,
          updatedAt: new Date()
        },
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      this.logger.error('Failed to refresh tokens', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }


  async logoutAllDevices(userId: string) {
    try {
      // Revoke all user's refresh tokens
      await this.prisma.refreshToken.updateMany({
        where: { 
          userId,
          revoked: false
        },
        data: { 
          revoked: true,
          updatedAt: new Date()
        },
      });
      
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to logout all devices for user ${userId}: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to logout from all devices');
    }
  }

  async getProfile(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          tenantId: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
          tenant: {
            select: {
              id: true,
              name: true,
              slug: true,
              isActive: true
            }
          }
        }
      });
      
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      return user;
    } catch (error) {
      this.logger.error(`Failed to get profile for user ${userId}: ${error.message}`, error.stack);
      throw error instanceof NotFoundException 
        ? error 
        : new BadRequestException('Failed to get user profile');
    }
  }


  /**
   * Get JWT tokens for a user
   * @param userId User ID
   * @param email User email
   * @param role User role
   * @param tenantId Tenant ID
   * @returns Access and refresh tokens
   */
  async getTokens(userId: string, email: string, role: Role, tenantId: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
          tenantId,
          jti: uuidv4(),
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
          tenantId,
          jti: uuidv4(),
          type: 'refresh',
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }


  /**
   * Logout user by removing refresh token
   * @param userId User ID
   */
  async logout(userId: string, jti: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { jti },
      data: { revoked: true }
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string, jti: string): Promise<void> {
    // Get user to get tenantId
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { tenantId: true }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Invalidate old token
    await this.prisma.refreshToken.updateMany({
      where: { jti },
      data: { revoked: true }
    });

    // Store new token
    await this.prisma.refreshToken.create({
      data: {
        jti: uuidv4(),
        token: refreshToken,
        userId,
        tenantId: user.tenantId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        revoked: false
      }
    });
  }
}
