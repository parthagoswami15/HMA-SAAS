import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
import { CreateAadhaarDto, UpdateAadhaarDto, AadhaarConsentDto } from '../dto/aadhaar.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AadhaarService {
  private readonly logger = new Logger(AadhaarService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createAadhaar(createAadhaarDto: CreateAadhaarDto, user: any) {
    this.logger.log(`Creating Aadhaar record for patient ${createAadhaarDto.patientId}`);

    // Hash the Aadhaar number for security
    const saltRounds = 12;
    const hashedAadhaar = await bcrypt.hash(createAadhaarDto.aadhaarNumber, saltRounds);

    // Create masked version (show only last 4 digits)
    const maskedAadhaar = 'XXXX-XXXX-' + createAadhaarDto.aadhaarNumber.slice(-4);

    const aadhaarRecord = await this.prisma.aadhaarRecord.create({
      data: {
        patientId: createAadhaarDto.patientId,
        aadhaarNumber: createAadhaarDto.aadhaarNumber,
        maskedAadhaar,
        hashedAadhaar,
        consentGiven: createAadhaarDto.consentGiven,
        consentDetails: createAadhaarDto.consentDetails,
        consentDate: createAadhaarDto.consentDate ? new Date(createAadhaarDto.consentDate) : new Date(),
        createdBy: user.id,
        updatedBy: user.id,
      },
    });

    // Log the creation
    await this.auditService.logActivity({
      action: 'AADHAAR_CREATED',
      entityType: 'AADHAAR',
      entityId: aadhaarRecord.id,
      userId: user.id,
      details: { patientId: createAadhaarDto.patientId, consentGiven: createAadhaarDto.consentGiven },
    });

    return {
      id: aadhaarRecord.id,
      patientId: aadhaarRecord.patientId,
      maskedAadhaar: aadhaarRecord.maskedAadhaar,
      consentGiven: aadhaarRecord.consentGiven,
      consentDate: aadhaarRecord.consentDate,
      createdAt: aadhaarRecord.createdAt,
    };
  }

  async updateAadhaar(id: string, updateAadhaarDto: UpdateAadhaarDto, user: any) {
    this.logger.log(`Updating Aadhaar record ${id}`);

    const existingRecord = await this.prisma.aadhaarRecord.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new NotFoundException('Aadhaar record not found');
    }

    const oldValues = { ...existingRecord };

    // Hash new Aadhaar if provided
    let hashedAadhaar = existingRecord.hashedAadhaar;
    if (updateAadhaarDto.hashedAadhaar) {
      hashedAadhaar = updateAadhaarDto.hashedAadhaar;
    }

    // Create masked version if Aadhaar number is provided
    let maskedAadhaar = existingRecord.maskedAadhaar;
    if (updateAadhaarDto.maskedAadhaar) {
      maskedAadhaar = updateAadhaarDto.maskedAadhaar;
    }

    const updatedRecord = await this.prisma.aadhaarRecord.update({
      where: { id },
      data: {
        ...updateAadhaarDto,
        hashedAadhaar,
        maskedAadhaar,
        updatedBy: user.id,
        updatedAt: new Date(),
      },
    });

    // Log the update
    await this.auditService.logActivity({
      action: 'AADHAAR_UPDATED',
      entityType: 'AADHAAR',
      entityId: id,
      userId: user.id,
      oldValues,
      newValues: updatedRecord,
    });

    return {
      id: updatedRecord.id,
      patientId: updatedRecord.patientId,
      maskedAadhaar: updatedRecord.maskedAadhaar,
      consentGiven: updatedRecord.consentGiven,
      consentDate: updatedRecord.consentDate,
      updatedAt: updatedRecord.updatedAt,
    };
  }

  async recordConsent(id: string, consentDto: AadhaarConsentDto, user: any) {
    this.logger.log(`Recording Aadhaar consent for record ${id}`);

    const existingRecord = await this.prisma.aadhaarRecord.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new NotFoundException('Aadhaar record not found');
    }

    const oldValues = { ...existingRecord };

    const updatedRecord = await this.prisma.aadhaarRecord.update({
      where: { id },
      data: {
        consentGiven: consentDto.consentGiven,
        consentDetails: consentDto.consentDetails,
        consentDate: new Date(),
        updatedBy: user.id,
        updatedAt: new Date(),
      },
    });

    // Log the consent update
    await this.auditService.logActivity({
      action: 'AADHAAR_CONSENT_UPDATED',
      entityType: 'AADHAAR',
      entityId: id,
      userId: user.id,
      oldValues,
      newValues: updatedRecord,
      details: {
        ipAddress: consentDto.ipAddress,
        userAgent: consentDto.userAgent,
      },
    });

    return {
      id: updatedRecord.id,
      consentGiven: updatedRecord.consentGiven,
      consentDate: updatedRecord.consentDate,
    };
  }

  async getAadhaar(id: string, user: any) {
    this.logger.log(`Retrieving Aadhaar record ${id}`);

    const aadhaarRecord = await this.prisma.aadhaarRecord.findUnique({
      where: { id },
      select: {
        id: true,
        patientId: true,
        maskedAadhaar: true,
        consentGiven: true,
        consentDetails: true,
        consentDate: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        updatedBy: true,
      },
    });

    if (!aadhaarRecord) {
      throw new NotFoundException('Aadhaar record not found');
    }

    // Log the access
    await this.auditService.logActivity({
      action: 'AADHAAR_ACCESSED',
      entityType: 'AADHAAR',
      entityId: id,
      userId: user.id,
      details: { patientId: aadhaarRecord.patientId },
    });

    return aadhaarRecord;
  }

  async getComplianceStatus() {
    const totalRecords = await this.prisma.aadhaarRecord.count();
    const recordsWithConsent = await this.prisma.aadhaarRecord.count({
      where: { consentGiven: true },
    });
    const recordsWithoutConsent = totalRecords - recordsWithConsent;

    return {
      totalRecords,
      compliantRecords: recordsWithConsent,
      nonCompliantRecords: recordsWithoutConsent,
      compliancePercentage: totalRecords > 0 ? (recordsWithConsent / totalRecords) * 100 : 100,
      lastUpdated: new Date(),
    };
  }

  async validateCompliance(entityId: string) {
    const record = await this.prisma.aadhaarRecord.findUnique({
      where: { id: entityId },
    });

    if (!record) {
      return {
        isCompliant: false,
        issues: ['Aadhaar record not found'],
      };
    }

    const issues = [];

    if (!record.consentGiven) {
      issues.push('Aadhaar consent not provided');
    }

    if (!record.maskedAadhaar) {
      issues.push('Aadhaar number not properly masked');
    }

    return {
      isCompliant: issues.length === 0,
      issues,
    };
  }

  // Utility method to verify Aadhaar number against hash
  async verifyAadhaar(aadhaarNumber: string, recordId: string): Promise<boolean> {
    const record = await this.prisma.aadhaarRecord.findUnique({
      where: { id: recordId },
      select: { hashedAadhaar: true },
    });

    if (!record || !record.hashedAadhaar) {
      return false;
    }

    return bcrypt.compare(aadhaarNumber, record.hashedAadhaar);
  }

  // Get Aadhaar records for a patient (masked)
  async getPatientAadhaar(patientId: string, user: any) {
    this.logger.log(`Retrieving Aadhaar records for patient ${patientId}`);

    const records = await this.prisma.aadhaarRecord.findMany({
      where: { patientId },
      select: {
        id: true,
        maskedAadhaar: true,
        consentGiven: true,
        consentDate: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Log the access
    await this.auditService.logActivity({
      action: 'PATIENT_AADHAAR_ACCESSED',
      entityType: 'PATIENT',
      entityId: patientId,
      userId: user.id,
    });

    return records;
  }
}
