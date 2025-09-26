import { Injectable, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as base32 from 'hi-base32';
import * as speakeasy from 'speakeasy';

@Injectable()
export class MfaService {
  private readonly logger = new Logger(MfaService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async setupMfa(user: any) {
    this.logger.log(`Setting up MFA for user: ${user.id}`);

    // Check if MFA is already enabled
    if (user.mfaEnabled) {
      throw new BadRequestException('MFA is already enabled');
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `HealthcareApp:${user.email}`,
      issuer: 'HealthcareApp',
    });

    // Store MFA secret temporarily (will be confirmed during verification)
    await this.prisma.mfaSetup.create({
      data: {
        userId: user.id,
        secret: secret.base32,
        backupCodes: this.generateBackupCodes(),
      },
    });

    // Log MFA setup initiation
    await this.auditService.logActivity({
      action: 'MFA_SETUP_INITIATED',
      entityType: 'USER',
      entityId: user.id,
      userId: user.id,
    });

    return {
      secret: secret.base32,
      qrCodeUrl: secret.otpauth_url,
      backupCodes: [], // Will be returned after verification
    };
  }

  async verifyMfa(verifyDto: any, user: any) {
    this.logger.log(`Verifying MFA for user: ${user.id}`);

    const { token, setup } = verifyDto;

    if (setup) {
      // This is during setup verification
      const mfaSetup = await this.prisma.mfaSetup.findUnique({
        where: { userId: user.id },
      });

      if (!mfaSetup) {
        throw new BadRequestException('MFA setup not initiated');
      }

      const verified = speakeasy.totp.verify({
        secret: mfaSetup.secret,
        encoding: 'base32',
        token: token,
        window: 2, // Allow 2 time steps tolerance
      });

      if (!verified) {
        throw new UnauthorizedException('Invalid MFA token');
      }

      // Enable MFA for user
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          mfaEnabled: true,
          mfaSecret: mfaSetup.secret,
          mfaBackupCodes: mfaSetup.backupCodes,
          updatedAt: new Date(),
        },
      });

      // Clean up setup record
      await this.prisma.mfaSetup.delete({
        where: { userId: user.id },
      });

      // Log MFA setup completion
      await this.auditService.logActivity({
        action: 'MFA_SETUP_COMPLETED',
        entityType: 'USER',
        entityId: user.id,
        userId: user.id,
      });

      return {
        success: true,
        backupCodes: mfaSetup.backupCodes,
        message: 'MFA has been successfully enabled',
      };
    } else {
      // This is during login verification
      if (!user.mfaEnabled || !user.mfaSecret) {
        throw new BadRequestException('MFA not enabled for this user');
      }

      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: token,
        window: 2,
      });

      if (!verified) {
        // Check backup codes
        if (user.mfaBackupCodes && user.mfaBackupCodes.includes(token)) {
          // Remove used backup code
          const updatedBackupCodes = user.mfaBackupCodes.filter(code => code !== token);
          await this.prisma.user.update({
            where: { id: user.id },
            data: {
              mfaBackupCodes: updatedBackupCodes,
            },
          });

          // Log backup code usage
          await this.auditService.logActivity({
            action: 'MFA_BACKUP_CODE_USED',
            entityType: 'USER',
            entityId: user.id,
            userId: user.id,
          });
        } else {
          throw new UnauthorizedException('Invalid MFA token or backup code');
        }
      }

      // Log successful MFA verification
      await this.auditService.logActivity({
        action: 'MFA_VERIFIED',
        entityType: 'USER',
        entityId: user.id,
        userId: user.id,
      });

      return { success: true };
    }
  }

  async disableMfa(disableDto: any, user: any) {
    this.logger.log(`Disabling MFA for user: ${user.id}`);

    const { password } = disableDto;

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Disable MFA
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: [],
        updatedAt: new Date(),
      },
    });

    // Log MFA disable
    await this.auditService.logActivity({
      action: 'MFA_DISABLED',
      entityType: 'USER',
      entityId: user.id,
      userId: user.id,
    });

    return { success: true, message: 'MFA has been disabled' };
  }

  async generateBackupCodes(user: any) {
    this.logger.log(`Generating backup codes for user: ${user.id}`);

    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }

    // Update user's backup codes
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        mfaBackupCodes: backupCodes,
        updatedAt: new Date(),
      },
    });

    return backupCodes;
  }

  async getMfaStatus(user: any) {
    return {
      userId: user.id,
      mfaEnabled: user.mfaEnabled,
      backupCodesCount: user.mfaBackupCodes?.length || 0,
    };
  }

  async regenerateBackupCodes(user: any) {
    this.logger.log(`Regenerating backup codes for user: ${user.id}`);

    const backupCodes = this.generateBackupCodes(user);

    // Log backup code regeneration
    await this.auditService.logActivity({
      action: 'MFA_BACKUP_CODES_REGENERATED',
      entityType: 'USER',
      entityId: user.id,
      userId: user.id,
    });

    return backupCodes;
  }

  private generateBackupCodes(): string[] {
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return backupCodes;
  }

  async validateMfaToken(userId: string, token: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      return false;
    }

    // Verify TOTP token
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: token,
      window: 2,
    });

    if (verified) {
      return true;
    }

    // Check backup codes
    if (user.mfaBackupCodes && user.mfaBackupCodes.includes(token)) {
      // Remove used backup code
      const updatedBackupCodes = user.mfaBackupCodes.filter(code => code !== token);
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          mfaBackupCodes: updatedBackupCodes,
        },
      });

      // Log backup code usage
      await this.auditService.logActivity({
        action: 'MFA_BACKUP_CODE_USED',
        entityType: 'USER',
        entityId: userId,
        userId: userId,
      });

      return true;
    }

    return false;
  }

  async getMfaSetupStatus(user: any) {
    const mfaSetup = await this.prisma.mfaSetup.findUnique({
      where: { userId: user.id },
    });

    if (!mfaSetup) {
      return { setupInitiated: false };
    }

    return {
      setupInitiated: true,
      secret: mfaSetup.secret,
      backupCodes: mfaSetup.backupCodes,
    };
  }
}
