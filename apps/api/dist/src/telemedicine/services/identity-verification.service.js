"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var IdentityVerificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityVerificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let IdentityVerificationService = IdentityVerificationService_1 = class IdentityVerificationService {
    prisma;
    auditService;
    logger = new common_1.Logger(IdentityVerificationService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async verifyIdentity(identityDto, user) {
        this.logger.log(`Verifying identity for user ${user.id}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: identityDto.consultationId },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        const verificationRequired = await this.isVerificationRequired(consultation);
        if (!verificationRequired.required) {
            return { verified: true, method: 'NOT_REQUIRED' };
        }
        let verificationResult;
        switch (identityDto.method) {
            case 'AADHAAR':
                verificationResult = await this.verifyAadhaar(identityDto.aadhaarData, user);
                break;
            case 'OTP':
                verificationResult = await this.verifyOtp(identityDto.otpData, user);
                break;
            case 'VIDEO':
                verificationResult = await this.verifyVideo(identityDto.videoData, user);
                break;
            case 'DOCUMENT':
                verificationResult = await this.verifyDocument(identityDto.documentData, user);
                break;
            default:
                throw new common_1.BadRequestException('Invalid verification method');
        }
        if (verificationResult.success) {
            await this.prisma.identityVerification.create({
                data: {
                    consultationId: identityDto.consultationId,
                    userId: user.id,
                    verificationMethod: identityDto.method,
                    verificationData: identityDto,
                    status: 'VERIFIED',
                    verifiedAt: new Date(),
                    verifiedBy: user.id,
                },
            });
            await this.auditService.logActivity({
                action: 'IDENTITY_VERIFIED',
                entityType: 'IDENTITY_VERIFICATION',
                userId: user.id,
                details: {
                    consultationId: identityDto.consultationId,
                    method: identityDto.method,
                    success: true,
                },
            });
        }
        return verificationResult;
    }
    async isVerificationRequired(consultation) {
        this.logger.log(`Checking if identity verification is required for consultation ${consultation.id}`);
        if (consultation.isEmergency) {
            return { required: false, reason: 'Emergency consultation' };
        }
        const stateRegulations = await this.prisma.telemedicineRegulation.findUnique({
            where: { state: consultation.patientState },
        });
        if (stateRegulations?.identityVerificationRequired) {
            return {
                required: true,
                reason: 'Required by state regulations',
                methods: stateRegulations.allowedVerificationMethods,
            };
        }
        const previousVerifications = await this.prisma.identityVerification.count({
            where: {
                userId: consultation.patientId,
                status: 'VERIFIED',
                verifiedAt: {
                    gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                },
            },
        });
        if (previousVerifications > 0) {
            return { required: false, reason: 'Previous successful verification' };
        }
        return {
            required: true,
            reason: 'New patient verification required',
            methods: ['AADHAAR', 'OTP', 'VIDEO', 'DOCUMENT'],
        };
    }
    async getVerificationStatus(consultationId, user) {
        const verifications = await this.prisma.identityVerification.findMany({
            where: { consultationId },
            orderBy: { verifiedAt: 'desc' },
        });
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: consultationId },
        });
        const verificationRequired = await this.isVerificationRequired(consultation);
        return {
            consultationId,
            required: verificationRequired.required,
            reason: verificationRequired.reason,
            methods: verificationRequired.methods,
            verifications,
            isVerified: verifications.some(v => v.status === 'VERIFIED'),
        };
    }
    async verifyAadhaar(aadhaarData, user) {
        this.logger.log('Verifying Aadhaar identity');
        if (!/^\d{12}$/.test(aadhaarData.number)) {
            return { success: false, error: 'Invalid Aadhaar number format' };
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        const success = Math.random() > 0.1;
        return {
            success,
            method: 'AADHAAR',
            verifiedAt: new Date(),
            error: success ? null : 'Aadhaar verification failed',
        };
    }
    async verifyOtp(otpData, user) {
        this.logger.log('Verifying OTP identity');
        const otpRecord = await this.prisma.otpVerification.findFirst({
            where: {
                phoneNumber: otpData.phoneNumber,
                otp: otpData.otp,
                expiresAt: { gt: new Date() },
                used: false,
            },
        });
        if (!otpRecord) {
            return { success: false, error: 'Invalid or expired OTP' };
        }
        await this.prisma.otpVerification.update({
            where: { id: otpRecord.id },
            data: { used: true, usedAt: new Date() },
        });
        return {
            success: true,
            method: 'OTP',
            verifiedAt: new Date(),
        };
    }
    async verifyVideo(videoData, user) {
        this.logger.log('Verifying video identity');
        await new Promise(resolve => setTimeout(resolve, 3000));
        const success = Math.random() > 0.2;
        return {
            success,
            method: 'VIDEO',
            verifiedAt: new Date(),
            error: success ? null : 'Video verification failed',
        };
    }
    async verifyDocument(documentData, user) {
        this.logger.log('Verifying document identity');
        await new Promise(resolve => setTimeout(resolve, 4000));
        const success = Math.random() > 0.15;
        return {
            success,
            method: 'DOCUMENT',
            verifiedAt: new Date(),
            error: success ? null : 'Document verification failed',
        };
    }
    async sendOtp(phoneNumber, user) {
        this.logger.log(`Sending OTP to ${phoneNumber}`);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.prisma.otpVerification.create({
            data: {
                phoneNumber,
                otp,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                attempts: 0,
            },
        });
        return { success: true, message: 'OTP sent successfully' };
    }
    async resendOtp(phoneNumber, user) {
        const recentOtp = await this.prisma.otpVerification.findFirst({
            where: {
                phoneNumber,
                createdAt: { gt: new Date(Date.now() - 2 * 60 * 1000) },
            },
        });
        if (recentOtp) {
            throw new common_1.BadRequestException('Please wait before requesting another OTP');
        }
        return this.sendOtp(phoneNumber, user);
    }
    async getVerificationHistory(user) {
        const verifications = await this.prisma.identityVerification.findMany({
            where: { userId: user.id },
            orderBy: { verifiedAt: 'desc' },
        });
        return verifications;
    }
    async getVerificationStats(user) {
        const totalVerifications = await this.prisma.identityVerification.count({
            where: { userId: user.id },
        });
        const successfulVerifications = await this.prisma.identityVerification.count({
            where: {
                userId: user.id,
                status: 'VERIFIED',
            },
        });
        const failedVerifications = totalVerifications - successfulVerifications;
        const methodStats = await this.prisma.identityVerification.groupBy({
            by: ['verificationMethod'],
            where: { userId: user.id },
            _count: { verificationMethod: true },
        });
        return {
            total: totalVerifications,
            successful: successfulVerifications,
            failed: failedVerifications,
            successRate: totalVerifications > 0 ? (successfulVerifications / totalVerifications) * 100 : 0,
            byMethod: methodStats,
        };
    }
};
exports.IdentityVerificationService = IdentityVerificationService;
exports.IdentityVerificationService = IdentityVerificationService = IdentityVerificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], IdentityVerificationService);
//# sourceMappingURL=identity-verification.service.js.map