import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
import { CreatePrescriptionDto, UpdatePrescriptionDto, NarcoticsRegisterDto } from '../dto/prescription.dto';

@Injectable()
export class PrescriptionService {
  private readonly logger = new Logger(PrescriptionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createPrescription(createDto: CreatePrescriptionDto, user: any) {
    this.logger.log(`Creating prescription for patient ${createDto.patientId}`);

    // Validate Schedule drugs
    for (const medication of createDto.medications) {
      if (medication.isScheduledDrug) {
        await this.validateScheduleDrugPrescription(medication, user.id);
      }
    }

    const prescription = await this.prisma.prescription.create({
      data: {
        patientId: createDto.patientId,
        doctorId: createDto.doctorId,
        medications: JSON.stringify(createDto.medications),
        diagnosis: createDto.diagnosis,
        isEmergency: createDto.isEmergency || false,
        validTill: createDto.validTill ? new Date(createDto.validTill) : null,
        status: 'ACTIVE',
        createdBy: user.id,
        updatedBy: user.id,
      },
    });

    // Create individual medication records for tracking
    for (const medication of createDto.medications) {
      await this.prisma.prescriptionMedication.create({
        data: {
          prescriptionId: prescription.id,
          drugName: medication.drugName,
          genericName: medication.genericName,
          strength: medication.strength,
          dosage: medication.dosage,
          frequency: medication.frequency,
          duration: medication.duration,
          quantity: medication.quantity,
          instructions: medication.instructions,
          isScheduledDrug: medication.isScheduledDrug,
          scheduleCategory: medication.scheduleCategory,
        },
      });
    }

    // Log the creation
    await this.auditService.logActivity({
      action: 'PRESCRIPTION_CREATED',
      entityType: 'PRESCRIPTION',
      entityId: prescription.id,
      userId: user.id,
      details: {
        patientId: createDto.patientId,
        medicationCount: createDto.medications.length,
        hasScheduledDrugs: createDto.medications.some(m => m.isScheduledDrug),
      },
    });

    return {
      id: prescription.id,
      status: prescription.status,
      validTill: prescription.validTill,
      createdAt: prescription.createdAt,
    };
  }

  async updatePrescription(id: string, updateDto: UpdatePrescriptionDto, user: any) {
    this.logger.log(`Updating prescription ${id}`);

    const existingPrescription = await this.prisma.prescription.findUnique({
      where: { id },
    });

    if (!existingPrescription) {
      throw new NotFoundException('Prescription not found');
    }

    if (existingPrescription.status === 'CANCELLED') {
      throw new BadRequestException('Cannot update cancelled prescription');
    }

    const oldValues = { ...existingPrescription };

    // Validate Schedule drugs if medications are being updated
    if (updateDto.medications) {
      for (const medication of updateDto.medications) {
        if (medication.isScheduledDrug) {
          await this.validateScheduleDrugPrescription(medication, user.id);
        }
      }
    }

    const updatedPrescription = await this.prisma.prescription.update({
      where: { id },
      data: {
        ...updateDto,
        medications: updateDto.medications ? JSON.stringify(updateDto.medications) : existingPrescription.medications,
        diagnosis: updateDto.diagnosis ?? existingPrescription.diagnosis,
        isEmergency: updateDto.isEmergency ?? existingPrescription.isEmergency,
        validTill: updateDto.validTill ? new Date(updateDto.validTill) : existingPrescription.validTill,
        updatedBy: user.id,
        updatedAt: new Date(),
      },
    });

    // Update medication records if medications changed
    if (updateDto.medications) {
      await this.prisma.prescriptionMedication.deleteMany({
        where: { prescriptionId: id },
      });

      for (const medication of updateDto.medications) {
        await this.prisma.prescriptionMedication.create({
          data: {
            prescriptionId: id,
            drugName: medication.drugName,
            genericName: medication.genericName,
            strength: medication.strength,
            dosage: medication.dosage,
            frequency: medication.frequency,
            duration: medication.duration,
            quantity: medication.quantity,
            instructions: medication.instructions,
            isScheduledDrug: medication.isScheduledDrug,
            scheduleCategory: medication.scheduleCategory,
          },
        });
      }
    }

    // Log the update
    await this.auditService.logActivity({
      action: 'PRESCRIPTION_UPDATED',
      entityType: 'PRESCRIPTION',
      entityId: id,
      userId: user.id,
      oldValues,
      newValues: updatedPrescription,
    });

    return {
      id: updatedPrescription.id,
      status: updatedPrescription.status,
      validTill: updatedPrescription.validTill,
      updatedAt: updatedPrescription.updatedAt,
    };
  }

  async recordNarcoticsDispense(registerDto: NarcoticsRegisterDto, user: any) {
    this.logger.log(`Recording narcotics dispense for prescription ${registerDto.prescriptionId}`);

    // Verify prescription exists and contains narcotics
    const prescription = await this.prisma.prescription.findUnique({
      where: { id: registerDto.prescriptionId },
      include: { medications: true },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    const narcoticsMedication = prescription.medications.find(
      m => m.drugName.toLowerCase().includes('narcotic') || m.isScheduledDrug
    );

    if (!narcoticsMedication) {
      throw new BadRequestException('Prescription does not contain narcotics');
    }

    // Create narcotics register entry
    const registerEntry = await this.prisma.narcoticsRegister.create({
      data: {
        prescriptionId: registerDto.prescriptionId,
        drugName: registerDto.drugName,
        batchNumber: registerDto.batchNumber,
        dispensedBy: registerDto.dispensedBy,
        witnessName: registerDto.witnessName,
        witnessSignature: registerDto.witnessSignature,
        patientSignature: registerDto.patientSignature,
        remarks: registerDto.remarks,
        dispensedAt: new Date(),
      },
    });

    // Log the dispense
    await this.auditService.logActivity({
      action: 'NARCOTICS_DISPENSED',
      entityType: 'NARCOTICS_REGISTER',
      entityId: registerEntry.id,
      userId: user.id,
      details: {
        prescriptionId: registerDto.prescriptionId,
        drugName: registerDto.drugName,
        dispensedBy: registerDto.dispensedBy,
      },
    });

    return {
      id: registerEntry.id,
      dispensedAt: registerEntry.dispensedAt,
    };
  }

  async getComplianceStatus() {
    const totalPrescriptions = await this.prisma.prescription.count();
    const prescriptionsWithScheduledDrugs = await this.prisma.prescriptionMedication.count({
      where: { isScheduledDrug: true },
    });
    const narcoticsDispenses = await this.prisma.narcoticsRegister.count();

    // Check for expired prescriptions
    const expiredPrescriptions = await this.prisma.prescription.count({
      where: {
        validTill: { lt: new Date() },
        status: 'ACTIVE',
      },
    });

    return {
      totalRecords: totalPrescriptions,
      compliantRecords: totalPrescriptions - expiredPrescriptions,
      nonCompliantRecords: expiredPrescriptions,
      compliancePercentage: totalPrescriptions > 0 ? ((totalPrescriptions - expiredPrescriptions) / totalPrescriptions) * 100 : 100,
      lastUpdated: new Date(),
      details: {
        totalPrescriptions,
        prescriptionsWithScheduledDrugs,
        narcoticsDispenses,
        expiredPrescriptions,
      },
    };
  }

  async validateCompliance(entityId: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id: entityId },
      include: { medications: true },
    });

    if (!prescription) {
      return {
        isCompliant: false,
        issues: ['Prescription not found'],
      };
    }

    const issues = [];

    if (prescription.status === 'CANCELLED') {
      issues.push('Prescription is cancelled');
    }

    if (prescription.validTill && prescription.validTill < new Date()) {
      issues.push('Prescription has expired');
    }

    // Check for Schedule drugs compliance
    const scheduledDrugs = prescription.medications.filter(m => m.isScheduledDrug);
    if (scheduledDrugs.length > 0 && !prescription.isEmergency) {
      // Additional validation for Schedule drugs could be added here
    }

    return {
      isCompliant: issues.length === 0,
      issues,
    };
  }

  private async validateScheduleDrugPrescription(medication: any, doctorId: string) {
    // Check if doctor has authority to prescribe Schedule drugs
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
      select: {
        qualifications: true,
        specializations: true,
        scheduleDrugLicense: true,
      },
    });

    if (!doctor?.scheduleDrugLicense) {
      throw new BadRequestException(
        `Schedule ${medication.scheduleCategory} drugs require special license`
      );
    }

    // Validate prescription limits based on drug category
    if (medication.scheduleCategory === 'H' || medication.scheduleCategory === 'X') {
      // Narcotics require additional validation
      const existingPrescriptions = await this.prisma.prescriptionMedication.count({
        where: {
          drugName: medication.drugName,
          isScheduledDrug: true,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      });

      if (existingPrescriptions >= 3) {
        throw new BadRequestException('Monthly limit exceeded for this narcotic drug');
      }
    }
  }

  async getPrescriptionHistory(patientId: string, user: any) {
    this.logger.log(`Retrieving prescription history for patient ${patientId}`);

    const prescriptions = await this.prisma.prescription.findMany({
      where: { patientId },
      include: {
        medications: true,
        doctor: {
          select: { id: true, name: true, specialization: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Log the access
    await this.auditService.logActivity({
      action: 'PRESCRIPTION_HISTORY_ACCESSED',
      entityType: 'PATIENT',
      entityId: patientId,
      userId: user.id,
    });

    return prescriptions;
  }

  async getNarcoticsRegister(query: any, user: any) {
    const { fromDate, toDate, drugName, dispensedBy, page = '1', limit = '50' } = query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (drugName) where.drugName = { contains: drugName, mode: 'insensitive' };
    if (dispensedBy) where.dispensedBy = dispensedBy;
    if (fromDate || toDate) {
      where.dispensedAt = {};
      if (fromDate) where.dispensedAt.gte = new Date(fromDate);
      if (toDate) where.dispensedAt.lte = new Date(toDate);
    }

    const [registers, total] = await Promise.all([
      this.prisma.narcoticsRegister.findMany({
        where,
        orderBy: { dispensedAt: 'desc' },
        skip,
        take: limitNum,
      }),
      this.prisma.narcoticsRegister.count({ where }),
    ]);

    // Log the access
    await this.auditService.logActivity({
      action: 'NARCOTICS_REGISTER_ACCESSED',
      entityType: 'NARCOTICS_REGISTER',
      userId: user.id,
      details: { filters: query, count: total },
    });

    return {
      registers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  async cancelPrescription(id: string, reason: string, user: any) {
    this.logger.log(`Cancelling prescription ${id}`);

    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    if (prescription.status === 'CANCELLED') {
      throw new BadRequestException('Prescription already cancelled');
    }

    const updatedPrescription = await this.prisma.prescription.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason,
        cancelledAt: new Date(),
        updatedBy: user.id,
        updatedAt: new Date(),
      },
    });

    // Log the cancellation
    await this.auditService.logActivity({
      action: 'PRESCRIPTION_CANCELLED',
      entityType: 'PRESCRIPTION',
      entityId: id,
      userId: user.id,
      details: { reason },
    });

    return updatedPrescription;
  }
}
