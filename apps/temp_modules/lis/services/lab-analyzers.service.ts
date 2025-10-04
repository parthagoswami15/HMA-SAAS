import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAnalyzerDto, UpdateAnalyzerDto, AnalyzerResponseDto, CreateQcRunDto, QcRunResponseDto } from '../dto/lab-analyzer.dto';

@Injectable()
export class LabAnalyzersService {
  constructor(private prisma: PrismaService) {}

  async createAnalyzer(createAnalyzerDto: CreateAnalyzerDto): Promise<AnalyzerResponseDto> {
    try {
      const analyzer = await this.prisma.labAnalyzer.create({
        data: {
          ...createAnalyzerDto,
          status: createAnalyzerDto.status || 'OFFLINE',
          isActive: createAnalyzerDto.isActive ?? true,
        },
      });

      return this.mapToResponseDto(analyzer);
    } catch (error) {
      throw new BadRequestException('Failed to create analyzer');
    }
  }

  async getAllAnalyzers(filters?: any): Promise<AnalyzerResponseDto[]> {
    const analyzers = await this.prisma.labAnalyzer.findMany({
      where: {
        ...(filters?.type && { type: filters.type }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
        ...(filters?.location && { location: { contains: filters.location, mode: 'insensitive' } }),
      },
      include: {
        qcRuns: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return analyzers.map(analyzer => this.mapToResponseDto(analyzer));
  }

  async getAnalyzerById(id: string): Promise<AnalyzerResponseDto> {
    const analyzer = await this.prisma.labAnalyzer.findUnique({
      where: { id },
      include: {
        qcRuns: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!analyzer) {
      throw new NotFoundException('Analyzer not found');
    }

    return this.mapToResponseDto(analyzer);
  }

  async updateAnalyzer(id: string, updateAnalyzerDto: UpdateAnalyzerDto): Promise<AnalyzerResponseDto> {
    try {
      const analyzer = await this.prisma.labAnalyzer.update({
        where: { id },
        data: updateAnalyzerDto,
      });

      return this.mapToResponseDto(analyzer);
    } catch (error) {
      throw new BadRequestException('Failed to update analyzer');
    }
  }

  async deleteAnalyzer(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.labAnalyzer.delete({
        where: { id },
      });

      return { message: 'Analyzer deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete analyzer');
    }
  }

  async updateAnalyzerStatus(id: string, status: string): Promise<AnalyzerResponseDto> {
    const analyzer = await this.prisma.labAnalyzer.update({
      where: { id },
      data: {
        status,
        lastCommunication: new Date(),
      },
    });

    return this.mapToResponseDto(analyzer);
  }

  async updateAnalyzerCommunication(id: string): Promise<AnalyzerResponseDto> {
    const analyzer = await this.prisma.labAnalyzer.update({
      where: { id },
      data: {
        lastCommunication: new Date(),
      },
    });

    return this.mapToResponseDto(analyzer);
  }

  async getAnalyzersByType(type: string): Promise<AnalyzerResponseDto[]> {
    const analyzers = await this.prisma.labAnalyzer.findMany({
      where: { type },
      include: {
        qcRuns: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return analyzers.map(analyzer => this.mapToResponseDto(analyzer));
  }

  async getActiveAnalyzers(): Promise<AnalyzerResponseDto[]> {
    const analyzers = await this.prisma.labAnalyzer.findMany({
      where: { isActive: true },
      include: {
        qcRuns: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return analyzers.map(analyzer => this.mapToResponseDto(analyzer));
  }

  async getOnlineAnalyzers(): Promise<AnalyzerResponseDto[]> {
    const analyzers = await this.prisma.labAnalyzer.findMany({
      where: { status: 'ONLINE' },
      include: {
        qcRuns: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return analyzers.map(analyzer => this.mapToResponseDto(analyzer));
  }

  private mapToResponseDto(analyzer: any): AnalyzerResponseDto {
    return {
      id: analyzer.id,
      name: analyzer.name,
      model: analyzer.model,
      type: analyzer.type,
      serialNumber: analyzer.serialNumber,
      ipAddress: analyzer.ipAddress,
      port: analyzer.port,
      location: analyzer.location,
      direction: analyzer.direction,
      status: analyzer.status,
      isActive: analyzer.isActive,
      configuration: analyzer.configuration,
      supportedTests: analyzer.supportedTests,
      lastCommunication: analyzer.lastCommunication,
      createdAt: analyzer.createdAt,
      updatedAt: analyzer.updatedAt,
    };
  }
}
