import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class IdentityVerificationService {
  private readonly logger = new Logger(IdentityVerificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async verifyIdentity(identityDto: any, user: any) {
    this.logger.log(`Verifying identity for user ${user.id}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: identityDto.consultationId },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    // Check if identity verification is required
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
        throw new BadRequestException('Invalid verification method');
    }

    if (verificationResult.success) {
      // Record successful verification
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

      // Log the verification
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

  async isVerificationRequired(consultation: any) {
    this.logger.log(`Checking if identity verification is required for consultation ${consultation.id}`);

    // Check consultation type
    if (consultation.isEmergency) {
      return { required: false, reason: 'Emergency consultation' };
    }

    // Check patient state regulations
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

    // Check if patient has previous successful verifications
    const previousVerifications = await this.prisma.identityVerification.count({
      where: {
        userId: consultation.patientId,
        status: 'VERIFIED',
        verifiedAt: {
          gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
        },
      },
    });

    if (previousVerifications > 0) {
      return { required: false, reason: 'Previous successful verification' };
    }

    // Default: require verification for new patients
    return {
      required: true,
      reason: 'New patient verification required',
      methods: ['AADHAAR', 'OTP', 'VIDEO', 'DOCUMENT'],
    };
  }

  async getVerificationStatus(consultationId: string, user: any) {
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

  private async verifyAadhaar(aadhaarData: any, user: any) {
    this.logger.log('Verifying Aadhaar identity');

    // In production, integrate with Aadhaar verification API
    // For now, mock implementation

    // Validate Aadhaar number format
    if (!/^\d{12}$/.test(aadhaarData.number)) {
      return { success: false, error: 'Invalid Aadhaar number format' };
    }

    // Mock verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock success/failure
    const success = Math.random() > 0.1; // 90% success rate

    return {
      success,
      method: 'AADHAAR',
      verifiedAt: new Date(),
      error: success ? null : 'Aadhaar verification failed',
    };
  }

  private async verifyOtp(otpData: any, user: any) {
    this.logger.log('Verifying OTP identity');

    // Check if OTP was sent and is valid
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

    // Mark OTP as used
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

  private async verifyVideo(videoData: any, user: any) {
    this.logger.log('Verifying video identity');

    // In production, this would involve:
    // 1. Capturing live video
    // 2. Face recognition
    // 3. Liveness detection
    // 4. Document verification

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 3000));

    const success = Math.random() > 0.2; // 80% success rate

    return {
      success,
      method: 'VIDEO',
      verifiedAt: new Date(),
      error: success ? null : 'Video verification failed',
    };
  }

  private async verifyDocument(documentData: any, user: any) {
    this.logger.log('Verifying document identity');

    // In production, this would involve:
    // 1. Document OCR
    // 2. Face matching
    // 3. Document authenticity check
    // 4. Government database verification

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 4000));

    const success = Math.random() > 0.15; // 85% success rate

    return {
      success,
      method: 'DOCUMENT',
      verifiedAt: new Date(),
      error: success ? null : 'Document verification failed',
    };
  }

  async sendOtp(phoneNumber: string, user: any) {
    this.logger.log(`Sending OTP to ${phoneNumber}`);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP
    await this.prisma.otpVerification.create({
      data: {
        phoneNumber,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        attempts: 0,
      },
    });

    // In production, send OTP via SMS service
    // await this.smsService.sendOtp(phoneNumber, otp);

    return { success: true, message: 'OTP sent successfully' };
  }

  async resendOtp(phoneNumber: string, user: any) {
    // Check if there's a recent OTP
    const recentOtp = await this.prisma.otpVerification.findFirst({
      where: {
        phoneNumber,
        createdAt: { gt: new Date(Date.now() - 2 * 60 * 1000) }, // Last 2 minutes
      },
    });

    if (recentOtp) {
      throw new BadRequestException('Please wait before requesting another OTP');
    }

    return this.sendOtp(phoneNumber, user);
  }

  async getVerificationHistory(user: any) {
    const verifications = await this.prisma.identityVerification.findMany({
      where: { userId: user.id },
      orderBy: { verifiedAt: 'desc' },
    });

    return verifications;
  }

  async getVerificationStats(user: any) {
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
}
