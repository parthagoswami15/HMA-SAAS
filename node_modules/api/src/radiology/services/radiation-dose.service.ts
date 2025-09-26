import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RadiationDoseService {
  constructor(private prisma: PrismaService) {}

  async recordDose(studyId: string, doseData: any): Promise<any> {
    const study = await this.prisma.study.findUnique({
      where: { id: studyId },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
      },
    });

    if (!study) {
      throw new NotFoundException('Study not found');
    }

    // Create radiation dose record
    const doseRecord = await this.prisma.radiationDose.create({
      data: {
        studyId,
        patientId: study.order.patientId,
        modalityType: doseData.modalityType,
        effectiveDose: doseData.effectiveDose,
        dlp: doseData.dlp, // Dose Length Product
        ctdiVol: doseData.ctdiVol, // CT Dose Index Volume
        exposureTime: doseData.exposureTime,
        kvp: doseData.kvp, // Kilovoltage peak
        mas: doseData.mas, // Milliampere-seconds
        recordedBy: doseData.recordedBy,
        recordedAt: new Date(),
        tenantId: study.tenantId,
      },
    });

    // Update cumulative dose for patient
    await this.updateCumulativeDose(study.order.patientId);

    return doseRecord;
  }

  async getStudyDose(studyId: string): Promise<any> {
    const doseRecords = await this.prisma.radiationDose.findMany({
      where: { studyId },
      orderBy: { recordedAt: 'desc' },
    });

    return doseRecords;
  }

  async getPatientCumulativeDose(patientId: string): Promise<any> {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const cumulativeDose = await this.prisma.radiationDose.aggregate({
      where: { patientId },
      _sum: {
        effectiveDose: true,
        dlp: true,
      },
      _count: { id: true },
    });

    const recentStudies = await this.prisma.study.findMany({
      where: {
        order: {
          patientId,
        },
      },
      include: {
        radiationDoses: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { studyDate: 'desc' },
      take: 10,
    });

    return {
      patientId,
      cumulativeEffectiveDose: cumulativeDose._sum.effectiveDose || 0,
      cumulativeDLP: cumulativeDose._sum.dlp || 0,
      totalStudies: cumulativeDose._count.id,
      recentStudies: recentStudies.map(study => ({
        studyInstanceUID: study.studyInstanceUID,
        studyDate: study.studyDate,
        modalityType: study.modalityType,
        latestDose: study.radiationDoses[0] || null,
      })),
    };
  }

  async getPatientDoseHistory(patientId: string, dateFrom?: Date, dateTo?: Date): Promise<any[]> {
    const where: any = { patientId };

    if (dateFrom || dateTo) {
      where.recordedAt = {};
      if (dateFrom) where.recordedAt.gte = dateFrom;
      if (dateTo) where.recordedAt.lte = dateTo;
    }

    const doseRecords = await this.prisma.radiationDose.findMany({
      where,
      include: {
        study: {
          include: {
            order: {
              select: {
                id: true,
                protocol: true,
                bodyPart: true,
              },
            },
          },
        },
      },
      orderBy: { recordedAt: 'desc' },
    });

    return doseRecords.map(record => ({
      id: record.id,
      studyInstanceUID: record.study?.studyInstanceUID,
      studyDate: record.study?.studyDate,
      modalityType: record.modalityType,
      effectiveDose: record.effectiveDose,
      dlp: record.dlp,
      ctdiVol: record.ctdiVol,
      recordedAt: record.recordedAt,
      protocol: record.study?.order?.protocol,
      bodyPart: record.study?.order?.bodyPart,
    }));
  }

  async checkDoseAlerts(patientId: string): Promise<any[]> {
    const alerts = [];

    // Get cumulative dose
    const cumulativeDose = await this.getPatientCumulativeDose(patientId);
    const totalEffectiveDose = cumulativeDose.cumulativeEffectiveDose;

    // Check against diagnostic reference levels
    if (totalEffectiveDose > 100) { // 100 mSv threshold
      alerts.push({
        type: 'HIGH_CUMULATIVE_DOSE',
        level: 'CRITICAL',
        message: `Patient cumulative effective dose exceeds 100 mSv (${totalEffectiveDose.toFixed(2)} mSv)`,
        threshold: 100,
        currentValue: totalEffectiveDose,
      });
    } else if (totalEffectiveDose > 50) { // 50 mSv warning
      alerts.push({
        type: 'HIGH_CUMULATIVE_DOSE',
        level: 'WARNING',
        message: `Patient cumulative effective dose exceeds 50 mSv (${totalEffectiveDose.toFixed(2)} mSv)`,
        threshold: 50,
        currentValue: totalEffectiveDose,
      });
    }

    // Check recent high-dose studies
    const recentHighDose = await this.prisma.radiationDose.findMany({
      where: {
        patientId,
        effectiveDose: { gt: 10 }, // 10 mSv per study
        recordedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      orderBy: { recordedAt: 'desc' },
      take: 5,
    });

    if (recentHighDose.length > 0) {
      alerts.push({
        type: 'RECENT_HIGH_DOSE_STUDIES',
        level: 'WARNING',
        message: `Patient had ${recentHighDose.length} high-dose studies (>10 mSv) in the last 30 days`,
        recentStudies: recentHighDose.map(dose => ({
          studyInstanceUID: dose.study?.studyInstanceUID,
          effectiveDose: dose.effectiveDose,
          recordedAt: dose.recordedAt,
        })),
      });
    }

    return alerts;
  }

  async getModalityDoseStats(modalityType: string, tenantId: string): Promise<any> {
    const doseStats = await this.prisma.radiationDose.aggregate({
      where: {
        modalityType,
        tenantId,
      },
      _count: { id: true },
      _avg: {
        effectiveDose: true,
        dlp: true,
        ctdiVol: true,
      },
      _min: {
        effectiveDose: true,
      },
      _max: {
        effectiveDose: true,
      },
    });

    const recentStudies = await this.prisma.radiationDose.findMany({
      where: {
        modalityType,
        tenantId,
      },
      include: {
        study: {
          include: {
            order: {
              select: {
                patient: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { recordedAt: 'desc' },
      take: 10,
    });

    return {
      modalityType,
      totalStudies: doseStats._count.id,
      averageEffectiveDose: doseStats._avg.effectiveDose || 0,
      averageDLP: doseStats._avg.dlp || 0,
      averageCTDIvol: doseStats._avg.ctdiVol || 0,
      minEffectiveDose: doseStats._min.effectiveDose || 0,
      maxEffectiveDose: doseStats._max.effectiveDose || 0,
      recentStudies: recentStudies.map(dose => ({
        studyInstanceUID: dose.study?.studyInstanceUID,
        patientName: dose.study?.order?.patient
          ? `${dose.study.order.patient.firstName} ${dose.study.order.patient.lastName}`
          : 'Unknown',
        effectiveDose: dose.effectiveDose,
        recordedAt: dose.recordedAt,
      })),
    };
  }

  private async updateCumulativeDose(patientId: string): Promise<void> {
    const cumulativeDose = await this.prisma.radiationDose.aggregate({
      where: { patientId },
      _sum: { effectiveDose: true },
    });

    // Update patient's cumulative dose (assuming patient model has this field)
    // await this.prisma.patient.update({
    //   where: { id: patientId },
    //   data: {
    //     cumulativeRadiationDose: cumulativeDose._sum.effectiveDose || 0,
    //   },
    // });
  }

  async getDoseReport(patientId: string, dateFrom?: Date, dateTo?: Date): Promise<any> {
    const doseHistory = await this.getPatientDoseHistory(patientId, dateFrom, dateTo);
    const cumulativeDose = await this.getPatientCumulativeDose(patientId);
    const alerts = await this.checkDoseAlerts(patientId);

    return {
      patientId,
      cumulativeDose: cumulativeDose.cumulativeEffectiveDose,
      totalStudies: doseHistory.length,
      doseHistory,
      alerts,
      generatedAt: new Date(),
    };
  }
}
