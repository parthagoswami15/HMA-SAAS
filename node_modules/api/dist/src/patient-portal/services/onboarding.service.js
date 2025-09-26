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
var OnboardingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
const bcrypt = __importStar(require("bcrypt"));
let OnboardingService = OnboardingService_1 = class OnboardingService {
    prisma;
    auditService;
    logger = new common_1.Logger(OnboardingService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async onboardPatient(onboardDto, req) {
        this.logger.log(`Starting onboarding for phone: ${onboardDto.phone}`);
        const { phone, email, name, tenantId } = onboardDto;
        const existingPatient = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { phone },
                    { email },
                ],
                tenantId,
            },
        });
        if (existingPatient) {
            throw new common_1.BadRequestException('Patient already exists with this phone or email');
        }
        const otp = this.generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const onboarding = await this.prisma.patientOnboarding.create({
            data: {
                phone,
                email,
                name,
                tenantId,
                otp,
                otpExpiry,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            },
        });
        await this.sendOtp(phone, otp);
        await this.auditService.logActivity({
            action: 'PATIENT_ONBOARDING_INITIATED',
            entityType: 'PATIENT_ONBOARDING',
            entityId: onboarding.id,
            details: { phone, email },
        });
        return {
            onboardingId: onboarding.id,
            message: 'OTP sent to your phone number',
            expiresIn: 600,
        };
    }
    async verifyOtp(verifyDto) {
        this.logger.log(`Verifying OTP for phone: ${verifyDto.phone}`);
        const { phone, otp } = verifyDto;
        const onboarding = await this.prisma.patientOnboarding.findFirst({
            where: {
                phone,
                otp,
                otpExpiry: { gt: new Date() },
                verified: false,
            },
        });
        if (!onboarding) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        await this.prisma.patientOnboarding.update({
            where: { id: onboarding.id },
            data: {
                verified: true,
                verifiedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'PATIENT_OTP_VERIFIED',
            entityType: 'PATIENT_ONBOARDING',
            entityId: onboarding.id,
            details: { phone },
        });
        return {
            onboardingId: onboarding.id,
            message: 'OTP verified successfully',
            nextStep: 'profile_completion',
        };
    }
    async verifyAadhaar(aadhaarDto, req) {
        this.logger.log(`Verifying Aadhaar for onboarding: ${aadhaarDto.onboardingId}`);
        const { onboardingId, aadhaarNumber, name, dateOfBirth, address } = aadhaarDto;
        const onboarding = await this.prisma.patientOnboarding.findUnique({
            where: { id: onboardingId },
        });
        if (!onboarding) {
            throw new common_1.NotFoundException('Onboarding session not found');
        }
        if (!onboarding.verified) {
            throw new common_1.BadRequestException('OTP not verified yet');
        }
        const aadhaarVerified = await this.verifyAadhaarWithApi(aadhaarNumber, name, dateOfBirth);
        if (!aadhaarVerified.success) {
            throw new common_1.BadRequestException('Aadhaar verification failed');
        }
        await this.prisma.patientOnboarding.update({
            where: { id: onboardingId },
            data: {
                aadhaarNumber: this.maskAadhaar(aadhaarNumber),
                aadhaarVerified: true,
                aadhaarVerifiedAt: new Date(),
                aadhaarData: JSON.stringify({
                    name: aadhaarVerified.name,
                    dateOfBirth: aadhaarVerified.dateOfBirth,
                    address: aadhaarVerified.address,
                }),
            },
        });
        await this.auditService.logActivity({
            action: 'PATIENT_AADHAAR_VERIFIED',
            entityType: 'PATIENT_ONBOARDING',
            entityId: onboardingId,
            details: { aadhaarVerified: true },
        });
        return {
            onboardingId,
            message: 'Aadhaar verified successfully',
            nextStep: 'profile_completion',
        };
    }
    async completeProfile(profileDto, req) {
        this.logger.log(`Completing profile for onboarding: ${profileDto.onboardingId}`);
        const { onboardingId, name, email, dateOfBirth, gender, bloodGroup, address, city, state, pincode, emergencyContact, } = profileDto;
        const onboarding = await this.prisma.patientOnboarding.findUnique({
            where: { id: onboardingId },
        });
        if (!onboarding) {
            throw new common_1.NotFoundException('Onboarding session not found');
        }
        if (!onboarding.verified) {
            throw new common_1.BadRequestException('OTP not verified yet');
        }
        const hashedPassword = await bcrypt.hash('TempPass123!', 12);
        const user = await this.prisma.user.create({
            data: {
                phone: onboarding.phone,
                email,
                name,
                password: hashedPassword,
                role: 'PATIENT',
                tenantId: onboarding.tenantId,
                isActive: true,
                phoneVerified: true,
                emailVerified: false,
            },
        });
        const patientProfile = await this.prisma.patientProfile.create({
            data: {
                userId: user.id,
                name,
                email,
                phone: onboarding.phone,
                dateOfBirth: new Date(dateOfBirth),
                gender,
                bloodGroup,
                address,
                city,
                state,
                pincode,
                aadhaarVerified: onboarding.aadhaarVerified,
                phoneVerified: true,
                emailVerified: false,
                profileCompleted: true,
                tenantId: onboarding.tenantId,
            },
        });
        if (emergencyContact) {
            await this.prisma.emergencyContact.create({
                data: {
                    userId: user.id,
                    name: emergencyContact.name,
                    relationship: emergencyContact.relationship,
                    phone: emergencyContact.phone,
                    email: emergencyContact.email,
                    address: emergencyContact.address,
                },
            });
        }
        await this.prisma.patientPreferences.create({
            data: {
                userId: user.id,
                language: 'en',
                notifications: {
                    email: true,
                    sms: true,
                    push: true,
                },
                privacy: {
                    shareData: false,
                    allowMarketing: false,
                },
            },
        });
        await this.prisma.patientOnboarding.delete({
            where: { id: onboardingId },
        });
        await this.auditService.logActivity({
            action: 'PATIENT_PROFILE_COMPLETED',
            entityType: 'PATIENT_PROFILE',
            entityId: patientProfile.id,
            userId: user.id,
        });
        return {
            userId: user.id,
            message: 'Profile completed successfully',
            temporaryPassword: 'TempPass123!',
            nextStep: 'login',
        };
    }
    async resendOtp(phone) {
        this.logger.log(`Resending OTP for phone: ${phone}`);
        const onboarding = await this.prisma.patientOnboarding.findFirst({
            where: { phone },
            orderBy: { createdAt: 'desc' },
        });
        if (!onboarding) {
            throw new common_1.NotFoundException('Onboarding session not found');
        }
        if (onboarding.verified) {
            throw new common_1.BadRequestException('Already verified');
        }
        const lastOtpTime = new Date(onboarding.otpSentAt || onboarding.createdAt);
        const now = new Date();
        const diffMinutes = (now.getTime() - lastOtpTime.getTime()) / (1000 * 60);
        if (diffMinutes < 2) {
            throw new common_1.BadRequestException('Please wait before requesting another OTP');
        }
        const otp = this.generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.patientOnboarding.update({
            where: { id: onboarding.id },
            data: {
                otp,
                otpExpiry,
                otpSentAt: new Date(),
            },
        });
        await this.sendOtp(phone, otp);
        return {
            message: 'OTP resent successfully',
            expiresIn: 600,
        };
    }
    async getOnboardingStatus(onboardingId) {
        const onboarding = await this.prisma.patientOnboarding.findUnique({
            where: { id: onboardingId },
        });
        if (!onboarding) {
            throw new common_1.NotFoundException('Onboarding session not found');
        }
        return {
            onboardingId,
            phone: onboarding.phone,
            email: onboarding.email,
            verified: onboarding.verified,
            aadhaarVerified: onboarding.aadhaarVerified,
            otpExpiresAt: onboarding.otpExpiry,
        };
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async sendOtp(phone, otp) {
        this.logger.log(`Sending OTP ${otp} to ${phone}`);
        console.log(`SMS OTP: ${otp} sent to ${phone}`);
    }
    maskAadhaar(aadhaarNumber) {
        return `${aadhaarNumber.substring(0, 4)}XXXX${aadhaarNumber.substring(aadhaarNumber.length - 4)}`;
    }
    async verifyAadhaarWithApi(aadhaarNumber, name, dateOfBirth) {
        this.logger.log(`Verifying Aadhaar: ${aadhaarNumber}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            success: true,
            name: name,
            dateOfBirth: dateOfBirth,
            address: 'Mock Address',
        };
    }
    async getOnboardingStats(tenantId) {
        const totalOnboardings = await this.prisma.patientOnboarding.count({
            where: { tenantId },
        });
        const verifiedOnboardings = await this.prisma.patientOnboarding.count({
            where: {
                tenantId,
                verified: true,
            },
        });
        const aadhaarVerified = await this.prisma.patientOnboarding.count({
            where: {
                tenantId,
                aadhaarVerified: true,
            },
        });
        const completedProfiles = await this.prisma.patientProfile.count({
            where: {
                tenantId,
                profileCompleted: true,
            },
        });
        return {
            tenantId,
            totalOnboardings,
            verifiedOnboardings,
            aadhaarVerified,
            completedProfiles,
            completionRate: totalOnboardings > 0 ? (completedProfiles / totalOnboardings) * 100 : 0,
        };
    }
};
exports.OnboardingService = OnboardingService;
exports.OnboardingService = OnboardingService = OnboardingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], OnboardingService);
//# sourceMappingURL=onboarding.service.js.map