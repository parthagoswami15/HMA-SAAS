import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateModalityDto, UpdateModalityDto, ModalityWorklistDto, TestModalityConnectionDto } from '../dto/modalities.dto';
import { Modality, ModalityType } from '@prisma/client';

@Injectable()
export class ModalitiesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateModalityDto, tenantId: string): Promise<Modality> {
    // Check if AE Title already exists
    const existingModality = await this.prisma.modality.findFirst({
      where: {
        aeTitle: createDto.aeTitle,
        tenantId,
      },
    });

    if (existingModality) {
      throw new ConflictException('Modality with this AE Title already exists');
    }

    return this.prisma.modality.create({
      data: {
        ...createDto,
        tenantId,
        isActive: createDto.isActive ?? true,
      },
    });
  }

  async findAll(filterDto: any, listDto: any): Promise<{
    data: Modality[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10 } = listDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filterDto.modalityType) where.modalityType = filterDto.modalityType;
    if (filterDto.isActive !== undefined) where.isActive = filterDto.isActive;

    const [data, total] = await Promise.all([
      this.prisma.modality.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              studies: true,
              imagingOrders: true,
            },
          },
        },
      }),
      this.prisma.modality.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Modality> {
    const modality = await this.prisma.modality.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            studies: true,
            imagingOrders: true,
          },
        },
      },
    });

    if (!modality) {
      throw new NotFoundException('Modality not found');
    }

    return modality;
  }

  async update(id: string, updateDto: UpdateModalityDto): Promise<Modality> {
    const existingModality = await this.findOne(id);

    // Check if AE Title already exists (if being updated)
    if (updateDto.aeTitle && updateDto.aeTitle !== existingModality.aeTitle) {
      const duplicateModality = await this.prisma.modality.findFirst({
        where: {
          aeTitle: updateDto.aeTitle,
          tenantId: existingModality.tenantId,
          id: { not: id },
        },
      });

      if (duplicateModality) {
        throw new ConflictException('Modality with this AE Title already exists');
      }
    }

    return this.prisma.modality.update({
      where: { id },
      data: updateDto,
    });
  }

  async updateStatus(id: string, isActive: boolean): Promise<Modality> {
    const modality = await this.findOne(id);

    if (!isActive && modality.isActive) {
      // Check if modality has active studies
      const activeStudies = await this.prisma.study.count({
        where: {
          modalityId: id,
          status: { in: ['IN_PROGRESS', 'SCHEDULED'] },
        },
      });

      if (activeStudies > 0) {
        throw new BadRequestException('Cannot deactivate modality with active studies');
      }
    }

    return this.prisma.modality.update({
      where: { id },
      data: { isActive },
    });
  }

  async getWorklist(modalityId: string): Promise<any[]> {
    const modality = await this.findOne(modalityId);

    // Get scheduled studies for this modality
    const studies = await this.prisma.study.findMany({
      where: {
        modalityId,
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      },
      include: {
        order: {
          include: {
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                dateOfBirth: true,
                gender: true,
              },
            },
          },
        },
      },
      orderBy: { scheduledFor: 'asc' },
    });

    return studies.map(study => ({
      studyInstanceUID: study.studyInstanceUID,
      patientName: `${study.order.patient.firstName} ${study.order.patient.lastName}`,
      patientId: study.order.patientId,
      accessionNumber: study.accessionNumber,
      scheduledFor: study.scheduledFor,
      priority: study.order.priority,
      protocol: study.order.protocol,
      clinicalHistory: study.order.clinicalHistory,
    }));
  }

  async sendToWorklist(modalityId: string, worklistDto: ModalityWorklistDto): Promise<any> {
    const modality = await this.findOne(modalityId);

    // Verify study exists and is scheduled for this modality
    const study = await this.prisma.study.findFirst({
      where: {
        studyInstanceUID: worklistDto.studyInstanceUID,
        modalityId,
      },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
      },
    });

    if (!study) {
      throw new NotFoundException('Study not found or not scheduled for this modality');
    }

    // Send to modality worklist (this would typically involve DICOM communication)
    // For now, we'll just update the study status
    await this.prisma.study.update({
      where: { id: study.id },
      data: {
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });

    return {
      message: 'Study sent to modality worklist',
      studyInstanceUID: worklistDto.studyInstanceUID,
      modalityId,
      sentAt: new Date(),
    };
  }

  async testConnection(modalityId: string, testDto: TestModalityConnectionDto): Promise<any> {
    const modality = await this.findOne(modalityId);

    // This would typically test DICOM connectivity
    // For now, we'll simulate a connection test
    const isConnected = Math.random() > 0.1; // 90% success rate for demo

    if (!isConnected) {
      throw new BadRequestException('Failed to connect to modality');
    }

    return {
      modalityId,
      aeTitle: modality.aeTitle,
      hostname: modality.hostname,
      port: modality.port,
      status: 'CONNECTED',
      responseTime: Math.floor(Math.random() * 100) + 50, // 50-150ms
      testMessage: testDto.testMessage || 'DICOM Echo Test',
      testedAt: new Date(),
    };
  }

  async getStats(tenantId: string): Promise<any> {
    const modalities = await this.prisma.modality.findMany({
      where: { tenantId },
      select: {
        id: true,
        modalityType: true,
        isActive: true,
      },
    });

    const activeModalities = modalities.filter(m => m.isActive).length;
    const totalModalities = modalities.length;

    const studiesByModality = await this.prisma.study.groupBy({
      by: ['modalityType'],
      where: { tenantId },
      _count: { id: true },
    });

    return {
      totalModalities,
      activeModalities,
      inactiveModalities: totalModalities - activeModalities,
      modalitiesByType: Object.fromEntries(
        studiesByModality.map(m => [m.modalityType, m._count.id])
      ),
      utilizationRate: totalModalities > 0 ? Math.round((activeModalities / totalModalities) * 100) : 0,
    };
  }

  async remove(id: string): Promise<void> {
    const modality = await this.findOne(id);

    // Check if modality has any studies
    const studyCount = await this.prisma.study.count({
      where: { modalityId: id },
    });

    if (studyCount > 0) {
      throw new ConflictException('Cannot delete modality with existing studies');
    }

    await this.prisma.modality.delete({
      where: { id },
    });
  }
}
