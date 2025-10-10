import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmergencyService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: any, tenantId: string) {
    const emergencyCase = await this.prisma.emergencyCase.create({
      data: { ...createDto, tenantId },
      include: { patient: true },
    });
    return { success: true, message: 'Emergency case created', data: emergencyCase };
  }

  async findAll(tenantId: string, query: any) {
    const { page = 1, limit = 10, status, triageLevel } = query;
    const where: any = { tenantId, isActive: true };
    if (status) where.status = status;
    if (triageLevel) where.triageLevel = triageLevel;

    const [cases, total] = await Promise.all([
      this.prisma.emergencyCase.findMany({
        where,
        skip: (page - 1) * limit,
        take: Number(limit),
        include: { patient: true },
        orderBy: { arrivalTime: 'desc' },
      }),
      this.prisma.emergencyCase.count({ where }),
    ]);
    return {
      success: true,
      data: { items: cases, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } },
    };
  }

  async findOne(id: string, tenantId: string) {
    const emergencyCase = await this.prisma.emergencyCase.findFirst({
      where: { id, tenantId, isActive: true },
      include: { patient: true },
    });
    if (!emergencyCase) throw new NotFoundException('Emergency case not found');
    return { success: true, data: emergencyCase };
  }

  async update(id: string, updateDto: any, tenantId: string) {
    const emergencyCase = await this.prisma.emergencyCase.findFirst({ where: { id, tenantId } });
    if (!emergencyCase) throw new NotFoundException('Emergency case not found');
    const updated = await this.prisma.emergencyCase.update({ where: { id }, data: updateDto });
    return { success: true, message: 'Emergency case updated', data: updated };
  }

  async updateTriage(id: string, triageDto: any, tenantId: string) {
    const emergencyCase = await this.prisma.emergencyCase.findFirst({ where: { id, tenantId } });
    if (!emergencyCase) throw new NotFoundException('Emergency case not found');
    const updated = await this.prisma.emergencyCase.update({ where: { id }, data: { triageLevel: triageDto.triageLevel } });
    return { success: true, message: 'Triage level updated', data: updated };
  }

  async getQueue(tenantId: string) {
    const queue = await this.prisma.emergencyCase.findMany({
      where: { tenantId, status: { in: ['WAITING', 'IN_TREATMENT'] } },
      include: { patient: true },
      orderBy: [{ triageLevel: 'asc' }, { arrivalTime: 'asc' }],
    });
    return { success: true, data: queue };
  }

  async getStats(tenantId: string) {
    const [total, waiting, inTreatment, criticalCases] = await Promise.all([
      this.prisma.emergencyCase.count({ where: { tenantId, isActive: true } }),
      this.prisma.emergencyCase.count({ where: { tenantId, status: 'WAITING' } }),
      this.prisma.emergencyCase.count({ where: { tenantId, status: 'IN_TREATMENT' } }),
      this.prisma.emergencyCase.count({ where: { tenantId, triageLevel: 'CRITICAL' } }),
    ]);
    return { success: true, data: { total, waiting, inTreatment, criticalCases } };
  }
}
