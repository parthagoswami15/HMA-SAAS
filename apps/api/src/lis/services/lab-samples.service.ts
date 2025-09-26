import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSampleDto, SampleResponseDto, SampleStatus } from '../dto/lab-order.dto';

@Injectable()
export class LabSamplesService {
  constructor(private prisma: PrismaService) {}

  async createSample(createSampleDto: CreateSampleDto): Promise<SampleResponseDto> {
    try {
      const sample = await this.prisma.labSample.create({
        data: {
          ...createSampleDto,
          status: createSampleDto.status || SampleStatus.PENDING,
        },
        include: {
          order: true,
        },
      });

      return this.mapToResponseDto(sample);
    } catch (error) {
      throw new BadRequestException('Failed to create sample');
    }
  }

  async getAllSamples(filters?: any): Promise<SampleResponseDto[]> {
    const samples = await this.prisma.labSample.findMany({
      where: {
        ...(filters?.orderId && { orderId: filters.orderId }),
        ...(filters?.sampleType && { sampleType: filters.sampleType }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.barcode && { barcode: filters.barcode }),
        ...(filters?.dateFrom && filters?.dateTo && {
          collectedAt: {
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
      },
      orderBy: {
        collectedAt: 'desc',
      },
    });

    return samples.map(sample => this.mapToResponseDto(sample));
  }

  async getSampleById(id: string): Promise<SampleResponseDto> {
    const sample = await this.prisma.labSample.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
      },
    });

    if (!sample) {
      throw new NotFoundException('Sample not found');
    }

    return this.mapToResponseDto(sample);
  }

  async updateSample(id: string, updateData: Partial<CreateSampleDto>): Promise<SampleResponseDto> {
    try {
      const sample = await this.prisma.labSample.update({
        where: { id },
        data: updateData,
        include: {
          order: {
            include: {
              patient: true,
            },
          },
        },
      });

      return this.mapToResponseDto(sample);
    } catch (error) {
      throw new BadRequestException('Failed to update sample');
    }
  }

  async deleteSample(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.labSample.delete({
        where: { id },
      });

      return { message: 'Sample deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete sample');
    }
  }

  async collectSample(id: string, collectedAt?: Date): Promise<SampleResponseDto> {
    const sample = await this.prisma.labSample.update({
      where: { id },
      data: {
        status: SampleStatus.COLLECTED,
        collectedAt: collectedAt || new Date(),
      },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
      },
    });

    return this.mapToResponseDto(sample);
  }

  async receiveSample(id: string): Promise<SampleResponseDto> {
    const sample = await this.prisma.labSample.update({
      where: { id },
      data: {
        status: SampleStatus.RECEIVED,
      },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
      },
    });

    return this.mapToResponseDto(sample);
  }

  async processSample(id: string): Promise<SampleResponseDto> {
    const sample = await this.prisma.labSample.update({
      where: { id },
      data: {
        status: SampleStatus.PROCESSED,
      },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
      },
    });

    return this.mapToResponseDto(sample);
  }

  async storeSample(id: string): Promise<SampleResponseDto> {
    const sample = await this.prisma.labSample.update({
      where: { id },
      data: {
        status: SampleStatus.STORED,
      },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
      },
    });

    return this.mapToResponseDto(sample);
  }

  async disposeSample(id: string): Promise<SampleResponseDto> {
    const sample = await this.prisma.labSample.update({
      where: { id },
      data: {
        status: SampleStatus.DISPOSED,
      },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
      },
    });

    return this.mapToResponseDto(sample);
  }

  async getSamplesByOrder(orderId: string): Promise<SampleResponseDto[]> {
    const samples = await this.prisma.labSample.findMany({
      where: { orderId },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
      },
      orderBy: {
        collectedAt: 'desc',
      },
    });

    return samples.map(sample => this.mapToResponseDto(sample));
  }

  async getSamplesByStatus(status: SampleStatus): Promise<SampleResponseDto[]> {
    const samples = await this.prisma.labSample.findMany({
      where: { status },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
      },
      orderBy: {
        collectedAt: 'desc',
      },
    });

    return samples.map(sample => this.mapToResponseDto(sample));
  }

  async getSamplesByType(sampleType: string): Promise<SampleResponseDto[]> {
    const samples = await this.prisma.labSample.findMany({
      where: { sampleType },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
      },
      orderBy: {
        collectedAt: 'desc',
      },
    });

    return samples.map(sample => this.mapToResponseDto(sample));
  }

  async getExpiredSamples(): Promise<SampleResponseDto[]> {
    const samples = await this.prisma.labSample.findMany({
      where: {
        stabilityExpiresAt: {
          lt: new Date(),
        },
        status: {
          not: SampleStatus.DISPOSED,
        },
      },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
      },
      orderBy: {
        stabilityExpiresAt: 'asc',
      },
    });

    return samples.map(sample => this.mapToResponseDto(sample));
  }

  async generateBarcode(id: string): Promise<{ barcode: string }> {
    const barcode = `SMP-${Date.now()}-${id.slice(-6).toUpperCase()}`;

    await this.prisma.labSample.update({
      where: { id },
      data: { barcode },
    });

    return { barcode };
  }

  private mapToResponseDto(sample: any): SampleResponseDto {
    return {
      id: sample.id,
      orderId: sample.orderId,
      sampleType: sample.sampleType,
      containerType: sample.containerType,
      volume: sample.volume,
      collectionNotes: sample.collectionNotes,
      collectedAt: sample.collectedAt,
      stabilityExpiresAt: sample.stabilityExpiresAt,
      status: sample.status,
      barcode: sample.barcode,
      createdAt: sample.createdAt,
      updatedAt: sample.updatedAt,
    };
  }
}
