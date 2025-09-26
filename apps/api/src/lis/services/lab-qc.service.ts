import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQcRunDto, QcRunResponseDto } from '../dto/lab-analyzer.dto';

@Injectable()
export class LabQcService {
  constructor(private prisma: PrismaService) {}

  async createQcRun(createQcRunDto: CreateQcRunDto): Promise<QcRunResponseDto> {
    try {
      const qcRun = await this.prisma.labQcRun.create({
        data: {
          ...createQcRunDto,
          isPassed: false,
          westgardRules: [],
        },
        include: {
          analyzer: true,
        },
      });

      return this.mapToResponseDto(qcRun);
    } catch (error) {
      throw new BadRequestException('Failed to create QC run');
    }
  }

  async getAllQcRuns(filters?: any): Promise<QcRunResponseDto[]> {
    const qcRuns = await this.prisma.labQcRun.findMany({
      where: {
        ...(filters?.analyzerId && { analyzerId: filters.analyzerId }),
        ...(filters?.isPassed !== undefined && { isPassed: filters.isPassed }),
        ...(filters?.operator && { operator: { contains: filters.operator, mode: 'insensitive' } }),
        ...(filters?.dateFrom && filters?.dateTo && {
          runDateTime: {
            gte: filters.dateFrom,
            lte: filters.dateTo,
          },
        }),
      },
      include: {
        analyzer: true,
      },
      orderBy: {
        runDateTime: 'desc',
      },
    });

    return qcRuns.map(qcRun => this.mapToResponseDto(qcRun));
  }

  async getQcRunById(id: string): Promise<QcRunResponseDto> {
    const qcRun = await this.prisma.labQcRun.findUnique({
      where: { id },
      include: {
        analyzer: true,
      },
    });

    if (!qcRun) {
      throw new NotFoundException('QC run not found');
    }

    return this.mapToResponseDto(qcRun);
  }

  async updateQcRun(id: string, updateData: any): Promise<QcRunResponseDto> {
    try {
      const qcRun = await this.prisma.labQcRun.update({
        where: { id },
        data: updateData,
        include: {
          analyzer: true,
        },
      });

      return this.mapToResponseDto(qcRun);
    } catch (error) {
      throw new BadRequestException('Failed to update QC run');
    }
  }

  async deleteQcRun(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.labQcRun.delete({
        where: { id },
      });

      return { message: 'QC run deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete QC run');
    }
  }

  async evaluateQcRun(id: string): Promise<QcRunResponseDto> {
    const qcRun = await this.prisma.labQcRun.findUnique({
      where: { id },
      include: {
        analyzer: true,
      },
    });

    if (!qcRun) {
      throw new NotFoundException('QC run not found');
    }

    // Parse QC results and evaluate
    const qcResults = qcRun.qcResults as any[];
    const qcBatches = qcRun.qcBatches as any[];

    const evaluation = this.evaluateQcResults(qcResults, qcBatches);

    const updatedQcRun = await this.prisma.labQcRun.update({
      where: { id },
      data: {
        isPassed: evaluation.passed,
        westgardRules: evaluation.westgardRules,
        qcResults: evaluation.processedResults,
      },
      include: {
        analyzer: true,
      },
    });

    return this.mapToResponseDto(updatedQcRun);
  }

  async getQcRunsByAnalyzer(analyzerId: string): Promise<QcRunResponseDto[]> {
    const qcRuns = await this.prisma.labQcRun.findMany({
      where: { analyzerId },
      include: {
        analyzer: true,
      },
      orderBy: {
        runDateTime: 'desc',
      },
    });

    return qcRuns.map(qcRun => this.mapToResponseDto(qcRun));
  }

  async getQcRunsByDateRange(dateFrom: Date, dateTo: Date): Promise<QcRunResponseDto[]> {
    const qcRuns = await this.prisma.labQcRun.findMany({
      where: {
        runDateTime: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      include: {
        analyzer: true,
      },
      orderBy: {
        runDateTime: 'desc',
      },
    });

    return qcRuns.map(qcRun => this.mapToResponseDto(qcRun));
  }

  async getFailedQcRuns(): Promise<QcRunResponseDto[]> {
    const qcRuns = await this.prisma.labQcRun.findMany({
      where: { isPassed: false },
      include: {
        analyzer: true,
      },
      orderBy: {
        runDateTime: 'desc',
      },
    });

    return qcRuns.map(qcRun => this.mapToResponseDto(qcRun));
  }

  async getRecentQcRuns(days: number = 30): Promise<QcRunResponseDto[]> {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const qcRuns = await this.prisma.labQcRun.findMany({
      where: {
        runDateTime: {
          gte: dateFrom,
        },
      },
      include: {
        analyzer: true,
      },
      orderBy: {
        runDateTime: 'desc',
      },
    });

    return qcRuns.map(qcRun => this.mapToResponseDto(qcRun));
  }

  private evaluateQcResults(qcResults: any[], qcBatches: any[]) {
    const processedResults = [];
    const westgardRules = [];
    let passed = true;

    for (const result of qcResults) {
      const batch = qcBatches.find(b => b.analyte === result.analyte && b.lotNumber === result.lotNumber);

      if (!batch) continue;

      // Calculate deviation and determine if within range
      const deviation = result.measuredValue - (batch.targetValue || 0);
      const expectedDeviation = batch.targetSd || 0;
      const withinRange = Math.abs(deviation) <= (expectedDeviation * 3); // 3SD rule

      processedResults.push({
        ...result,
        expectedValue: batch.targetValue,
        deviation,
        withinRange,
      });

      if (!withinRange) {
        passed = false;
        westgardRules.push('1_3S'); // 1 result > 3SD
      }
    }

    return {
      passed,
      westgardRules,
      processedResults,
    };
  }

  private mapToResponseDto(qcRun: any): QcRunResponseDto {
    return {
      id: qcRun.id,
      analyzerId: qcRun.analyzerId,
      qcBatches: qcRun.qcBatches as any,
      qcResults: qcRun.qcResults as any,
      operator: qcRun.operator,
      runDateTime: qcRun.runDateTime,
      notes: qcRun.notes,
      isPassed: qcRun.isPassed,
      westgardRules: qcRun.westgardRules,
      createdAt: qcRun.createdAt,
      updatedAt: qcRun.updatedAt,
    };
  }
}
