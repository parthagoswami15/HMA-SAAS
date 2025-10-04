import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudyDto, UpdateStudyDto, StudyFilterDto, StudyListDto } from '../dto/studies.dto';
import { Study, StudyStatus, ModalityType } from '@prisma/client';

@Injectable()
export class StudiesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateStudyDto): Promise<Study> {
    // Validate order exists
    const order = await this.prisma.imagingOrder.findUnique({
      where: { id: createDto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Imaging order not found');
    }

    // Generate Study Instance UID if not provided
    const studyInstanceUID = createDto.studyInstanceUID || await this.generateStudyUID();

    // Validate performing physician if provided
    if (createDto.performingPhysician) {
      const physician = await this.prisma.user.findUnique({
        where: { id: createDto.performingPhysician },
      });

      if (!physician) {
        throw new NotFoundException('Performing physician not found');
      }
    }

    // Validate reading physician if provided
    if (createDto.readingPhysician) {
      const radiologist = await this.prisma.user.findUnique({
        where: { id: createDto.readingPhysician },
      });

      if (!radiologist) {
        throw new NotFoundException('Reading radiologist not found');
      }
    }

    return this.prisma.study.create({
      data: {
        studyInstanceUID,
        orderId: createDto.orderId,
        accessionNumber: createDto.accessionNumber,
        studyDate: new Date(createDto.studyDate),
        studyTime: createDto.studyTime,
        studyDescription: createDto.studyDescription,
        procedureCode: createDto.procedureCode,
        modalityType: createDto.modalityType,
        performingPhysician: createDto.performingPhysician,
        readingPhysician: createDto.readingPhysician,
        dicomMetadata: createDto.dicomMetadata,
        status: StudyStatus.SCHEDULED,
        tenantId: order.tenantId,
      },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            patientId: true,
            modalityType: true,
            protocol: true,
          },
        },
        performingUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        readingUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findAll(filterDto: StudyFilterDto, listDto: StudyListDto): Promise<{
    data: Study[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, sortBy = 'studyDate', sortOrder = false } = listDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Apply filters
    if (filterDto.status) where.status = filterDto.status;
    if (filterDto.modalityType) where.modalityType = filterDto.modalityType;
    if (filterDto.orderId) where.orderId = filterDto.orderId;
    if (filterDto.performingPhysician) where.performingPhysician = filterDto.performingPhysician;
    if (filterDto.readingPhysician) where.readingPhysician = filterDto.readingPhysician;

    // Date range filter
    if (filterDto.dateFrom || filterDto.dateTo) {
      where.studyDate = {};
      if (filterDto.dateFrom) where.studyDate.gte = new Date(filterDto.dateFrom);
      if (filterDto.dateTo) where.studyDate.lte = new Date(filterDto.dateTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.study.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder ? 'desc' : 'asc' },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              patientId: true,
              modalityType: true,
              protocol: true,
              priority: true,
              status: true,
            },
          },
          performingUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          readingUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          series: {
            select: {
              id: true,
              seriesInstanceUID: true,
              seriesNumber: true,
              modality: true,
              seriesDescription: true,
            },
          },
          reports: {
            select: {
              id: true,
              reportNumber: true,
              status: true,
              signedAt: true,
              signingUser: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.study.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Study> {
    const study = await this.prisma.study.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            patientId: true,
            modalityType: true,
            protocol: true,
            priority: true,
            status: true,
            clinicalHistory: true,
            contrastType: true,
          },
        },
        performingUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        readingUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        series: {
          select: {
            id: true,
            seriesInstanceUID: true,
            seriesNumber: true,
            modality: true,
            seriesDescription: true,
            bodyPartExamined: true,
            seriesDate: true,
            images: {
              select: {
                id: true,
                sopInstanceUID: true,
                instanceNumber: true,
                imageType: true,
                rows: true,
                columns: true,
              },
            },
          },
          orderBy: { seriesNumber: 'asc' },
        },
        reports: {
          select: {
            id: true,
            reportNumber: true,
            reportType: true,
            status: true,
            findingsText: true,
            impression: true,
            recommendations: true,
            conclusion: true,
            biRadsScore: true,
            lungRadsScore: true,
            signedAt: true,
            signingUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        worklistItems: {
          select: {
            id: true,
            status: true,
            sentToModalityAt: true,
            receivedFromModalityAt: true,
            modality: {
              select: {
                id: true,
                name: true,
                aeTitle: true,
              },
            },
          },
        },
      },
    });

    if (!study) {
      throw new NotFoundException('Study not found');
    }

    return study;
  }

  async update(id: string, updateDto: UpdateStudyDto): Promise<Study> {
    const existingStudy = await this.findOne(id);

    // Validate performing physician if provided
    if (updateDto.performingPhysician) {
      const physician = await this.prisma.user.findUnique({
        where: { id: updateDto.performingPhysician },
      });

      if (!physician) {
        throw new NotFoundException('Performing physician not found');
      }
    }

    // Validate reading physician if provided
    if (updateDto.readingPhysician) {
      const radiologist = await this.prisma.user.findUnique({
        where: { id: updateDto.readingPhysician },
      });

      if (!radiologist) {
        throw new NotFoundException('Reading radiologist not found');
      }
    }

    return this.prisma.study.update({
      where: { id },
      data: {
        ...updateDto,
        status: updateDto.status || existingStudy.status,
      },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            patientId: true,
          },
        },
        performingUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        readingUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async startStudy(id: string): Promise<Study> {
    const study = await this.findOne(id);

    if (study.status !== StudyStatus.SCHEDULED) {
      throw new BadRequestException('Study must be scheduled to start');
    }

    // Update order status if this is the first study
    await this.prisma.imagingOrder.update({
      where: { id: study.orderId },
      data: {
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });

    return this.prisma.study.update({
      where: { id },
      data: {
        status: StudyStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
    });
  }

  async completeStudy(id: string): Promise<Study> {
    const study = await this.findOne(id);

    if (study.status !== StudyStatus.IN_PROGRESS) {
      throw new BadRequestException('Study must be in progress to complete');
    }

    // Check if there are other studies for this order that are still in progress
    const otherStudies = await this.prisma.study.findMany({
      where: {
        orderId: study.orderId,
        id: { not: id },
        status: StudyStatus.IN_PROGRESS,
      },
    });

    // Update order status
    const orderStatus = otherStudies.length > 0 ? 'IN_PROGRESS' : 'COMPLETED';
    await this.prisma.imagingOrder.update({
      where: { id: study.orderId },
      data: {
        status: orderStatus,
        completedAt: orderStatus === 'COMPLETED' ? new Date() : undefined,
      },
    });

    return this.prisma.study.update({
      where: { id },
      data: {
        status: StudyStatus.COMPLETED,
        completedAt: new Date(),
      },
    });
  }

  async getStudyByUID(studyInstanceUID: string): Promise<Study> {
    const study = await this.prisma.study.findUnique({
      where: { studyInstanceUID },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            patientId: true,
            modalityType: true,
            protocol: true,
          },
        },
        series: {
          select: {
            id: true,
            seriesInstanceUID: true,
            seriesNumber: true,
            modality: true,
            seriesDescription: true,
            images: {
              select: {
                id: true,
                sopInstanceUID: true,
                instanceNumber: true,
              },
            },
          },
          orderBy: { seriesNumber: 'asc' },
        },
      },
    });

    if (!study) {
      throw new NotFoundException('Study not found');
    }

    return study;
  }

  async getStudiesByOrder(orderId: string): Promise<Study[]> {
    return this.prisma.study.findMany({
      where: { orderId },
      orderBy: { studyDate: 'desc' },
      include: {
        performingUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        readingUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        series: {
          select: {
            id: true,
            seriesInstanceUID: true,
            seriesNumber: true,
            modality: true,
            seriesDescription: true,
          },
        },
        reports: {
          select: {
            id: true,
            reportNumber: true,
            status: true,
            signedAt: true,
          },
        },
      },
    });
  }

  async getStats(tenantId: string) {
    const total = await this.prisma.study.count({ where: { tenantId } });
    const byStatus = await this.prisma.study.groupBy({
      by: ['status'],
      where: { tenantId },
      _count: { id: true },
    });

    const byModality = await this.prisma.study.groupBy({
      by: ['modalityType'],
      where: { tenantId },
      _count: { id: true },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await this.prisma.study.count({
      where: {
        tenantId,
        studyDate: { gte: today },
      },
    });

    return {
      total,
      today: todayCount,
      byStatus: Object.fromEntries(byStatus.map(s => [s.status, s._count.id])),
      byModality: Object.fromEntries(byModality.map(m => [m.modalityType, m._count.id])),
    };
  }

  private async generateStudyUID(): Promise<string> {
    // Generate a DICOM-compliant Study Instance UID
    // Format: 1.2.3.4.5.6.7.8.9.timestamp.random
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `1.2.3.4.5.6.7.8.9.${timestamp}.${random}`;
  }

  async updateDicomMetadata(id: string, dicomMetadata: Record<string, any>): Promise<Study> {
    return this.prisma.study.update({
      where: { id },
      data: { dicomMetadata },
    });
  }

  async getStudyImages(studyId: string): Promise<any[]> {
    const study = await this.prisma.study.findUnique({
      where: { id: studyId },
      include: {
        series: {
          select: {
            id: true,
            seriesInstanceUID: true,
            seriesNumber: true,
            modality: true,
            seriesDescription: true,
            images: {
              select: {
                id: true,
                sopInstanceUID: true,
                instanceNumber: true,
                imageType: true,
                rows: true,
                columns: true,
                bitsAllocated: true,
                bitsStored: true,
                photometricInterpretation: true,
                filePath: true,
                fileSize: true,
              },
              orderBy: { instanceNumber: 'asc' },
            },
          },
          orderBy: { seriesNumber: 'asc' },
        },
      },
    });

    if (!study) {
      throw new NotFoundException('Study not found');
    }

    return study.series.flatMap(series =>
      series.images.map(image => ({
        ...image,
        seriesInstanceUID: series.seriesInstanceUID,
        seriesNumber: series.seriesNumber,
        modality: series.modality,
        seriesDescription: series.seriesDescription,
      }))
    );
  }
}
