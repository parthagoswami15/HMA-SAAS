import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomPrismaService } from '../prisma/custom-prisma.service';
import { CreateOpdVisitDto, UpdateOpdVisitDto } from './opd.controller';

@Injectable()
export class OpdService {
  constructor(private prisma: CustomPrismaService) {}

  // OPD visits are essentially appointments with status tracking
  async createVisit(createDto: CreateOpdVisitDto, tenantId: string) {
    try {
      // Create appointment for OPD visit
      const visit = await this.prisma.appointment.create({
        data: {
          patientId: createDto.patientId,
          doctorId: createDto.doctorId,
          departmentId: createDto.departmentId,
          startTime: new Date(),
          endTime: new Date(Date.now() + 30 * 60000), // 30 min default
          status: (createDto.status || 'SCHEDULED') as any,
          reason: createDto.chiefComplaint,
          notes: createDto.notes,
          tenantId,
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              medicalRecordNumber: true,
            },
          },
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              specialization: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'OPD visit created successfully',
        data: visit,
      };
    } catch (error) {
      console.error('Error creating OPD visit:', error);
      throw error;
    }
  }

  async findAllVisits(tenantId: string, query: any = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      doctorId,
      departmentId,
      date,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      tenantId,
    };

    if (status) {
      where.status = status;
    }

    if (doctorId) {
      where.doctorId = doctorId;
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      where.startTime = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [visits, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { startTime: 'desc' },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              medicalRecordNumber: true,
            },
          },
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              specialization: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      success: true,
      data: {
        visits,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    };
  }

  async findOneVisit(id: string, tenantId: string) {
    const visit = await this.prisma.appointment.findFirst({
      where: { id, tenantId },
      include: {
        patient: true,
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
            licenseNumber: true,
          },
        },
        department: true,
      },
    });

    if (!visit) {
      throw new NotFoundException('OPD visit not found');
    }

    return {
      success: true,
      data: visit,
    };
  }

  async updateVisit(
    id: string,
    updateDto: UpdateOpdVisitDto,
    tenantId: string,
  ) {
    try {
      const visit = await this.prisma.appointment.update({
        where: { id, tenantId },
        data: {
          ...(updateDto.doctorId && { doctorId: updateDto.doctorId }),
          ...(updateDto.departmentId && {
            departmentId: updateDto.departmentId,
          }),
          ...(updateDto.chiefComplaint && { reason: updateDto.chiefComplaint }),
          ...(updateDto.notes && { notes: updateDto.notes }),
          ...(updateDto.status && { status: updateDto.status as any }),
        },
        include: {
          patient: true,
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              specialization: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'OPD visit updated successfully',
        data: visit,
      };
    } catch (error) {
      console.error('Error updating OPD visit:', error);
      throw error;
    }
  }

  async removeVisit(id: string, tenantId: string) {
    try {
      await this.prisma.appointment.update({
        where: { id, tenantId },
        data: {
          status: 'CANCELLED' as any,
        },
      });

      return {
        success: true,
        message: 'OPD visit cancelled successfully',
      };
    } catch (error) {
      console.error('Error cancelling OPD visit:', error);
      throw error;
    }
  }

  async getQueue(tenantId: string, doctorId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const where: any = {
      tenantId,
      startTime: {
        gte: today,
        lt: tomorrow,
      },
      status: {
        in: ['SCHEDULED', 'ARRIVED'],
      },
    };

    if (doctorId) {
      where.doctorId = doctorId;
    }

    const queue = await this.prisma.appointment.findMany({
      where,
      orderBy: { startTime: 'asc' },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            medicalRecordNumber: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return {
      success: true,
      data: {
        queue,
        count: queue.length,
      },
    };
  }

  async getStats(tenantId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalToday, completed, waiting, inProgress] = await Promise.all([
      this.prisma.appointment.count({
        where: {
          tenantId,
          startTime: {
            gte: today,
          },
        },
      }),
      this.prisma.appointment.count({
        where: {
          tenantId,
          startTime: {
            gte: today,
          },
          status: 'COMPLETED',
        },
      }),
      this.prisma.appointment.count({
        where: {
          tenantId,
          startTime: {
            gte: today,
          },
          status: {
            in: ['SCHEDULED', 'ARRIVED'],
          },
        },
      }),
      this.prisma.appointment.count({
        where: {
          tenantId,
          startTime: {
            gte: today,
          },
          status: 'IN_PROGRESS',
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalToday,
        completed,
        waiting,
        inProgress,
      },
    };
  }
}
