import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class SchedulingService {
  constructor(private prisma: PrismaService) {}

  // Schedules
  async createSchedule(tenantId: string, data: { 
    doctorId: string; 
    dayOfWeek: number; 
    startTime: string; 
    endTime: string; 
    location?: string 
  }) {
    // Check if doctor exists
    const doctor = await this.prisma.user.findFirst({
      where: { 
        id: data.doctorId, 
        tenantId,
        role: { in: ['DOCTOR', 'PHYSICIAN'] }
      }
    });

    if (!doctor) {
      throw new BadRequestException('Doctor not found or not authorized');
    }

    return this.prisma.schedule.create({ 
      data: { 
        tenantId, 
        ...data,
        isActive: true
      } 
    });
  }

  listSchedules(tenantId: string) {
    return this.prisma.schedule.findMany({ 
      where: { tenantId, isActive: true }, 
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });
  }

  // Appointments
  async createAppointment(tenantId: string, data: { 
    patientId: string; 
    doctorId: string; 
    appointmentDate: Date;
    startTime: string; 
    endTime: string;
    type: string;
    notes?: string 
  }) {
    // Check if patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: data.patientId, tenantId }
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Check if doctor exists and is active
    const doctor = await this.prisma.user.findFirst({
      where: { 
        id: data.doctorId, 
        tenantId,
        isActive: true,
        role: { in: ['DOCTOR', 'PHYSICIAN'] }
      }
    });

    if (!doctor) {
      throw new BadRequestException('Doctor not found or not available');
    }

    // Check for scheduling conflicts
    const conflictingAppointment = await this.prisma.appointment.findFirst({
      where: {
        tenantId,
        doctorId: data.doctorId,
        appointmentDate: data.appointmentDate,
        startTime: data.startTime,
        status: {
          notIn: ['CANCELLED', 'COMPLETED']
        }
      }
    });

    if (conflictingAppointment) {
      throw new BadRequestException('Time slot is already booked');
    }

    return this.prisma.appointment.create({ 
      data: { 
        tenantId, 
        ...data,
        status: 'SCHEDULED' as AppointmentStatus
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true
          }
        },
        doctor: {
          select: {
            id: true,
            specialty: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
  }

  async getAppointment(tenantId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({ 
      where: { id, tenantId },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true
          }
        },
        doctor: {
          select: {
            id: true,
            specialty: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
    
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    
    return appointment;
  }

  listAppointments(tenantId: string, filters: {
    patientId?: string;
    doctorId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}) {
    const where: any = { tenantId };

    if (filters.patientId) where.patientId = filters.patientId;
    if (filters.doctorId) where.doctorId = filters.doctorId;
    if (filters.status) where.status = filters.status;
    
    if (filters.startDate || filters.endDate) {
      where.appointmentDate = {};
      if (filters.startDate) where.appointmentDate.gte = filters.startDate;
      if (filters.endDate) where.appointmentDate.lte = filters.endDate;
    }

    return this.prisma.appointment.findMany({ 
      where,
      orderBy: [
        { appointmentDate: 'asc' },
        { startTime: 'asc' }
      ],
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        doctor: {
          select: {
            id: true,
            specialty: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
  }

  async updateAppointment(tenantId: string, id: string, data: any) {
    await this.getAppointment(tenantId, id);
    
    return this.prisma.appointment.update({ 
      where: { id }, 
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        doctor: {
          select: {
            id: true,
            specialty: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
  }

  async cancelAppointment(tenantId: string, id: string, reason?: string) {
    const appointment = await this.getAppointment(tenantId, id);
    
    // Don't allow cancelling already cancelled or completed appointments
    if (appointment.status === 'CANCELLED') {
      throw new BadRequestException('Appointment is already cancelled');
    }
    
    if (appointment.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel a completed appointment');
    }

    return this.prisma.appointment.update({ 
      where: { id }, 
      data: { 
        status: 'CANCELLED' as AppointmentStatus,
        cancellationReason: reason,
        cancelledAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        doctor: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
  }
}


