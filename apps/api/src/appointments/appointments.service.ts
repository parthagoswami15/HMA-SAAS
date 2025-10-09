import { Injectable } from '@nestjs/common';
import { CustomPrismaService } from '../prisma/custom-prisma.service';
import { CreateAppointmentDto, UpdateAppointmentDto, AppointmentQueryDto } from './dto/appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: CustomPrismaService) {}

  async create(tenantId: string, createAppointmentDto: CreateAppointmentDto) {
    const { appointmentDateTime, ...rest } = createAppointmentDto;
    const startTime = new Date(appointmentDateTime);
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 minutes duration
    
    return this.prisma.appointment.create({
      data: {
        patientId: rest.patientId,
        doctorId: rest.doctorId,
        departmentId: rest.departmentId,
        startTime,
        endTime,
        reason: rest.reason,
        notes: rest.notes,
        status: rest.status || 'SCHEDULED',
        tenantId,
      },
      include: {
        patient: {
          select: {
            id: true,
            medicalRecordNumber: true,
            firstName: true,
            lastName: true,
            phone: true,
          }
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
      },
    });
  }

  async findAll(tenantId: string, query: AppointmentQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      doctorId,
      patientId,
      startDate,
      endDate,
    } = query;

    const skip = (page - 1) * limit;
    const where: any = { tenantId };

    if (search) {
      where.OR = [
        {
          patient: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { patientId: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
        {
          doctor: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (doctorId) {
      where.doctorId = doctorId;
    }

    if (patientId) {
      where.patientId = patientId;
    }

    if (startDate && endDate) {
      where.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.startTime = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      where.startTime = {
        lte: new Date(endDate),
      };
    }

    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startTime: 'asc' },
        include: {
          patient: {
            select: {
              id: true,
              medicalRecordNumber: true,
              firstName: true,
              lastName: true,
              phone: true,
            }
          },
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            }
          },
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      data: appointments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.appointment.findFirst({
      where: { id, tenantId },
      include: {
        patient: {
          select: {
            id: true,
            medicalRecordNumber: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          }
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
      },
    });
  }

  async update(tenantId: string, id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const { appointmentDateTime, ...rest } = updateAppointmentDto;
    let updateData: any = { ...rest };
    
    if (appointmentDateTime) {
      const startTime = new Date(appointmentDateTime);
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
      updateData = { ...updateData, startTime, endTime };
    }
    
    return this.prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        patient: {
          select: {
            id: true,
            medicalRecordNumber: true,
            firstName: true,
            lastName: true,
            phone: true,
          }
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
      },
    });
  }

  async remove(tenantId: string, id: string) {
    return this.prisma.appointment.delete({
      where: { id },
    });
  }

  async getCalendarView(tenantId: string, startDate: string, endDate: string) {
    return this.prisma.appointment.findMany({
      where: {
        tenantId,
        startTime: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          }
        },
        doctor: {
          select: {
            firstName: true,
            lastName: true,
          }
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async getAvailableSlots(doctorId: string, date: string) {
    // Basic implementation - in real scenario this would check doctor's schedule
    const appointedTimes = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        startTime: {
          gte: new Date(date + 'T00:00:00Z'),
          lt: new Date(date + 'T23:59:59Z'),
        },
      },
      select: { startTime: true },
    });

    // Generate time slots (9 AM to 5 PM, 30-minute intervals)
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(date + `T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00Z`);
        const isBooked = appointedTimes.some(apt => 
          Math.abs(apt.startTime.getTime() - slotTime.getTime()) < 30 * 60 * 1000
        );
        
        if (!isBooked) {
          slots.push({
            time: slotTime.toTimeString().substring(0, 5),
            available: true,
          });
        }
      }
    }

    return slots;
  }

  async getStats(tenantId: string) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const [
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
    ] = await Promise.all([
      this.prisma.appointment.count({ where: { tenantId } }),
      this.prisma.appointment.count({
        where: {
          tenantId,
          startTime: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
      this.prisma.appointment.count({
        where: { tenantId, status: 'SCHEDULED' },
      }),
      this.prisma.appointment.count({
        where: { tenantId, status: 'COMPLETED' },
      }),
    ]);

    return {
      total: totalAppointments,
      today: todayAppointments,
      pending: pendingAppointments,
      completed: completedAppointments,
    };
  }

  async getCalendar(tenantId: string, query: any) {
    const { startDate, endDate } = query;
    return this.getCalendarView(tenantId, startDate, endDate);
  }

  async checkAvailability(tenantId: string, query: any) {
    const { doctorId, date } = query;
    return this.getAvailableSlots(doctorId, date);
  }

  async updateStatus(id: string, status: string, tenantId: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: status as any },
      include: {
        patient: {
          select: {
            id: true,
            medicalRecordNumber: true,
            firstName: true,
            lastName: true,
            phone: true,
          }
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
      },
    });
  }
}
