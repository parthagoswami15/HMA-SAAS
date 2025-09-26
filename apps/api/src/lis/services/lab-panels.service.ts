import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLabPanelDto, UpdateLabPanelDto, LabPanelResponseDto } from '../dto/lab-panel.dto';

@Injectable()
export class LabPanelsService {
  constructor(private prisma: PrismaService) {}

  async createPanel(createPanelDto: CreateLabPanelDto): Promise<LabPanelResponseDto> {
    try {
      const panel = await this.prisma.labPanel.create({
        data: {
          ...createPanelDto,
          isActive: createPanelDto.isActive ?? true,
        },
        include: {
          tests: {
            include: {
              test: true,
            },
          },
        },
      });

      return this.mapToResponseDto(panel);
    } catch (error) {
      throw new BadRequestException('Failed to create lab panel');
    }
  }

  async getAllPanels(filters?: any): Promise<LabPanelResponseDto[]> {
    const panels = await this.prisma.labPanel.findMany({
      where: {
        ...(filters?.category && { category: filters.category }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
        ...(filters?.search && {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        tests: {
          include: {
            test: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return panels.map(panel => this.mapToResponseDto(panel));
  }

  async getPanelById(id: string): Promise<LabPanelResponseDto> {
    const panel = await this.prisma.labPanel.findUnique({
      where: { id },
      include: {
        tests: {
          include: {
            test: true,
          },
        },
      },
    });

    if (!panel) {
      throw new NotFoundException('Lab panel not found');
    }

    return this.mapToResponseDto(panel);
  }

  async updatePanel(id: string, updatePanelDto: UpdateLabPanelDto): Promise<LabPanelResponseDto> {
    try {
      const panel = await this.prisma.labPanel.update({
        where: { id },
        data: updatePanelDto,
        include: {
          tests: {
            include: {
              test: true,
            },
          },
        },
      });

      return this.mapToResponseDto(panel);
    } catch (error) {
      throw new BadRequestException('Failed to update lab panel');
    }
  }

  async deletePanel(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.labPanel.delete({
        where: { id },
      });

      return { message: 'Lab panel deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete lab panel');
    }
  }

  async addTestToPanel(panelId: string, testId: string): Promise<LabPanelResponseDto> {
    try {
      const panel = await this.prisma.labPanel.update({
        where: { id: panelId },
        data: {
          tests: {
            create: {
              testId,
            },
          },
        },
        include: {
          tests: {
            include: {
              test: true,
            },
          },
        },
      });

      return this.mapToResponseDto(panel);
    } catch (error) {
      throw new BadRequestException('Failed to add test to panel');
    }
  }

  async removeTestFromPanel(panelId: string, testId: string): Promise<LabPanelResponseDto> {
    try {
      const panel = await this.prisma.labPanel.update({
        where: { id: panelId },
        data: {
          tests: {
            delete: {
              testId_panelId: {
                testId,
                panelId,
              },
            },
          },
        },
        include: {
          tests: {
            include: {
              test: true,
            },
          },
        },
      });

      return this.mapToResponseDto(panel);
    } catch (error) {
      throw new BadRequestException('Failed to remove test from panel');
    }
  }

  async getPanelsByCategory(category: string): Promise<LabPanelResponseDto[]> {
    const panels = await this.prisma.labPanel.findMany({
      where: { category },
      include: {
        tests: {
          include: {
            test: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return panels.map(panel => this.mapToResponseDto(panel));
  }

  async getActivePanels(): Promise<LabPanelResponseDto[]> {
    const panels = await this.prisma.labPanel.findMany({
      where: { isActive: true },
      include: {
        tests: {
          include: {
            test: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return panels.map(panel => this.mapToResponseDto(panel));
  }

  private mapToResponseDto(panel: any): LabPanelResponseDto {
    return {
      id: panel.id,
      name: panel.name,
      description: panel.description,
      category: panel.category,
      isActive: panel.isActive,
      createdAt: panel.createdAt,
      updatedAt: panel.updatedAt,
      tests: panel.tests?.map((panelTest: any) => ({
        id: panelTest.test.id,
        code: panelTest.test.code,
        name: panelTest.test.name,
        category: panelTest.test.category,
        unit: panelTest.test.unit,
        referenceRanges: panelTest.test.referenceRanges,
      })) || [],
    };
  }
}
