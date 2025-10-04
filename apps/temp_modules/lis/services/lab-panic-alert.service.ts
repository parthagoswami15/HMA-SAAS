import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface PanicAlert {
  id: string;
  orderId: string;
  patientId: string;
  analyte: string;
  value: number;
  unit: string;
  flag: string;
  referenceLow?: number;
  referenceHigh?: number;
  alertLevel: 'CRITICAL' | 'PANIC';
  message: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  notifiedUsers: string[];
  tenantId: string;
}

export interface PanicThreshold {
  analyte: string;
  criticalLow?: number;
  criticalHigh?: number;
  panicLow?: number;
  panicHigh?: number;
  unit: string;
}

@Injectable()
export class LabPanicAlertService {
  constructor(private prisma: PrismaService) {}

  private defaultThresholds: PanicThreshold[] = [
    { analyte: 'GLUCOSE', criticalLow: 50, criticalHigh: 400, panicLow: 30, panicHigh: 600, unit: 'mg/dL' },
    { analyte: 'POTASSIUM', criticalLow: 3.0, criticalHigh: 6.0, panicLow: 2.5, panicHigh: 7.0, unit: 'mmol/L' },
    { analyte: 'SODIUM', criticalLow: 125, criticalHigh: 155, panicLow: 120, panicHigh: 160, unit: 'mmol/L' },
    { analyte: 'CALCIUM', criticalLow: 7.0, criticalHigh: 12.0, panicLow: 6.0, panicHigh: 14.0, unit: 'mg/dL' },
    { analyte: 'HEMOGLOBIN', criticalLow: 7.0, panicHigh: 20.0, unit: 'g/dL' },
    { analyte: 'WBC', criticalLow: 2.0, criticalHigh: 30.0, unit: 'K/uL' },
    { analyte: 'PLATELETS', criticalLow: 50, criticalHigh: 1000, unit: 'K/uL' },
    { analyte: 'TROPONIN', criticalHigh: 0.1, panicHigh: 1.0, unit: 'ng/mL' },
    { analyte: 'CREATININE', criticalHigh: 3.0, panicHigh: 5.0, unit: 'mg/dL' },
  ];

  async checkForPanicAlerts(orderId: string, results: any[]): Promise<PanicAlert[]> {
    const panicAlerts: PanicAlert[] = [];

    for (const result of results) {
      const alert = await this.evaluateResultForPanic(result);
      if (alert) {
        panicAlerts.push(alert);
      }
    }

    // Save panic alerts to database
    for (const alert of panicAlerts) {
      await this.createPanicAlert(alert);
    }

    return panicAlerts;
  }

  async evaluateResultForPanic(result: any): Promise<PanicAlert | null> {
    const threshold = this.getPanicThreshold(result.analyte);

    if (!threshold) {
      return null;
    }

    let alertLevel: 'CRITICAL' | 'PANIC' | null = null;
    let message = '';

    // Check for panic values
    if (threshold.panicLow && result.value < threshold.panicLow) {
      alertLevel = 'PANIC';
      message = `PANIC: ${result.analyte} critically low at ${result.value} ${threshold.unit}`;
    } else if (threshold.panicHigh && result.value > threshold.panicHigh) {
      alertLevel = 'PANIC';
      message = `PANIC: ${result.analyte} critically high at ${result.value} ${threshold.unit}`;
    }
    // Check for critical values
    else if (threshold.criticalLow && result.value < threshold.criticalLow) {
      alertLevel = 'CRITICAL';
      message = `CRITICAL: ${result.analyte} critically low at ${result.value} ${threshold.unit}`;
    } else if (threshold.criticalHigh && result.value > threshold.criticalHigh) {
      alertLevel = 'CRITICAL';
      message = `CRITICAL: ${result.analyte} critically high at ${result.value} ${threshold.unit}`;
    }

    if (alertLevel) {
      return {
        id: '', // Will be set when saved
        orderId: result.orderId,
        patientId: '', // Will be set from order
        analyte: result.analyte,
        value: result.value,
        unit: result.unit || threshold.unit,
        flag: result.flag,
        referenceLow: threshold.criticalLow,
        referenceHigh: threshold.criticalHigh,
        alertLevel,
        message,
        acknowledged: false,
        notifiedUsers: [],
        tenantId: '', // Will be set from context
      };
    }

    return null;
  }

  async createPanicAlert(alert: PanicAlert): Promise<void> {
    // Get patient ID from order
    const order = await this.prisma.labOrder.findUnique({
      where: { id: alert.orderId },
      select: { patientId: true, tenantId: true },
    });

    if (!order) return;

    // Use raw SQL query to create panic alert
    await this.prisma.$queryRaw`
      INSERT INTO lab_panic_alerts (
        id, orderId, patientId, analyte, value, unit, flag,
        referenceLow, referenceHigh, alertLevel, message,
        acknowledged, tenantId, createdAt, updatedAt
      ) VALUES (
        ${alert.id || `pa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`},
        ${alert.orderId},
        ${order.patientId},
        ${alert.analyte},
        ${alert.value},
        ${alert.unit},
        ${alert.flag},
        ${alert.referenceLow},
        ${alert.referenceHigh},
        ${alert.alertLevel},
        ${alert.message},
        ${alert.acknowledged},
        ${order.tenantId},
        NOW(),
        NOW()
      )
    `;

    // Notify relevant users (this would integrate with your notification system)
    await this.notifyClinicians(alert.id || '', alert.message, alert.alertLevel);
  }

  async getActivePanicAlerts(tenantId: string): Promise<any[]> {
    return this.prisma.$queryRaw`
      SELECT
        pa.*,
        lo.patientId,
        p.firstName,
        p.lastName,
        p.email as patientEmail
      FROM lab_panic_alerts pa
      LEFT JOIN lab_orders lo ON pa.orderId = lo.id
      LEFT JOIN patients p ON lo.patientId = p.id
      WHERE pa.tenantId = ${tenantId}
        AND pa.acknowledged = false
      ORDER BY pa.createdAt DESC
    `;
  }

  async acknowledgePanicAlert(alertId: string, userId: string): Promise<void> {
    await this.prisma.$queryRaw`
      UPDATE lab_panic_alerts
      SET acknowledged = true,
          acknowledgedBy = ${userId},
          acknowledgedAt = NOW(),
          updatedAt = NOW()
      WHERE id = ${alertId}
    `;
  }

  async getPanicThresholds(): Promise<PanicThreshold[]> {
    return this.defaultThresholds;
  }

  async updatePanicThreshold(analyte: string, threshold: Partial<PanicThreshold>): Promise<PanicThreshold> {
    const existingThreshold = this.defaultThresholds.find(t => t.analyte === analyte);
    if (!existingThreshold) {
      throw new Error(`Panic threshold for ${analyte} not found`);
    }

    Object.assign(existingThreshold, threshold);
    return existingThreshold;
  }

  async getPanicAlertsByPatient(patientId: string): Promise<any[]> {
    return this.prisma.$queryRaw`
      SELECT
        pa.*,
        lo.visitId,
        lo.orderingPhysician
      FROM lab_panic_alerts pa
      LEFT JOIN lab_orders lo ON pa.orderId = lo.id
      WHERE pa.patientId = ${patientId}
      ORDER BY pa.createdAt DESC
    `;
  }

  async getPanicAlertStatistics(tenantId: string, days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [totalAlertsResult, acknowledgedAlertsResult, panicLevelAlertsResult] = await Promise.all([
      this.prisma.$queryRaw`SELECT COUNT(*) as count FROM lab_panic_alerts WHERE tenantId = ${tenantId} AND createdAt >= ${startDate}`,
      this.prisma.$queryRaw`SELECT COUNT(*) as count FROM lab_panic_alerts WHERE tenantId = ${tenantId} AND acknowledged = true AND createdAt >= ${startDate}`,
      this.prisma.$queryRaw`SELECT COUNT(*) as count FROM lab_panic_alerts WHERE tenantId = ${tenantId} AND alertLevel = 'PANIC' AND createdAt >= ${startDate}`
    ]);

    const totalAlerts = Number((totalAlertsResult as any)[0]?.count || 0);
    const acknowledgedAlerts = Number((acknowledgedAlertsResult as any)[0]?.count || 0);
    const panicLevelAlerts = Number((panicLevelAlertsResult as any)[0]?.count || 0);

    return {
      totalAlerts,
      acknowledgedAlerts,
      pendingAlerts: totalAlerts - acknowledgedAlerts,
      panicLevelAlerts,
      acknowledgmentRate: totalAlerts > 0 ? (acknowledgedAlerts / totalAlerts) * 100 : 0,
    };
  }

  private getPanicThreshold(analyte: string): PanicThreshold | undefined {
    return this.defaultThresholds.find(t => t.analyte === analyte);
  }

  private async notifyClinicians(alertId: string, message: string, alertLevel: string): Promise<void> {
    // This would integrate with your notification system
    console.log(`PANIC ALERT [${alertLevel}]: ${message}`);

    // Get clinicians to notify (this would be based on your user roles and patient assignments)
    const clinicians = await this.getCliniciansToNotify();

    for (const clinician of clinicians) {
      // Send notification through your preferred channel (email, SMS, push notification, etc.)
      await this.sendNotification(clinician.id, {
        type: 'PANIC_ALERT',
        title: `Critical Lab Result - ${alertLevel}`,
        message,
        priority: alertLevel === 'PANIC' ? 'urgent' : 'high',
      });
    }

    // Update the alert with notified users using raw SQL
    if (clinicians.length > 0) {
      await this.prisma.$queryRaw`
        UPDATE lab_panic_alerts
        SET notifiedUsers = ${JSON.stringify(clinicians.map(c => c.id))},
            updatedAt = NOW()
        WHERE id = ${alertId}
      `;
    }
  }

  private async getCliniciansToNotify(): Promise<any[]> {
    // This would get clinicians based on your user role system
    // For now, return empty array as this would be implementation-specific
    return [];
  }

  private async sendNotification(userId: string, notification: any): Promise<void> {
    // This would integrate with your notification system
    console.log(`Sending notification to user ${userId}:`, notification);

    // Create notification record using raw SQL
    await this.prisma.$queryRaw`
      INSERT INTO lab_notifications (
        id, orderId, message, type, isRead, tenantId, createdAt, updatedAt
      ) VALUES (
        ${`notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`},
        ${notification.orderId || ''},
        ${notification.message},
        ${notification.type || 'INFO'},
        ${false},
        ${notification.tenantId || ''},
        NOW(),
        NOW()
      )
    `;
  }
}
