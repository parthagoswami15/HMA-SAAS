import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async onboardPatient(onboardDto: any, req: any) {
    this.logger.log(`Starting onboarding for phone: ${onboardDto.phone}`);

    const { phone, email, name, tenantId } = onboardDto;

    // Check if patient already exists
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
      throw new BadRequestException('Patient already exists with this phone or email');
    }

    // Generate OTP
    const otp = this.generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store onboarding data temporarily
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

    // Send OTP via SMS
    await this.sendOtp(phone, otp);

    // Log onboarding initiation
    await this.auditService.logActivity({
      action: 'PATIENT_ONBOARDING_INITIATED',
      entityType: 'PATIENT_ONBOARDING',
      entityId: onboarding.id,
      details: { phone, email },
    });

    return {
      onboardingId: onboarding.id,
      message: 'OTP sent to your phone number',
      expiresIn: 600, // 10 minutes in seconds
    };
  }

  async verifyOtp(verifyDto: any) {
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
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark onboarding as verified
    await this.prisma.patientOnboarding.update({
      where: { id: onboarding.id },
      data: {
        verified: true,
        verifiedAt: new Date(),
      },
    });

    // Log OTP verification
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

  async verifyAadhaar(aadhaarDto: any, req: any) {
    this.logger.log(`Verifying Aadhaar for onboarding: ${aadhaarDto.onboardingId}`);

    const { onboardingId, aadhaarNumber, name, dateOfBirth, address } = aadhaarDto;

    const onboarding = await this.prisma.patientOnboarding.findUnique({
      where: { id: onboardingId },
    });

    if (!onboarding) {
      throw new NotFoundException('Onboarding session not found');
    }

    if (!onboarding.verified) {
      throw new BadRequestException('OTP not verified yet');
    }

    // In production, integrate with Aadhaar verification API
    const aadhaarVerified = await this.verifyAadhaarWithApi(aadhaarNumber, name, dateOfBirth);

    if (!aadhaarVerified.success) {
      throw new BadRequestException('Aadhaar verification failed');
    }

    // Update onboarding with Aadhaar data
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

    // Log Aadhaar verification
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

  async completeProfile(profileDto: any, req: any) {
    this.logger.log(`Completing profile for onboarding: ${profileDto.onboardingId}`);

    const {
      onboardingId,
      name,
      email,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      city,
      state,
      pincode,
      emergencyContact,
    } = profileDto;

    const onboarding = await this.prisma.patientOnboarding.findUnique({
      where: { id: onboardingId },
    });

    if (!onboarding) {
      throw new NotFoundException('Onboarding session not found');
    }

    if (!onboarding.verified) {
      throw new BadRequestException('OTP not verified yet');
    }

    // Create user account
    const hashedPassword = await bcrypt.hash('TempPass123!', 12); // Temporary password

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

    // Create patient profile
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

    // Add emergency contact if provided
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

    // Set default language preference
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

    // Clean up onboarding session
    await this.prisma.patientOnboarding.delete({
      where: { id: onboardingId },
    });

    // Log profile completion
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

  async resendOtp(phone: string) {
    this.logger.log(`Resending OTP for phone: ${phone}`);

    const onboarding = await this.prisma.patientOnboarding.findFirst({
      where: { phone },
      orderBy: { createdAt: 'desc' },
    });

    if (!onboarding) {
      throw new NotFoundException('Onboarding session not found');
    }

    if (onboarding.verified) {
      throw new BadRequestException('Already verified');
    }

    // Check if last OTP was sent recently (within 2 minutes)
    const lastOtpTime = new Date(onboarding.otpSentAt || onboarding.createdAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastOtpTime.getTime()) / (1000 * 60);

    if (diffMinutes < 2) {
      throw new BadRequestException('Please wait before requesting another OTP');
    }

    // Generate new OTP
    const otp = this.generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update onboarding
    await this.prisma.patientOnboarding.update({
      where: { id: onboarding.id },
      data: {
        otp,
        otpExpiry,
        otpSentAt: new Date(),
      },
    });

    // Send OTP
    await this.sendOtp(phone, otp);

    return {
      message: 'OTP resent successfully',
      expiresIn: 600,
    };
  }

  async getOnboardingStatus(onboardingId: string) {
    const onboarding = await this.prisma.patientOnboarding.findUnique({
      where: { id: onboardingId },
    });

    if (!onboarding) {
      throw new NotFoundException('Onboarding session not found');
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

  private generateOtp(): string {
    // Generate 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendOtp(phone: string, otp: string) {
    this.logger.log(`Sending OTP ${otp} to ${phone}`);

    // In production, integrate with SMS service
    // await this.smsService.sendOtp(phone, otp);

    // For now, just log it
    console.log(`SMS OTP: ${otp} sent to ${phone}`);
  }

  private maskAadhaar(aadhaarNumber: string): string {
    // Mask Aadhaar number: show first 4 and last 4 digits
    return `${aadhaarNumber.substring(0, 4)}XXXX${aadhaarNumber.substring(aadhaarNumber.length - 4)}`;
  }

  private async verifyAadhaarWithApi(aadhaarNumber: string, name: string, dateOfBirth: string) {
    this.logger.log(`Verifying Aadhaar: ${aadhaarNumber}`);

    // In production, integrate with Aadhaar verification API
    // For now, mock verification
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

    // Mock success response
    return {
      success: true,
      name: name,
      dateOfBirth: dateOfBirth,
      address: 'Mock Address',
    };

    // Mock failure response
    // return {
    //   success: false,
    //   error: 'Aadhaar verification failed',
    // };
  }

  async getOnboardingStats(tenantId: string) {
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
}
