import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StateRestrictionService } from './state-restriction.service';
import { AuditService } from '../../audit/audit.service';
import { ComplianceService } from '../../compliance/compliance.service';

@Injectable()
export class PrescriptionService {
  private readonly logger = new Logger(PrescriptionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stateRestrictionService: StateRestrictionService,
    private readonly auditService: AuditService,
    private readonly complianceService: ComplianceService,
  ) {}

  async createPrescription(prescriptionDto: any, user: any) {
    this.logger.log(`Creating prescription for consultation ${prescriptionDto.consultationId}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: prescriptionDto.consultationId },
      include: {
        patient: {
          select: { id: true, name: true, state: true, dateOfBirth: true },
        },
        doctor: {
          select: { id: true, name: true, licenseNumber: true, state: true },
        },
      },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    // Validate state restrictions for prescribing
    await this.stateRestrictionService.validatePrescriptionRestrictions(
      consultation.patient.state,
      user.id,
    );

    // Check doctor authorization for Schedule drugs
    for (const medication of prescriptionDto.medications) {
      if (medication.isScheduledDrug) {
        await this.stateRestrictionService.validateScheduleDrugPrescription(
          medication,
          user.id,
        );
      }
    }

    const prescription = await this.prisma.prescription.create({
      data: {
        consultationId: prescriptionDto.consultationId,
        patientId: consultation.patientId,
        doctorId: consultation.doctorId,
        diagnosis: prescriptionDto.diagnosis,
        notes: prescriptionDto.notes,
        isEmergency: prescriptionDto.isEmergency || false,
        validTill: prescriptionDto.validTill ? new Date(prescriptionDto.validTill) : null,
        status: 'ACTIVE',
        createdBy: user.id,
      },
    });

    // Create medication records
    for (const medication of prescriptionDto.medications) {
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
          isScheduledDrug: medication.isScheduledDrug || false,
          scheduleCategory: medication.scheduleCategory,
        },
      });
    }

    // Create lab orders if specified
    if (prescriptionDto.labTests && prescriptionDto.labTests.length > 0) {
      for (const test of prescriptionDto.labTests) {
        await this.prisma.labOrder.create({
          data: {
            consultationId: prescriptionDto.consultationId,
            patientId: consultation.patientId,
            doctorId: consultation.doctorId,
            tests: [test],
            priority: 'ROUTINE',
            status: 'ORDERED',
            createdBy: user.id,
          },
        });
      }
    }

    // Create imaging orders if specified
    if (prescriptionDto.imaging && prescriptionDto.imaging.length > 0) {
      for (const imaging of prescriptionDto.imaging) {
        await this.prisma.radioOrder.create({
          data: {
            consultationId: prescriptionDto.consultationId,
            patientId: consultation.patientId,
            doctorId: consultation.doctorId,
            imagingType: imaging.type,
            bodyPart: imaging.bodyPart,
            priority: imaging.priority || 'ROUTINE',
            notes: imaging.notes,
            status: 'ORDERED',
            createdBy: user.id,
          },
        });
      }
    }

    // Log the prescription creation
    await this.auditService.logActivity({
      action: 'PRESCRIPTION_CREATED',
      entityType: 'PRESCRIPTION',
      entityId: prescription.id,
      userId: user.id,
      details: {
        consultationId: prescriptionDto.consultationId,
        medicationCount: prescriptionDto.medications.length,
        hasScheduledDrugs: prescriptionDto.medications.some(m => m.isScheduledDrug),
      },
    });

    return prescription;
  }

  async getConsultationPrescription(consultationId: string, user: any) {
    const prescription = await this.prisma.prescription.findFirst({
      where: { consultationId },
      include: {
        medications: true,
        doctor: {
          select: { id: true, name: true, licenseNumber: true, signature: true },
        },
        patient: {
          select: { id: true, name: true, dateOfBirth: true, gender: true },
        },
      },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found for this consultation');
    }

    return prescription;
  }

  async sharePrescription(id: string, shareDto: any, user: any) {
    this.logger.log(`Sharing prescription ${id}`);

    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    // Generate shareable link or send via specified channels
    const shareResult = {
      prescriptionId: id,
      shareMethod: shareDto.method,
      sharedAt: new Date(),
      expiresAt: shareDto.expiresAt ? new Date(shareDto.expiresAt) : null,
    };

    // Log the sharing
    await this.auditService.logActivity({
      action: 'PRESCRIPTION_SHARED',
      entityType: 'PRESCRIPTION',
      entityId: id,
      userId: user.id,
      details: {
        shareMethod: shareDto.method,
        recipient: shareDto.recipient,
      },
    });

    return shareResult;
  }

  async generatePrescriptionPdf(id: string, user: any) {
    this.logger.log(`Generating PDF for prescription ${id}`);

    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: {
        medications: true,
        doctor: {
          select: {
            id: true,
            name: true,
            licenseNumber: true,
            signature: true,
            registrationNumber: true,
            qualification: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            dateOfBirth: true,
            gender: true,
            phone: true,
            address: true,
          },
        },
        consultation: {
          select: { id: true, scheduledAt: true },
        },
      },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    // Generate PDF content
    const pdfContent = this.generatePrescriptionPdfContent(prescription);

    // In production, use a PDF generation library like Puppeteer or PDFKit
    const pdfBuffer = Buffer.from(pdfContent, 'utf-8');

    // Log the PDF generation
    await this.auditService.logActivity({
      action: 'PRESCRIPTION_PDF_GENERATED',
      entityType: 'PRESCRIPTION',
      entityId: id,
      userId: user.id,
    });

    return pdfBuffer;
  }

  async generateFinalPrescription(consultationId: string, user: any) {
    this.logger.log(`Generating final prescription for consultation ${consultationId}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: consultationId },
      include: {
        patient: { select: { id: true, name: true, state: true } },
        doctor: { select: { id: true, name: true } },
      },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    // Get consultation notes and diagnosis from the consultation
    const prescription = await this.prisma.prescription.create({
      data: {
        consultationId,
        patientId: consultation.patientId,
        doctorId: consultation.doctorId,
        diagnosis: 'Based on telemedicine consultation', // This would come from consultation notes
        notes: 'Final prescription generated from telemedicine consultation',
        isEmergency: consultation.isEmergency,
        validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days validity
        status: 'ACTIVE',
        createdBy: user.id,
      },
    });

    // Log the final prescription generation
    await this.auditService.logActivity({
      action: 'FINAL_PRESCRIPTION_GENERATED',
      entityType: 'PRESCRIPTION',
      entityId: prescription.id,
      userId: user.id,
      details: { consultationId },
    });

    return prescription;
  }

  async updatePrescription(id: string, updateDto: any, user: any) {
    this.logger.log(`Updating prescription ${id}`);

    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    if (prescription.status === 'CANCELLED') {
      throw new BadRequestException('Cannot update cancelled prescription');
    }

    const oldValues = { ...prescription };

    const updatedPrescription = await this.prisma.prescription.update({
      where: { id },
      data: {
        ...updateDto,
        updatedBy: user.id,
        updatedAt: new Date(),
      },
    });

    // Update medications if provided
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
            isScheduledDrug: medication.isScheduledDrug || false,
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

    return updatedPrescription;
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

  private generatePrescriptionPdfContent(prescription: any): string {
    // Generate HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescription - ${prescription.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .patient-info { margin: 20px 0; }
            .medications { margin: 20px 0; }
            .medication { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
            .footer { margin-top: 30px; text-align: right; }
            .signature { margin-top: 50px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medical Prescription</h1>
            <p><strong>Doctor:</strong> ${prescription.doctor.name}</p>
            <p><strong>License:</strong> ${prescription.doctor.licenseNumber}</p>
          </div>

          <div class="patient-info">
            <h3>Patient Information</h3>
            <p><strong>Name:</strong> ${prescription.patient.name}</p>
            <p><strong>Date of Birth:</strong> ${prescription.patient.dateOfBirth}</p>
            <p><strong>Gender:</strong> ${prescription.patient.gender}</p>
          </div>

          <div class="medications">
            <h3>Medications</h3>
            ${prescription.medications.map(med => `
              <div class="medication">
                <p><strong>Drug:</strong> ${med.drugName}</p>
                <p><strong>Dosage:</strong> ${med.dosage}</p>
                <p><strong>Frequency:</strong> ${med.frequency}</p>
                <p><strong>Duration:</strong> ${med.duration}</p>
                <p><strong>Instructions:</strong> ${med.instructions || 'As directed'}</p>
              </div>
            `).join('')}
          </div>

          <div class="footer">
            <p><strong>Diagnosis:</strong> ${prescription.diagnosis}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Valid Till:</strong> ${prescription.validTill?.toLocaleDateString() || 'Not specified'}</p>
          </div>

          <div class="signature">
            <p>______________________________</p>
            <p>Doctor's Signature</p>
            <p>${prescription.doctor.name}</p>
            <p>Registration: ${prescription.doctor.registrationNumber}</p>
          </div>
        </body>
      </html>
    `;

    return htmlContent;
  }

  async getPrescriptionHistory(patientId: string, user: any) {
    const prescriptions = await this.prisma.prescription.findMany({
      where: { patientId },
      include: {
        medications: true,
        doctor: {
          select: { id: true, name: true, specialization: true },
        },
        consultation: {
          select: { id: true, scheduledAt: true, consultationType: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return prescriptions;
  }

  async getPrescriptionById(id: string, user: any) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: {
        medications: true,
        doctor: {
          select: { id: true, name: true, licenseNumber: true, signature: true },
        },
        patient: {
          select: { id: true, name: true, dateOfBirth: true, gender: true },
        },
        consultation: {
          select: { id: true, scheduledAt: true, consultationType: true },
        },
      },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    return prescription;
  }
}
