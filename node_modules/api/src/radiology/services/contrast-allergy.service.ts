import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ContrastAllergyService {
  constructor(private prisma: PrismaService) {}

  async recordContrastAllergy(allergyData: any): Promise<any> {
    const { patientId, contrastType, reactionType, severity, requiresAlert, notes } = allergyData;

    // Check if patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Create contrast allergy record
    const allergy = await this.prisma.contrastAllergy.create({
      data: {
        patientId,
        contrastType,
        reactionType,
        severity,
        requiresAlert: requiresAlert ?? true,
        notes,
        recordedAt: new Date(),
        tenantId: patient.tenantId,
      },
    });

    return allergy;
  }

  async getPatientAllergies(patientId: string): Promise<any[]> {
    const allergies = await this.prisma.contrastAllergy.findMany({
      where: { patientId },
      orderBy: { recordedAt: 'desc' },
    });

    return allergies;
  }

  async checkContrastAllergy(patientId: string, contrastType: string): Promise<any> {
    const allergy = await this.prisma.contrastAllergy.findFirst({
      where: {
        patientId,
        contrastType,
        requiresAlert: true,
      },
    });

    if (allergy) {
      return {
        hasAllergy: true,
        allergy,
        recommendation: this.getContrastRecommendation(allergy.severity, contrastType),
      };
    }

    return {
      hasAllergy: false,
      recommendation: 'Proceed with standard contrast protocol',
    };
  }

  async updateAllergy(allergyId: string, updateData: any): Promise<any> {
    const allergy = await this.prisma.contrastAllergy.findUnique({
      where: { id: allergyId },
    });

    if (!allergy) {
      throw new NotFoundException('Contrast allergy record not found');
    }

    return this.prisma.contrastAllergy.update({
      where: { id: allergyId },
      data: updateData,
    });
  }

  async getAllergyAlerts(patientId: string): Promise<any[]> {
    const alerts = await this.prisma.contrastAllergy.findMany({
      where: {
        patientId,
        requiresAlert: true,
      },
    });

    return alerts.map(allergy => ({
      id: allergy.id,
      contrastType: allergy.contrastType,
      severity: allergy.severity,
      reactionType: allergy.reactionType,
      recordedAt: allergy.recordedAt,
      alertLevel: this.getAlertLevel(allergy.severity),
      message: `Patient has ${allergy.severity.toLowerCase()} ${allergy.contrastType} contrast allergy`,
    }));
  }

  async getContrastProtocol(patientId: string, contrastType: string): Promise<any> {
    const allergyCheck = await this.checkContrastAllergy(patientId, contrastType);

    if (allergyCheck.hasAllergy) {
      return {
        canProceed: false,
        protocol: 'PREMEDICATION_REQUIRED',
        instructions: this.getPremedicationInstructions(allergyCheck.allergy.severity),
        alternativeContrast: this.getAlternativeContrast(contrastType),
        monitoring: this.getMonitoringRequirements(allergyCheck.allergy.severity),
      };
    }

    return {
      canProceed: true,
      protocol: 'STANDARD',
      instructions: 'Standard contrast administration protocol',
      monitoring: 'Standard monitoring (blood pressure, heart rate)',
    };
  }

  async getAllergyStatistics(tenantId: string): Promise<any> {
    const totalPatients = await this.prisma.patient.count({ where: { tenantId } });

    const allergyStats = await this.prisma.contrastAllergy.groupBy({
      by: ['contrastType', 'severity'],
      where: { tenantId },
      _count: { id: true },
    });

    const patientsWithAllergies = await this.prisma.contrastAllergy.findMany({
      where: { tenantId },
      select: { patientId: true },
      distinct: ['patientId'],
    });

    const recentAllergies = await this.prisma.contrastAllergy.findMany({
      where: {
        tenantId,
        recordedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { recordedAt: 'desc' },
    });

    return {
      totalPatients,
      patientsWithAllergies: patientsWithAllergies.length,
      allergyPrevalence: totalPatients > 0 ? (patientsWithAllergies.length / totalPatients) * 100 : 0,
      allergiesByType: this.groupAllergiesByType(allergyStats),
      recentAllergies,
    };
  }

  private getContrastRecommendation(severity: string, contrastType: string): string {
    switch (severity) {
      case 'MILD':
        return 'Premedication recommended. Use alternative contrast if possible.';
      case 'MODERATE':
        return 'Premedication required. Consider alternative imaging modality.';
      case 'SEVERE':
        return 'Contraindicated. Use alternative imaging modality.';
      default:
        return 'Proceed with caution and appropriate premedication.';
    }
  }

  private getPremedicationInstructions(severity: string): string {
    switch (severity) {
      case 'MILD':
        return 'Prednisone 50mg PO 13h, 7h, and 1h before contrast. Diphenhydramine 50mg PO 1h before contrast.';
      case 'MODERATE':
        return 'Prednisone 50mg PO 13h, 7h, and 1h before contrast. Diphenhydramine 50mg PO 1h before contrast. Consider IV corticosteroids.';
      case 'SEVERE':
        return 'Contraindicated. Alternative imaging required.';
      default:
        return 'Standard premedication protocol with corticosteroids and antihistamines.';
    }
  }

  private getAlternativeContrast(contrastType: string): string {
    switch (contrastType) {
      case 'IODINATED':
        return 'Gadolinium-based (if MRI compatible)';
      case 'GADOLINIUM':
        return 'Iodinated (if CT compatible)';
      default:
        return 'Consider non-contrast imaging or alternative modality';
    }
  }

  private getMonitoringRequirements(severity: string): string {
    switch (severity) {
      case 'MILD':
        return 'Monitor vital signs every 15 minutes for 30 minutes post-contrast';
      case 'MODERATE':
        return 'Monitor vital signs continuously during and 30 minutes post-contrast. Emergency equipment ready.';
      case 'SEVERE':
        return 'Contraindicated. Alternative imaging required.';
      default:
        return 'Standard monitoring protocol';
    }
  }

  private getAlertLevel(severity: string): string {
    switch (severity) {
      case 'MILD':
        return 'WARNING';
      case 'MODERATE':
        return 'CRITICAL';
      case 'SEVERE':
        return 'CRITICAL';
      default:
        return 'WARNING';
    }
  }

  private groupAllergiesByType(allergyStats: any[]): Record<string, any> {
    const grouped: Record<string, any> = {};

    allergyStats.forEach(stat => {
      if (!grouped[stat.contrastType]) {
        grouped[stat.contrastType] = {};
      }
      grouped[stat.contrastType][stat.severity.toLowerCase()] = stat._count.id;
    });

    return grouped;
  }

  async createAllergyAlert(patientId: string, contrastType: string): Promise<any> {
    const allergyCheck = await this.checkContrastAllergy(patientId, contrastType);

    if (allergyCheck.hasAllergy) {
      return this.prisma.notification.create({
        data: {
          type: 'ALERT',
          title: 'Contrast Allergy Alert',
          message: `Patient has known ${contrastType} contrast allergy. ${allergyCheck.recommendation}`,
          userId: patientId, // This should be the radiologist's user ID
          metadata: {
            patientId,
            contrastType,
            allergyId: allergyCheck.allergy.id,
            severity: allergyCheck.allergy.severity,
          },
        },
      });
    }

    return null;
  }
}
