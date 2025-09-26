"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabPanicAlertService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LabPanicAlertService = class LabPanicAlertService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    defaultThresholds = [
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
    async checkForPanicAlerts(orderId, results) {
        const panicAlerts = [];
        for (const result of results) {
            const alert = await this.evaluateResultForPanic(result);
            if (alert) {
                panicAlerts.push(alert);
            }
        }
        for (const alert of panicAlerts) {
            await this.createPanicAlert(alert);
        }
        return panicAlerts;
    }
    async evaluateResultForPanic(result) {
        const threshold = this.getPanicThreshold(result.analyte);
        if (!threshold) {
            return null;
        }
        let alertLevel = null;
        let message = '';
        if (threshold.panicLow && result.value < threshold.panicLow) {
            alertLevel = 'PANIC';
            message = `PANIC: ${result.analyte} critically low at ${result.value} ${threshold.unit}`;
        }
        else if (threshold.panicHigh && result.value > threshold.panicHigh) {
            alertLevel = 'PANIC';
            message = `PANIC: ${result.analyte} critically high at ${result.value} ${threshold.unit}`;
        }
        else if (threshold.criticalLow && result.value < threshold.criticalLow) {
            alertLevel = 'CRITICAL';
            message = `CRITICAL: ${result.analyte} critically low at ${result.value} ${threshold.unit}`;
        }
        else if (threshold.criticalHigh && result.value > threshold.criticalHigh) {
            alertLevel = 'CRITICAL';
            message = `CRITICAL: ${result.analyte} critically high at ${result.value} ${threshold.unit}`;
        }
        if (alertLevel) {
            return {
                id: '',
                orderId: result.orderId,
                patientId: '',
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
                tenantId: '',
            };
        }
        return null;
    }
    async createPanicAlert(alert) {
        const order = await this.prisma.labOrder.findUnique({
            where: { id: alert.orderId },
            select: { patientId: true, tenantId: true },
        });
        if (!order)
            return;
        await this.prisma.$queryRaw `
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
        await this.notifyClinicians(alert.id || '', alert.message, alert.alertLevel);
    }
    async getActivePanicAlerts(tenantId) {
        return this.prisma.$queryRaw `
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
    async acknowledgePanicAlert(alertId, userId) {
        await this.prisma.$queryRaw `
      UPDATE lab_panic_alerts
      SET acknowledged = true,
          acknowledgedBy = ${userId},
          acknowledgedAt = NOW(),
          updatedAt = NOW()
      WHERE id = ${alertId}
    `;
    }
    async getPanicThresholds() {
        return this.defaultThresholds;
    }
    async updatePanicThreshold(analyte, threshold) {
        const existingThreshold = this.defaultThresholds.find(t => t.analyte === analyte);
        if (!existingThreshold) {
            throw new Error(`Panic threshold for ${analyte} not found`);
        }
        Object.assign(existingThreshold, threshold);
        return existingThreshold;
    }
    async getPanicAlertsByPatient(patientId) {
        return this.prisma.$queryRaw `
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
    async getPanicAlertStatistics(tenantId, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const [totalAlertsResult, acknowledgedAlertsResult, panicLevelAlertsResult] = await Promise.all([
            this.prisma.$queryRaw `SELECT COUNT(*) as count FROM lab_panic_alerts WHERE tenantId = ${tenantId} AND createdAt >= ${startDate}`,
            this.prisma.$queryRaw `SELECT COUNT(*) as count FROM lab_panic_alerts WHERE tenantId = ${tenantId} AND acknowledged = true AND createdAt >= ${startDate}`,
            this.prisma.$queryRaw `SELECT COUNT(*) as count FROM lab_panic_alerts WHERE tenantId = ${tenantId} AND alertLevel = 'PANIC' AND createdAt >= ${startDate}`
        ]);
        const totalAlerts = Number(totalAlertsResult[0]?.count || 0);
        const acknowledgedAlerts = Number(acknowledgedAlertsResult[0]?.count || 0);
        const panicLevelAlerts = Number(panicLevelAlertsResult[0]?.count || 0);
        return {
            totalAlerts,
            acknowledgedAlerts,
            pendingAlerts: totalAlerts - acknowledgedAlerts,
            panicLevelAlerts,
            acknowledgmentRate: totalAlerts > 0 ? (acknowledgedAlerts / totalAlerts) * 100 : 0,
        };
    }
    getPanicThreshold(analyte) {
        return this.defaultThresholds.find(t => t.analyte === analyte);
    }
    async notifyClinicians(alertId, message, alertLevel) {
        console.log(`PANIC ALERT [${alertLevel}]: ${message}`);
        const clinicians = await this.getCliniciansToNotify();
        for (const clinician of clinicians) {
            await this.sendNotification(clinician.id, {
                type: 'PANIC_ALERT',
                title: `Critical Lab Result - ${alertLevel}`,
                message,
                priority: alertLevel === 'PANIC' ? 'urgent' : 'high',
            });
        }
        if (clinicians.length > 0) {
            await this.prisma.$queryRaw `
        UPDATE lab_panic_alerts
        SET notifiedUsers = ${JSON.stringify(clinicians.map(c => c.id))},
            updatedAt = NOW()
        WHERE id = ${alertId}
      `;
        }
    }
    async getCliniciansToNotify() {
        return [];
    }
    async sendNotification(userId, notification) {
        console.log(`Sending notification to user ${userId}:`, notification);
        await this.prisma.$queryRaw `
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
};
exports.LabPanicAlertService = LabPanicAlertService;
exports.LabPanicAlertService = LabPanicAlertService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabPanicAlertService);
//# sourceMappingURL=lab-panic-alert.service.js.map