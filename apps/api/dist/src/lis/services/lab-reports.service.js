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
exports.LabReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const date_fns_1 = require("date-fns");
let LabReportsService = class LabReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generatePatientReport(orderId) {
        const order = await this.prisma.labOrder.findUnique({
            where: { id: orderId },
            include: {
                patient: true,
                physician: true,
                results: {
                    include: {
                        test: true,
                    },
                    orderBy: {
                        resultDateTime: 'asc',
                    },
                },
                samples: {
                    orderBy: {
                        collectedAt: 'asc',
                    },
                },
            },
        });
        if (!order) {
            throw new Error('Order not found');
        }
        const results = order.results.map(result => ({
            testId: result.testId,
            testName: result.test?.name || result.analyte,
            analyte: result.analyte,
            value: result.numericValue || result.textValue,
            unit: result.unit || '',
            flag: result.flag,
            referenceRange: this.formatReferenceRange(result.test),
            resultDateTime: result.resultDateTime || result.createdAt,
            validationStatus: result.validationStatus,
            performedBy: result.performedBy,
        }));
        const summary = this.calculateReportSummary(results);
        return {
            id: `RPT-${orderId}`,
            orderId: order.id,
            patientId: order.patientId,
            patientName: order.patient?.name || 'Unknown',
            patientDOB: order.patient?.dateOfBirth || new Date(),
            physicianName: order.physician?.name,
            orderDate: order.createdAt,
            collectionDate: order.samples[0]?.collectedAt,
            results,
            summary,
            status: this.determineReportStatus(order.results),
            reportType: 'PATIENT',
            tenantId: order.tenantId,
        };
    }
    async generateCumulativeReport(patientId, startDate, endDate) {
        const results = await this.prisma.labResult.findMany({
            where: {
                order: {
                    patientId,
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            },
            include: {
                order: true,
                test: true,
            },
            orderBy: {
                resultDateTime: 'asc',
            },
        });
        const patient = await this.prisma.patient.findUnique({
            where: { id: patientId },
        });
        const resultData = results.map(result => ({
            testId: result.testId,
            testName: result.test?.name || result.analyte,
            analyte: result.analyte,
            value: result.numericValue || result.textValue,
            unit: result.unit || '',
            flag: result.flag,
            referenceRange: this.formatReferenceRange(result.test),
            resultDateTime: result.resultDateTime || result.createdAt,
            validationStatus: result.validationStatus,
            performedBy: result.performedBy,
        }));
        const summary = this.calculateReportSummary(resultData);
        return {
            id: `CUM-${patientId}-${(0, date_fns_1.format)(new Date(), 'yyyyMMdd')}`,
            orderId: '',
            patientId,
            patientName: patient?.name || 'Unknown',
            patientDOB: patient?.dateOfBirth || new Date(),
            orderDate: startDate,
            results: resultData,
            summary,
            status: 'FINAL',
            reportType: 'BOTH',
            tenantId: '',
        };
    }
    async generateWorkloadReport(tenantId, startDate, endDate) {
        const orders = await this.prisma.labOrder.findMany({
            where: {
                tenantId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                results: true,
                samples: true,
                patient: true,
            },
        });
        const summary = {
            totalOrders: orders.length,
            completedOrders: orders.filter(o => o.status === 'COMPLETED').length,
            statOrders: orders.filter(o => o.isStat).length,
            totalTests: orders.reduce((sum, o) => sum + o.results.length, 0),
            totalSamples: orders.reduce((sum, o) => sum + o.samples.length, 0),
            averageTAT: 0,
        };
        const priorityBreakdown = {
            STAT: orders.filter(o => o.priority === 'STAT').length,
            URGENT: orders.filter(o => o.priority === 'URGENT').length,
            ROUTINE: orders.filter(o => o.priority === 'ROUTINE').length,
        };
        const dailyStats = this.calculateDailyStats(orders);
        return {
            summary,
            priorityBreakdown,
            dailyStats,
            period: {
                startDate,
                endDate,
            },
        };
    }
    async generateQCReport(analyzerId, startDate, endDate) {
        const qcRuns = await this.prisma.labQcRun.findMany({
            where: {
                analyzerId,
                runDateTime: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                analyzer: true,
            },
        });
        const passedRuns = qcRuns.filter(run => run.isPassed).length;
        const failedRuns = qcRuns.length - passedRuns;
        const analyteStats = this.calculateQCStatsByAnalyte(qcRuns);
        return {
            analyzer: qcRuns[0]?.analyzer,
            summary: {
                totalRuns: qcRuns.length,
                passedRuns,
                failedRuns,
                passRate: qcRuns.length > 0 ? (passedRuns / qcRuns.length) * 100 : 0,
            },
            analyteStats,
            period: {
                startDate,
                endDate,
            },
        };
    }
    async exportReportToPDF(reportId, format = 'PDF') {
        const report = await this.generatePatientReport(reportId);
        switch (format) {
            case 'PDF':
                return this.generatePDFReport(report);
            case 'CSV':
                return this.generateCSVReport(report);
            case 'EXCEL':
                return this.generateExcelReport(report);
            default:
                return this.generatePDFReport(report);
        }
    }
    formatReferenceRange(test) {
        if (!test?.referenceRanges)
            return '';
        try {
            const ranges = JSON.parse(test.referenceRanges);
            const applicableRange = ranges.find((range) => this.isRangeApplicable(range, test.patientAge, test.patientGender));
            if (applicableRange) {
                return `${applicableRange.low} - ${applicableRange.high} ${applicableRange.unit || ''}`;
            }
        }
        catch (error) {
        }
        return '';
    }
    isRangeApplicable(range, patientAge, patientGender) {
        if (range.minAge !== undefined && patientAge < range.minAge)
            return false;
        if (range.maxAge !== undefined && patientAge > range.maxAge)
            return false;
        if (range.gender && range.gender !== patientGender)
            return false;
        return true;
    }
    calculateReportSummary(results) {
        const abnormalTests = results.filter(r => r.flag === 'ABNORMAL' || r.flag === 'CRITICAL').length;
        const criticalTests = results.filter(r => r.flag === 'CRITICAL').length;
        const pendingTests = results.filter(r => r.validationStatus !== 'FINAL').length;
        const tatHours = results.length > 0 ? 2.5 : 0;
        return {
            totalTests: results.length,
            abnormalTests,
            criticalTests,
            pendingTests,
            tatHours,
        };
    }
    determineReportStatus(results) {
        const hasFinalResults = results.some(r => r.validationStatus === 'FINAL');
        const hasCorrectedResults = results.some(r => r.flag === 'CORRECTED');
        if (hasCorrectedResults)
            return 'CORRECTED';
        if (hasFinalResults)
            return 'FINAL';
        return 'PRELIMINARY';
    }
    calculateDailyStats(orders) {
        const dailyMap = new Map();
        orders.forEach(order => {
            const dateKey = (0, date_fns_1.format)(order.createdAt, 'yyyy-MM-dd');
            if (!dailyMap.has(dateKey)) {
                dailyMap.set(dateKey, {
                    date: dateKey,
                    orders: 0,
                    tests: 0,
                    samples: 0,
                });
            }
            const dayStats = dailyMap.get(dateKey);
            dayStats.orders++;
            dayStats.tests += order.results.length;
            dayStats.samples += order.samples.length;
        });
        return Array.from(dailyMap.values());
    }
    calculateQCStatsByAnalyte(qcRuns) {
        const analyteMap = new Map();
        qcRuns.forEach(run => {
            const results = run.qcResults || [];
            results.forEach((result) => {
                if (!analyteMap.has(result.analyte)) {
                    analyteMap.set(result.analyte, {
                        analyte: result.analyte,
                        totalRuns: 0,
                        passedRuns: 0,
                        averageValue: 0,
                        values: [],
                    });
                }
                const analyteStats = analyteMap.get(result.analyte);
                analyteStats.totalRuns++;
                analyteStats.values.push(result.measuredValue);
                if (run.isPassed) {
                    analyteStats.passedRuns++;
                }
            });
        });
        return Array.from(analyteMap.values()).map(stats => ({
            ...stats,
            passRate: (stats.passedRuns / stats.totalRuns) * 100,
            averageValue: stats.values.reduce((sum, val) => sum + val, 0) / stats.values.length,
        }));
    }
    async generatePDFReport(report) {
        console.log('Generating PDF report for:', report.id);
        return Buffer.from('PDF content placeholder');
    }
    async generateCSVReport(report) {
        const headers = ['Test Name', 'Analyte', 'Value', 'Unit', 'Flag', 'Reference Range', 'Date'];
        const csvContent = [
            headers.join(','),
            ...report.results.map(result => [
                result.testName,
                result.analyte,
                result.value,
                result.unit,
                result.flag,
                result.referenceRange,
                (0, date_fns_1.format)(result.resultDateTime, 'yyyy-MM-dd HH:mm'),
            ].join(',')),
        ].join('\n');
        return Buffer.from(csvContent);
    }
    async generateExcelReport(report) {
        console.log('Generating Excel report for:', report.id);
        return Buffer.from('Excel content placeholder');
    }
};
exports.LabReportsService = LabReportsService;
exports.LabReportsService = LabReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabReportsService);
//# sourceMappingURL=lab-reports.service.js.map