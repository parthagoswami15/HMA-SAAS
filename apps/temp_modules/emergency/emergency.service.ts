import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmergencyCaseDto, UpdateEmergencyCaseDto } from './dto/emergency.dto';

@Injectable()
export class EmergencyService {
  constructor(private prisma: PrismaService) {}

  async createEmergencyCase(tenantId: string, data: CreateEmergencyCaseDto) {
    return this.prisma.emergencyCase.create({
      data: {
        tenantId,
        patientId: data.patientId,
        triageLevel: data.triageLevel,
        chiefComplaint: data.chiefComplaint,
        vitals: data.vitals,
        assignedTo: data.assignedTo,
        notes: data.notes,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dob: true,
            phone: true,
          },
        },
      },
    });
  }

  async getEmergencyCases(tenantId: string, status?: string) {
    const where: any = { tenantId };
    if (status) {
      where.status = status;
    }

    return this.prisma.emergencyCase.findMany({
      where,
      orderBy: [
        { triageLevel: 'asc' }, // CRITICAL first
        { arrivalTime: 'asc' },
      ],
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dob: true,
            phone: true,
          },
        },
      },
    });
  }

  async getEmergencyCaseById(tenantId: string, id: string) {
    const emergencyCase = await this.prisma.emergencyCase.findFirst({
      where: { id, tenantId },
      include: {
        patient: true,
      },
    });

    if (!emergencyCase) {
      throw new NotFoundException('Emergency case not found');
    }

    return emergencyCase;
  }

  async updateEmergencyCase(tenantId: string, id: string, data: UpdateEmergencyCaseDto) {
    const emergencyCase = await this.prisma.emergencyCase.findFirst({
      where: { id, tenantId },
    });

    if (!emergencyCase) {
      throw new NotFoundException('Emergency case not found');
    }

    return this.prisma.emergencyCase.update({
      where: { id },
      data,
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
    });
  }

  async dischargeEmergencyCase(tenantId: string, id: string, notes?: string) {
    return this.updateEmergencyCase(tenantId, id, {
      status: 'DISCHARGED',
      dischargeTime: new Date(),
      notes,
    });
  }

  async admitEmergencyCase(tenantId: string, id: string, roomId?: string) {
    const updateData: any = {
      status: 'ADMITTED',
      dischargeTime: new Date(),
    };

    // If room provided, create admission record
    if (roomId) {
      const emergencyCase = await this.getEmergencyCaseById(tenantId, id);
      
      await this.prisma.admission.create({
        data: {
          tenantId,
          patientId: emergencyCase.patientId,
          roomId,
          diagnosis: emergencyCase.chiefComplaint,
          notes: `Admitted from emergency department. Triage: ${emergencyCase.triageLevel}`,
        },
      });
    }

    return this.updateEmergencyCase(tenantId, id, updateData);
  }

  async getTriageStats(tenantId: string) {
    const stats = await this.prisma.emergencyCase.groupBy({
      by: ['triageLevel', 'status'],
      where: { tenantId },
      _count: true,
    });

    return stats.reduce((acc: Record<string, Record<string, number>>, stat) => {
      if (!acc[stat.triageLevel]) {
        acc[stat.triageLevel] = {};
      }
      acc[stat.triageLevel][stat.status] = stat._count;
      return acc;
    }, {});
  }
}
