import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChamberDto, UpdateChamberDto } from './dto/chamber.dto';

@Injectable()
export class ChambersService {
  constructor(private prisma: PrismaService) {}

  async createChamber(tenantId: string, doctorId: string, data: CreateChamberDto) {
    return this.prisma.chamber.create({
      data: {
        tenantId,
        doctorId,
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        consultationFee: data.consultationFee,
        currency: data.currency || 'USD',
        workingHours: data.workingHours,
        isActive: true,
      },
    });
  }

  async getChambers(tenantId: string, doctorId?: string) {
    const where: any = { tenantId };
    if (doctorId) {
      where.doctorId = doctorId;
    }

    return this.prisma.chamber.findMany({
      where,
      include: {
        appointments: {
          where: {
            startsAt: {
              gte: new Date(),
            },
          },
          orderBy: { startsAt: 'asc' },
          take: 5,
        },
      },
    });
  }

  async getChamberById(tenantId: string, id: string) {
    const chamber = await this.prisma.chamber.findFirst({
      where: { id, tenantId },
      include: {
        appointments: {
          orderBy: { startsAt: 'desc' },
          take: 10,
          include: {
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!chamber) {
      throw new NotFoundException('Chamber not found');
    }

    return chamber;
  }

  async updateChamber(tenantId: string, id: string, data: UpdateChamberDto) {
    const chamber = await this.prisma.chamber.findFirst({
      where: { id, tenantId },
    });

    if (!chamber) {
      throw new NotFoundException('Chamber not found');
    }

    return this.prisma.chamber.update({
      where: { id },
      data,
    });
  }

  async deleteChamber(tenantId: string, id: string) {
    const chamber = await this.prisma.chamber.findFirst({
      where: { id, tenantId },
    });

    if (!chamber) {
      throw new NotFoundException('Chamber not found');
    }

    return this.prisma.chamber.delete({
      where: { id },
    });
  }

  async bookAppointment(tenantId: string, chamberId: string, appointmentData: any) {
    const chamber = await this.prisma.chamber.findFirst({
      where: { id: chamberId, tenantId },
    });

    if (!chamber) {
      throw new NotFoundException('Chamber not found');
    }

    return this.prisma.appointment.create({
      data: {
        tenantId,
        patientId: appointmentData.patientId,
        doctorId: chamber.doctorId,
        chamberId,
        startsAt: appointmentData.startsAt,
        endsAt: appointmentData.endsAt,
        notes: appointmentData.notes,
        status: 'scheduled',
      },
    });
  }
}
