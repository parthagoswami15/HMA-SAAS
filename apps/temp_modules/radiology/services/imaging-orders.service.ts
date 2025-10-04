import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateImagingOrderDto, UpdateImagingOrderDto, ScheduleImagingOrderDto, ImagingOrderFilterDto, ImagingOrderListDto } from '../dto/imaging-orders.dto';
import { ImagingOrder, ImagingOrderStatus, ImagingPriority, ModalityType, ContrastType, User } from '@prisma/client';

@Injectable()
export class ImagingOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateImagingOrderDto, userId: string): Promise<ImagingOrder> {
    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Validate patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: createDto.patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Validate modality if provided
    if (createDto.modalityId) {
      const modality = await this.prisma.modality.findUnique({
        where: { id: createDto.modalityId },
      });

      if (!modality) {
        throw new NotFoundException('Modality not found');
      }
    }

    // Check for contrast allergy protocols
    if (createDto.contrastAllergy && createDto.contrastType !== ContrastType.NONE) {
      await this.handleContrastAllergy(createDto.patientId, createDto.contrastType);
    }

    // Check pregnancy protocols if applicable
    if (createDto.isPregnant) {
      await this.handlePregnancyProtocol(createDto.modalityType);
    }

    return this.prisma.imagingOrder.create({
      data: {
        orderNumber,
        patientId: createDto.patientId,
        visitId: createDto.visitId,
        modalityType: createDto.modalityType,
        modalityId: createDto.modalityId,
        protocol: createDto.protocol,
        bodyPart: createDto.bodyPart,
        clinicalHistory: createDto.clinicalHistory,
        priority: createDto.priority || ImagingPriority.ROUTINE,
        status: ImagingOrderStatus.DRAFTED,
        contrastType: createDto.contrastType || ContrastType.NONE,
        contrastAgent: createDto.contrastAgent,
        contrastVolume: createDto.contrastVolume,
        contrastAllergy: createDto.contrastAllergy || false,
        allergyDetails: createDto.allergyDetails,
        isPregnant: createDto.isPregnant || false,
        pregnancyDetails: createDto.pregnancyDetails,
        isInpatient: createDto.isInpatient || false,
        isolationRequired: createDto.isolationRequired || false,
        specialInstructions: createDto.specialInstructions,
        previousStudies: createDto.previousStudies,
        cumulativeDose: createDto.cumulativeDose,
        orderedBy: userId,
        tenantId: patient.tenantId, // Inherit from patient
      },
      include: {
        patient: true,
        modality: true,
        orderingUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(filterDto: ImagingOrderFilterDto, listDto: ImagingOrderListDto): Promise<{
    data: ImagingOrder[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, sortBy = 'orderedAt', sortOrder = false } = listDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Apply filters
    if (filterDto.status) where.status = filterDto.status;
    if (filterDto.modalityType) where.modalityType = filterDto.modalityType;
    if (filterDto.priority) where.priority = filterDto.priority;
    if (filterDto.patientId) where.patientId = filterDto.patientId;
    if (filterDto.contrastAllergy !== undefined) where.contrastAllergy = filterDto.contrastAllergy;
    if (filterDto.isPregnant !== undefined) where.isPregnant = filterDto.isPregnant;

    // Date range filter
    if (filterDto.dateFrom || filterDto.dateTo) {
      where.orderedAt = {};
      if (filterDto.dateFrom) where.orderedAt.gte = new Date(filterDto.dateFrom);
      if (filterDto.dateTo) where.orderedAt.lte = new Date(filterDto.dateTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.imagingOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder ? 'desc' : 'asc' },
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
          modality: {
            select: {
              id: true,
              name: true,
              modalityType: true,
              location: true,
            },
          },
          orderingUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          scheduledUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.prisma.imagingOrder.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<ImagingOrder> {
    const order = await this.prisma.imagingOrder.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            gender: true,
            phone: true,
            email: true,
          },
        },
        visit: {
          select: {
            id: true,
            visitNumber: true,
            visitType: true,
            visitDate: true,
          },
        },
        modality: {
          select: {
            id: true,
            name: true,
            modalityType: true,
            location: true,
            aeTitle: true,
            hostname: true,
          },
        },
        orderingUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        scheduledUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        studies: {
          select: {
            id: true,
            studyInstanceUID: true,
            studyDate: true,
            modalityType: true,
            status: true,
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
        doseRecords: {
          select: {
            id: true,
            modalityType: true,
            effectiveDose: true,
            recordedAt: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Imaging order not found');
    }

    return order;
  }

  async update(id: string, updateDto: UpdateImagingOrderDto): Promise<ImagingOrder> {
    const existingOrder = await this.findOne(id);

    // Check for contrast allergy protocols if contrast is being changed
    if (updateDto.contrastType && updateDto.contrastType !== ContrastType.NONE) {
      if (updateDto.contrastAllergy) {
        await this.handleContrastAllergy(existingOrder.patientId, updateDto.contrastType);
      }
    }

    // Check pregnancy protocols if applicable
    if (updateDto.isPregnant) {
      await this.handlePregnancyProtocol(existingOrder.modalityType);
    }

    return this.prisma.imagingOrder.update({
      where: { id },
      data: {
        ...updateDto,
        scheduledFor: updateDto.scheduledFor ? new Date(updateDto.scheduledFor) : undefined,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        modality: {
          select: {
            id: true,
            name: true,
            modalityType: true,
          },
        },
      },
    });
  }

  async schedule(id: string, scheduleDto: ScheduleImagingOrderDto): Promise<ImagingOrder> {
    const order = await this.findOne(id);

    if (order.status !== ImagingOrderStatus.DRAFTED && order.status !== ImagingOrderStatus.ORDERED) {
      throw new BadRequestException('Order cannot be scheduled in current status');
    }

    // Validate modality availability if specified
    if (scheduleDto.modalityId) {
      const modality = await this.prisma.modality.findUnique({
        where: { id: scheduleDto.modalityId },
      });

      if (!modality) {
        throw new NotFoundException('Modality not found');
      }
    }

    return this.prisma.imagingOrder.update({
      where: { id },
      data: {
        scheduledFor: new Date(scheduleDto.scheduledFor),
        scheduledBy: scheduleDto.scheduledBy,
        modalityId: scheduleDto.modalityId,
        status: ImagingOrderStatus.SCHEDULED,
      },
      include: {
        patient: true,
        modality: true,
        scheduledUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async cancel(id: string, reason: string): Promise<ImagingOrder> {
    const order = await this.findOne(id);

    if (order.status === ImagingOrderStatus.COMPLETED || order.status === ImagingOrderStatus.SIGNED) {
      throw new BadRequestException('Cannot cancel completed or signed order');
    }

    return this.prisma.imagingOrder.update({
      where: { id },
      data: {
        status: ImagingOrderStatus.CANCELLED,
        specialInstructions: `${order.specialInstructions || ''}\nCancelled: ${reason}`,
      },
    });
  }

  async complete(id: string): Promise<ImagingOrder> {
    const order = await this.findOne(id);

    if (order.status !== ImagingOrderStatus.IN_PROGRESS) {
      throw new BadRequestException('Order must be in progress to complete');
    }

    return this.prisma.imagingOrder.update({
      where: { id },
      data: {
        status: ImagingOrderStatus.COMPLETED,
        completedAt: new Date(),
      },
    });
  }

  private async generateOrderNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const count = await this.prisma.imagingOrder.count({
      where: {
        orderedAt: {
          gte: new Date(currentYear, 0, 1),
          lt: new Date(currentYear + 1, 0, 1),
        },
      },
    });

    return `IMG-${currentYear}-${(count + 1).toString().padStart(4, '0')}`;
  }

  private async handleContrastAllergy(patientId: string, contrastType: ContrastType): Promise<void> {
    // Check if patient has known contrast allergy
    const allergy = await this.prisma.contrastAllergy.findFirst({
      where: {
        patientId,
        contrastType,
        requiresAlert: true,
      },
    });

    if (allergy) {
      // Create alert for radiologist
      await this.prisma.notification.create({
        data: {
          type: 'ALERT',
          title: 'Contrast Allergy Alert',
          message: `Patient has known ${contrastType} contrast allergy. Review protocol.`,
          userId: patientId, // This should be radiologist user
          metadata: {
            patientId,
            allergyId: allergy.id,
            contrastType,
          },
        },
      });
    }
  }

  private async handlePregnancyProtocol(modalityType: ModalityType): Promise<void> {
    // Check if modality uses ionizing radiation
    const ionizingModalities = [ModalityType.XR, ModalityType.CT, ModalityType.FL, ModalityType.ANGIO];

    if (ionizingModalities.includes(modalityType)) {
      // This should trigger pregnancy verification protocols
      // Implementation depends on specific workflow requirements
    }
  }

  async getPatientHistory(patientId: string): Promise<ImagingOrder[]> {
    return this.prisma.imagingOrder.findMany({
      where: { patientId },
      orderBy: { orderedAt: 'desc' },
      include: {
        modality: {
          select: {
            id: true,
            name: true,
            modalityType: true,
          },
        },
        reports: {
          select: {
            id: true,
            reportNumber: true,
            impression: true,
            signedAt: true,
          },
        },
      },
    });
  }

  async getStats(tenantId: string) {
    const total = await this.prisma.imagingOrder.count({ where: { tenantId } });
    const byStatus = await this.prisma.imagingOrder.groupBy({
      by: ['status'],
      where: { tenantId },
      _count: { id: true },
    });

    const byModality = await this.prisma.imagingOrder.groupBy({
      by: ['modalityType'],
      where: { tenantId },
      _count: { id: true },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await this.prisma.imagingOrder.count({
      where: {
        tenantId,
        orderedAt: { gte: today },
      },
    });

    return {
      total,
      today: todayCount,
      byStatus: Object.fromEntries(byStatus.map(s => [s.status, s._count.id])),
      byModality: Object.fromEntries(byModality.map(m => [m.modalityType, m._count.id])),
    };
  }
}
