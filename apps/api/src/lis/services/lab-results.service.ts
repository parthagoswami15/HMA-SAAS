import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLabResultDto, UpdateLabResultDto, LabResultResponseDto, ResultFlag, ValidationStatus } from '../dto/lab-result.dto';
import { LabValidationService } from './lab-validation.service';

@Injectable()
export class LabResultsService {
  constructor(
    private prisma: PrismaService,
    private validationService: LabValidationService,
  ) {}

  async createResult(createResultDto: CreateLabResultDto): Promise<LabResultResponseDto> {
    try {
      const result = await this.prisma.labResult.create({
        data: {
          ...createResultDto,
          flag: createResultDto.flag || ResultFlag.PENDING,
          validationStatus: createResultDto.validationStatus || ValidationStatus.PENDING,
        },
        include: {
          order: true,
          test: true,
        },
      });

      return this.mapToResponseDto(result);
    } catch (error) {
      throw new BadRequestException('Failed to create lab result');
    }
  }

  async getAllResults(filters?: any): Promise<LabResultResponseDto[]> {
    const results = await this.prisma.labResult.findMany({
      where: {
        ...(filters?.orderId && { orderId: filters.orderId }),
        ...(filters?.testId && { testId: filters.testId }),
        ...(filters?.validationStatus && { validationStatus: filters.validationStatus }),
        ...(filters?.flag && { flag: filters.flag }),
        ...(filters?.dateFrom && filters?.dateTo && {
          resultDateTime: {
            gte: filters.dateFrom,
            lte: filters.dateTo,
          },
        }),
      },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
        test: true,
      },
      orderBy: {
        resultDateTime: 'desc',
      },
    });

    return results.map(result => this.mapToResponseDto(result));
  }

  async getResultById(id: string): Promise<LabResultResponseDto> {
    const result = await this.prisma.labResult.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
        test: true,
      },
    });

    if (!result) {
      throw new NotFoundException('Lab result not found');
    }

    return this.mapToResponseDto(result);
  }

  async updateResult(id: string, updateResultDto: UpdateLabResultDto): Promise<LabResultResponseDto> {
    try {
      const result = await this.prisma.labResult.update({
        where: { id },
        data: updateResultDto,
        include: {
          order: {
            include: {
              patient: true,
            },
          },
          test: true,
        },
      });

      return this.mapToResponseDto(result);
    } catch (error) {
      throw new BadRequestException('Failed to update lab result');
    }
  }

  async deleteResult(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.labResult.delete({
        where: { id },
      });

      return { message: 'Lab result deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete lab result');
    }
  }

  async getResultsByOrder(orderId: string): Promise<LabResultResponseDto[]> {
    const results = await this.prisma.labResult.findMany({
      where: { orderId },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
        test: true,
      },
      orderBy: {
        resultDateTime: 'desc',
      },
    });

    return results.map(result => this.mapToResponseDto(result));
  }

  async getResultsByTest(testId: string, dateFrom?: Date, dateTo?: Date): Promise<LabResultResponseDto[]> {
    const results = await this.prisma.labResult.findMany({
      where: {
        testId,
        ...(dateFrom && dateTo && {
          resultDateTime: {
            gte: dateFrom,
            lte: dateTo,
          },
        }),
      },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
        test: true,
      },
      orderBy: {
        resultDateTime: 'desc',
      },
    });

    return results.map(result => this.mapToResponseDto(result));
  }

  async validateResult(id: string, validatedBy: string): Promise<LabResultResponseDto> {
    const validationResult = await this.validationService.validateResult(id, validatedBy);

    return this.getResultById(id);
  }

  async reviewResult(id: string, reviewedBy: string): Promise<LabResultResponseDto> {
    const result = await this.prisma.labResult.update({
      where: { id },
      data: {
        validationStatus: ValidationStatus.PATH_REVIEWED,
        reviewedBy,
        reviewedAt: new Date(),
      },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
        test: true,
      },
    });

    return this.mapToResponseDto(result);
  }

  async finalizeResult(id: string, finalizedBy: string): Promise<LabResultResponseDto> {
    const result = await this.prisma.labResult.update({
      where: { id },
      data: {
        validationStatus: ValidationStatus.FINAL,
        validatedBy: finalizedBy,
        validatedAt: new Date(),
      },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
        test: true,
      },
    });

    return this.mapToResponseDto(result);
  }

  async getCriticalResults(): Promise<LabResultResponseDto[]> {
    const results = await this.prisma.labResult.findMany({
      where: {
        flag: {
          in: [ResultFlag.CRITICAL, ResultFlag.ABNORMAL],
        },
      },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
        test: true,
      },
      orderBy: {
        resultDateTime: 'desc',
      },
    });

    return results.map(result => this.mapToResponseDto(result));
  }

  private mapToResponseDto(result: any): LabResultResponseDto {
    return {
      id: result.id,
      orderId: result.orderId,
      testId: result.testId,
      analyte: result.analyte,
      value: result.value,
      textValue: result.textValue,
      unit: result.unit,
      flag: result.flag,
      referenceLow: result.referenceLow,
      referenceHigh: result.referenceHigh,
      instrument: result.instrument,
      resultDateTime: result.resultDateTime,
      notes: result.notes,
      method: result.method,
      validationStatus: result.validationStatus,
      validatedBy: result.validatedBy,
      validatedAt: result.validatedAt,
      reviewedBy: result.reviewedBy,
      reviewedAt: result.reviewedAt,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
