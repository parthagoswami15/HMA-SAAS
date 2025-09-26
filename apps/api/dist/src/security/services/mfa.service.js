"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MfaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("./audit.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const speakeasy = __importStar(require("speakeasy"));
let MfaService = MfaService_1 = class MfaService {
    prisma;
    auditService;
    logger = new common_1.Logger(MfaService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async setupMfa(user) {
        this.logger.log(`Setting up MFA for user: ${user.id}`);
        if (user.mfaEnabled) {
            throw new common_1.BadRequestException('MFA is already enabled');
        }
        const secret = speakeasy.generateSecret({
            name: `HealthcareApp:${user.email}`,
            issuer: 'HealthcareApp',
        });
        await this.prisma.mfaSetup.create({
            data: {
                userId: user.id,
                secret: secret.base32,
                backupCodes: this.generateBackupCodes(),
            },
        });
        await this.auditService.logActivity({
            action: 'MFA_SETUP_INITIATED',
            entityType: 'USER',
            entityId: user.id,
            userId: user.id,
        });
        return {
            secret: secret.base32,
            qrCodeUrl: secret.otpauth_url,
            backupCodes: [],
        };
    }
    async verifyMfa(verifyDto, user) {
        this.logger.log(`Verifying MFA for user: ${user.id}`);
        const { token, setup } = verifyDto;
        if (setup) {
            const mfaSetup = await this.prisma.mfaSetup.findUnique({
                where: { userId: user.id },
            });
            if (!mfaSetup) {
                throw new common_1.BadRequestException('MFA setup not initiated');
            }
            const verified = speakeasy.totp.verify({
                secret: mfaSetup.secret,
                encoding: 'base32',
                token: token,
                window: 2,
            });
            if (!verified) {
                throw new common_1.UnauthorizedException('Invalid MFA token');
            }
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    mfaEnabled: true,
                    mfaSecret: mfaSetup.secret,
                    mfaBackupCodes: mfaSetup.backupCodes,
                    updatedAt: new Date(),
                },
            });
            await this.prisma.mfaSetup.delete({
                where: { userId: user.id },
            });
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
        }
        else {
            if (!user.mfaEnabled || !user.mfaSecret) {
                throw new common_1.BadRequestException('MFA not enabled for this user');
            }
            const verified = speakeasy.totp.verify({
                secret: user.mfaSecret,
                encoding: 'base32',
                token: token,
                window: 2,
            });
            if (!verified) {
                if (user.mfaBackupCodes && user.mfaBackupCodes.includes(token)) {
                    const updatedBackupCodes = user.mfaBackupCodes.filter(code => code !== token);
                    await this.prisma.user.update({
                        where: { id: user.id },
                        data: {
                            mfaBackupCodes: updatedBackupCodes,
                        },
                    });
                    await this.auditService.logActivity({
                        action: 'MFA_BACKUP_CODE_USED',
                        entityType: 'USER',
                        entityId: user.id,
                        userId: user.id,
                    });
                }
                else {
                    throw new common_1.UnauthorizedException('Invalid MFA token or backup code');
                }
            }
            await this.auditService.logActivity({
                action: 'MFA_VERIFIED',
                entityType: 'USER',
                entityId: user.id,
                userId: user.id,
            });
            return { success: true };
        }
    }
    async disableMfa(disableDto, user) {
        this.logger.log(`Disabling MFA for user: ${user.id}`);
        const { password } = disableDto;
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                mfaEnabled: false,
                mfaSecret: null,
                mfaBackupCodes: [],
                updatedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'MFA_DISABLED',
            entityType: 'USER',
            entityId: user.id,
            userId: user.id,
        });
        return { success: true, message: 'MFA has been disabled' };
    }
    async generateBackupCodes(user) {
        this.logger.log(`Generating backup codes for user: ${user.id}`);
        const backupCodes = [];
        for (let i = 0; i < 10; i++) {
            backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                mfaBackupCodes: backupCodes,
                updatedAt: new Date(),
            },
        });
        return backupCodes;
    }
    async getMfaStatus(user) {
        return {
            userId: user.id,
            mfaEnabled: user.mfaEnabled,
            backupCodesCount: user.mfaBackupCodes?.length || 0,
        };
    }
    async regenerateBackupCodes(user) {
        this.logger.log(`Regenerating backup codes for user: ${user.id}`);
        const backupCodes = this.generateBackupCodes(user);
        await this.auditService.logActivity({
            action: 'MFA_BACKUP_CODES_REGENERATED',
            entityType: 'USER',
            entityId: user.id,
            userId: user.id,
        });
        return backupCodes;
    }
    generateBackupCodes() {
        const backupCodes = [];
        for (let i = 0; i < 10; i++) {
            backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
        }
        return backupCodes;
    }
    async validateMfaToken(userId, token) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || !user.mfaEnabled || !user.mfaSecret) {
            return false;
        }
        const verified = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token: token,
            window: 2,
        });
        if (verified) {
            return true;
        }
        if (user.mfaBackupCodes && user.mfaBackupCodes.includes(token)) {
            const updatedBackupCodes = user.mfaBackupCodes.filter(code => code !== token);
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    mfaBackupCodes: updatedBackupCodes,
                },
            });
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
    async getMfaSetupStatus(user) {
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
};
exports.MfaService = MfaService;
exports.MfaService = MfaService = MfaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], MfaService);
//# sourceMappingURL=mfa.service.js.map