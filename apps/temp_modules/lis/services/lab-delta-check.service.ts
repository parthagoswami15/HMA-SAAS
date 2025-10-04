import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { subDays, differenceInDays } from 'date-fns';

export interface DeltaCheck {
  analyte: string;
  currentValue: number;
  previousValue: number;
  delta: number;
  deltaPercentage: number;
  threshold: number;
  isSignificant: boolean;
  previousDate: Date;
  currentDate: Date;
}

export interface DeltaCheckConfig {
  analyte: string;
  threshold: number; // Percentage threshold for significant change
  timeWindowDays: number; // How far back to look for previous results
  enabled: boolean;
}

@Injectable()
export class LabDeltaCheckService {
  constructor(private prisma: PrismaService) {}

  private defaultConfigs: DeltaCheckConfig[] = [
    { analyte: 'GLUCOSE', threshold: 20, timeWindowDays: 30, enabled: true },
    { analyte: 'CREATININE', threshold: 15, timeWindowDays: 90, enabled: true },
    { analyte: 'POTASSIUM', threshold: 10, timeWindowDays: 7, enabled: true },
    { analyte: 'SODIUM', threshold: 8, timeWindowDays: 7, enabled: true },
    { analyte: 'CALCIUM', threshold: 12, timeWindowDays: 30, enabled: true },
    { analyte: 'HEMOGLOBIN', threshold: 10, timeWindowDays: 60, enabled: true },
    { analyte: 'WBC', threshold: 25, timeWindowDays: 7, enabled: true },
    { analyte: 'PLATELETS', threshold: 20, timeWindowDays: 14, enabled: true },
  ];

  async performDeltaChecks(patientId: string, currentResults: any[]): Promise<DeltaCheck[]> {
    const deltaChecks: DeltaCheck[] = [];

    for (const result of currentResults) {
      const config = this.getDeltaCheckConfig(result.analyte);
      if (!config.enabled) continue;

      const previousResult = await this.findPreviousResult(
        patientId,
        result.analyte,
        config.timeWindowDays
      );

      if (previousResult && previousResult.value) {
        const deltaCheck = this.calculateDelta(
          result.analyte,
          result.value,
          previousResult.value,
          config.threshold,
          previousResult.resultDateTime || previousResult.createdAt,
          result.resultDateTime || new Date()
        );

        if (deltaCheck.isSignificant) {
          deltaChecks.push(deltaCheck);
        }
      }
    }

    return deltaChecks;
  }

  async getDeltaCheckHistory(patientId: string, analyte: string, limit: number = 10): Promise<any[]> {
    const results = await this.prisma.labResult.findMany({
      where: {
        order: {
          patientId,
        },
        analyte,
      },
      include: {
        order: true,
      },
      orderBy: {
        resultDateTime: 'desc',
      },
      take: limit,
    });

    return results;
  }

  async createDeltaCheckAlert(patientId: string, deltaCheck: DeltaCheck): Promise<void> {
    const alert = {
      type: 'DELTA_CHECK',
      message: `Significant change detected in ${deltaCheck.analyte}: ${deltaCheck.deltaPercentage.toFixed(1)}% change (${deltaCheck.currentValue} vs ${deltaCheck.previousValue})`,
      priority: deltaCheck.deltaPercentage > 50 ? 'HIGH' : 'MEDIUM',
      patientId,
      analyte: deltaCheck.analyte,
      metadata: deltaCheck,
    };

    // This would integrate with your notification system
    await this.createAlert(alert);
  }

  async getDeltaCheckConfigs(): Promise<DeltaCheckConfig[]> {
    return this.defaultConfigs;
  }

  async updateDeltaCheckConfig(analyte: string, config: Partial<DeltaCheckConfig>): Promise<DeltaCheckConfig> {
    const existingConfig = this.defaultConfigs.find(c => c.analyte === analyte);
    if (!existingConfig) {
      throw new NotFoundException(`Delta check config for ${analyte} not found`);
    }

    Object.assign(existingConfig, config);
    return existingConfig;
  }

  private getDeltaCheckConfig(analyte: string): DeltaCheckConfig {
    return this.defaultConfigs.find(c => c.analyte === analyte) || {
      analyte,
      threshold: 20,
      timeWindowDays: 30,
      enabled: false,
    };
  }

  private async findPreviousResult(patientId: string, analyte: string, timeWindowDays: number): Promise<any | null> {
    const cutoffDate = subDays(new Date(), timeWindowDays);

    const previousResult = await this.prisma.labResult.findFirst({
      where: {
        order: {
          patientId,
        },
        analyte,
        resultDateTime: {
          lt: new Date(),
          gte: cutoffDate,
        },
        flag: {
          not: 'INVALID',
        },
      },
      include: {
        order: true,
      },
      orderBy: {
        resultDateTime: 'desc',
      },
    });

    return previousResult;
  }

  private calculateDelta(
    analyte: string,
    currentValue: number,
    previousValue: number,
    threshold: number,
    previousDate: Date,
    currentDate: Date
  ): DeltaCheck {
    const delta = currentValue - previousValue;
    const deltaPercentage = Math.abs(((currentValue - previousValue) / previousValue) * 100);

    return {
      analyte,
      currentValue,
      previousValue,
      delta,
      deltaPercentage,
      threshold,
      isSignificant: deltaPercentage >= threshold,
      previousDate,
      currentDate,
    };
  }

  private async createAlert(alert: any): Promise<void> {
    // This would integrate with your notification/alert system
    console.log('Delta check alert:', alert);

    // For now, we'll create a notification in the database
    await this.prisma.labNotification.create({
      data: {
        orderId: '', // Would need to get from context
        message: alert.message,
        type: 'DELTA_CHECK',
        isRead: false,
        tenantId: '', // Would need to get from context
      },
    });
  }

  async getSignificantDeltaChecks(patientId: string, days: number = 30): Promise<DeltaCheck[]> {
    const cutoffDate = subDays(new Date(), days);

    const results = await this.prisma.labResult.findMany({
      where: {
        order: {
          patientId,
        },
        resultDateTime: {
          gte: cutoffDate,
        },
      },
      include: {
        order: true,
      },
      orderBy: {
        resultDateTime: 'desc',
      },
    });

    // Group results by analyte and calculate deltas
    const analyteGroups: { [key: string]: any[] } = {};
    for (const result of results) {
      if (!analyteGroups[result.analyte]) {
        analyteGroups[result.analyte] = [];
      }
      analyteGroups[result.analyte].push(result);
    }

    const significantDeltas: DeltaCheck[] = [];

    for (const [analyte, analyteResults] of Object.entries(analyteGroups)) {
      if (analyteResults.length < 2) continue;

      // Sort by date
      analyteResults.sort((a, b) =>
        (b.resultDateTime || b.createdAt).getTime() - (a.resultDateTime || a.createdAt).getTime()
      );

      const current = analyteResults[0];
      const previous = analyteResults[1];

      if (current.value && previous.value) {
        const deltaCheck = this.calculateDelta(
          analyte,
          current.value,
          previous.value,
          20, // Default threshold
          previous.resultDateTime || previous.createdAt,
          current.resultDateTime || current.createdAt
        );

        if (deltaCheck.isSignificant) {
          significantDeltas.push(deltaCheck);
        }
      }
    }

    return significantDeltas;
  }
}
