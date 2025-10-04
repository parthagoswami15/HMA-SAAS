import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { format, parseISO } from 'date-fns';

export interface LabReport {
  id: string;
  orderId: string;
  patientId: string;
  patientName: string;
  patientDOB: Date;
  physicianName?: string;
  orderDate: Date;
  collectionDate?: Date;
  results: LabResultData[];
  summary: ReportSummary;
  status: 'PRELIMINARY' | 'FINAL' | 'CORRECTED';
  reportType: 'PATIENT' | 'PHYSICIAN' | 'BOTH';
  tenantId: string;
}

export interface LabResultData {
  testId: string;
  testName: string;
  analyte: string;
  value: number | string;
  unit: string;
  flag: string;
  referenceRange: string;
  resultDateTime: Date;
  validationStatus: string;
  performedBy?: string;
}

export interface ReportSummary {
  totalTests: number;
  abnormalTests: number;
  criticalTests: number;
  pendingTests: number;
  tatHours: number;
}

@Injectable()
export class LabReportsService {
  constructor(private prisma: PrismaService) {}

  async generatePatientReport(orderId: string): Promise<LabReport> {
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

  async generateCumulativeReport(patientId: string, startDate: Date, endDate: Date): Promise<LabReport> {
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
      id: `CUM-${patientId}-${format(new Date(), 'yyyyMMdd')}`,
      orderId: '', // Cumulative report doesn't have a single order
      patientId,
      patientName: patient?.name || 'Unknown',
      patientDOB: patient?.dateOfBirth || new Date(),
      orderDate: startDate,
      results: resultData,
      summary,
      status: 'FINAL',
      reportType: 'BOTH',
      tenantId: '', // Would need to get from context
    };
  }

  async generateWorkloadReport(tenantId: string, startDate: Date, endDate: Date): Promise<any> {
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
      averageTAT: 0, // Would calculate from results
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

  async generateQCReport(analyzerId: string, startDate: Date, endDate: Date): Promise<any> {
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

  async exportReportToPDF(reportId: string, format: 'PDF' | 'CSV' | 'EXCEL' = 'PDF'): Promise<Buffer> {
    // This would integrate with a PDF generation library like Puppeteer or PDFKit
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

  private formatReferenceRange(test: any): string {
    if (!test?.referenceRanges) return '';

    try {
      const ranges = JSON.parse(test.referenceRanges);
      const applicableRange = ranges.find((range: any) =>
        this.isRangeApplicable(range, test.patientAge, test.patientGender)
      );

      if (applicableRange) {
        return `${applicableRange.low} - ${applicableRange.high} ${applicableRange.unit || ''}`;
      }
    } catch (error) {
      // If parsing fails, return empty string
    }

    return '';
  }

  private isRangeApplicable(range: any, patientAge: number, patientGender: string): boolean {
    // Check age criteria
    if (range.minAge !== undefined && patientAge < range.minAge) return false;
    if (range.maxAge !== undefined && patientAge > range.maxAge) return false;

    // Check gender criteria
    if (range.gender && range.gender !== patientGender) return false;

    return true;
  }

  private calculateReportSummary(results: LabResultData[]): ReportSummary {
    const abnormalTests = results.filter(r => r.flag === 'ABNORMAL' || r.flag === 'CRITICAL').length;
    const criticalTests = results.filter(r => r.flag === 'CRITICAL').length;
    const pendingTests = results.filter(r => r.validationStatus !== 'FINAL').length;

    // Calculate average TAT (simplified)
    const tatHours = results.length > 0 ? 2.5 : 0; // Placeholder

    return {
      totalTests: results.length,
      abnormalTests,
      criticalTests,
      pendingTests,
      tatHours,
    };
  }

  private determineReportStatus(results: any[]): 'PRELIMINARY' | 'FINAL' | 'CORRECTED' {
    const hasFinalResults = results.some(r => r.validationStatus === 'FINAL');
    const hasCorrectedResults = results.some(r => r.flag === 'CORRECTED');

    if (hasCorrectedResults) return 'CORRECTED';
    if (hasFinalResults) return 'FINAL';
    return 'PRELIMINARY';
  }

  private calculateDailyStats(orders: any[]): any[] {
    const dailyMap = new Map<string, any>();

    orders.forEach(order => {
      const dateKey = format(order.createdAt, 'yyyy-MM-dd');

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

  private calculateQCStatsByAnalyte(qcRuns: any[]): any[] {
    const analyteMap = new Map<string, any>();

    qcRuns.forEach(run => {
      const results = run.qcResults || [];

      results.forEach((result: any) => {
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
      averageValue: stats.values.reduce((sum: number, val: number) => sum + val, 0) / stats.values.length,
    }));
  }

  private async generatePDFReport(report: LabReport): Promise<Buffer> {
    // This would integrate with a PDF generation library
    // For now, return a placeholder buffer
    console.log('Generating PDF report for:', report.id);

    // This would be implemented with a library like Puppeteer or PDFKit
    // const pdfBuffer = await this.pdfService.generateLabReport(report);
    // return pdfBuffer;

    return Buffer.from('PDF content placeholder');
  }

  private async generateCSVReport(report: LabReport): Promise<Buffer> {
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
        format(result.resultDateTime, 'yyyy-MM-dd HH:mm'),
      ].join(',')),
    ].join('\n');

    return Buffer.from(csvContent);
  }

  private async generateExcelReport(report: LabReport): Promise<Buffer> {
    // This would integrate with a library like ExcelJS
    console.log('Generating Excel report for:', report.id);

    // This would be implemented with ExcelJS or similar
    // const excelBuffer = await this.excelService.generateLabReport(report);
    // return excelBuffer;

    return Buffer.from('Excel content placeholder');
  }
}
