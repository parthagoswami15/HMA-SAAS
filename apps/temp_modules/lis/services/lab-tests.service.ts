import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLabTestDto, UpdateLabTestDto, LabTestResponseDto, TestStatus } from '../dto/lab-test.dto';

@Injectable()
export class LabTestsService {
  constructor(private prisma: PrismaService) {}

  async createTest(createTestDto: CreateLabTestDto): Promise<LabTestResponseDto> {
    try {
      const test = await this.prisma.labTest.create({
        data: {
          ...createTestDto,
          status: TestStatus.ACTIVE,
          isActive: createTestDto.isActive ?? true,
        },
        include: {
          referenceRanges: true,
        },
      });

      return this.mapToResponseDto(test);
    } catch (error) {
      throw new BadRequestException('Failed to create lab test');
    }
  }

  async getAllTests(category?: string, active?: boolean): Promise<LabTestResponseDto[]> {
    const tests = await this.prisma.labTest.findMany({
      where: {
        ...(category && { category }),
        ...(active !== undefined && { isActive: active }),
      },
      include: {
        referenceRanges: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return tests.map(test => this.mapToResponseDto(test));
  }

  async getTestById(id: string): Promise<LabTestResponseDto> {
    const test = await this.prisma.labTest.findUnique({
      where: { id },
      include: {
        referenceRanges: true,
      },
    });

    if (!test) {
      throw new NotFoundException('Lab test not found');
    }

    return this.mapToResponseDto(test);
  }

  async updateTest(id: string, updateTestDto: UpdateLabTestDto): Promise<LabTestResponseDto> {
    try {
      const test = await this.prisma.labTest.update({
        where: { id },
        data: updateTestDto,
        include: {
          referenceRanges: true,
        },
      });

      return this.mapToResponseDto(test);
    } catch (error) {
      throw new BadRequestException('Failed to update lab test');
    }
  }

  async deleteTest(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.labTest.update({
        where: { id },
        data: { status: TestStatus.INACTIVE },
      });

      return { message: 'Lab test deactivated successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete lab test');
    }
  }

  async getTestsByPanel(panelId: string): Promise<LabTestResponseDto[]> {
    const tests = await this.prisma.labTest.findMany({
      where: {
        panelId,
        isActive: true,
      },
      include: {
        referenceRanges: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return tests.map(test => this.mapToResponseDto(test));
  }

  private mapToResponseDto(test: any): LabTestResponseDto {
    return {
      id: test.id,
      name: test.name,
      code: test.code,
      description: test.description,
      category: test.category,
      department: test.department,
      section: test.section,
      price: test.price,
      tatHours: test.tatHours,
      isActive: test.isActive,
      requiresValidation: test.requiresValidation,
      method: test.method,
      unit: test.unit,
      sampleTypes: test.sampleTypes,
      containerTypes: test.containerTypes,
      referenceRanges: test.referenceRanges,
      analyzerSettings: test.analyzerSettings,
      qcSettings: test.qcSettings,
      createdAt: test.createdAt,
      updatedAt: test.updatedAt,
    };
  }
}
