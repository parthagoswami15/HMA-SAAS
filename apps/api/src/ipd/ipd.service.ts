import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IpdService {
  constructor(private prisma: PrismaService) {}

  // Wards
  async createWard(createDto: any, tenantId: string) {
    const ward = await this.prisma.ward.create({
      data: { ...createDto, tenantId },
    });
    return { success: true, message: 'Ward created successfully', data: ward };
  }

  async findAllWards(tenantId: string, query: any) {
    const { page = 1, limit = 10 } = query;
    const [wards, total] = await Promise.all([
      this.prisma.ward.findMany({
        where: { tenantId, isActive: true },
        skip: (page - 1) * limit,
        take: Number(limit),
        include: {
          beds: true,
          _count: { select: { beds: true } },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.ward.count({ where: { tenantId, isActive: true } }),
    ]);
    return {
      success: true,
      data: {
        items: wards,
        pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
      },
    };
  }

  async findOneWard(id: string, tenantId: string) {
    const ward = await this.prisma.ward.findFirst({
      where: { id, tenantId, isActive: true },
      include: { beds: true },
    });
    if (!ward) throw new NotFoundException('Ward not found');
    return { success: true, data: ward };
  }

  async updateWard(id: string, updateDto: any, tenantId: string) {
    const ward = await this.prisma.ward.findFirst({ where: { id, tenantId, isActive: true } });
    if (!ward) throw new NotFoundException('Ward not found');
    const updated = await this.prisma.ward.update({ where: { id }, data: updateDto });
    return { success: true, message: 'Ward updated successfully', data: updated };
  }

  // Beds
  async createBed(createDto: any, tenantId: string) {
    const bed = await this.prisma.bed.create({
      data: { ...createDto, tenantId },
      include: { ward: true },
    });
    return { success: true, message: 'Bed created successfully', data: bed };
  }

  async findAllBeds(tenantId: string, query: any) {
    const { page = 1, limit = 10, wardId, status } = query;
    const where: any = { tenantId, isActive: true };
    if (wardId) where.wardId = wardId;
    if (status) where.status = status;

    const [beds, total] = await Promise.all([
      this.prisma.bed.findMany({
        where,
        skip: (page - 1) * limit,
        take: Number(limit),
        include: { ward: true },
        orderBy: { bedNumber: 'asc' },
      }),
      this.prisma.bed.count({ where }),
    ]);
    return {
      success: true,
      data: {
        items: beds,
        pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
      },
    };
  }

  async findAvailableBeds(tenantId: string) {
    const beds = await this.prisma.bed.findMany({
      where: { tenantId, isActive: true, status: 'AVAILABLE' },
      include: { ward: true },
      orderBy: { bedNumber: 'asc' },
    });
    return { success: true, data: beds };
  }

  async updateBedStatus(id: string, status: string, tenantId: string) {
    const bed = await this.prisma.bed.findFirst({ where: { id, tenantId } });
    if (!bed) throw new NotFoundException('Bed not found');
    const updated = await this.prisma.bed.update({ where: { id }, data: { status: status as any } });
    return { success: true, message: 'Bed status updated', data: updated };
  }

  async getStats(tenantId: string) {
    const [totalWards, totalBeds, availableBeds, occupiedBeds] = await Promise.all([
      this.prisma.ward.count({ where: { tenantId, isActive: true } }),
      this.prisma.bed.count({ where: { tenantId, isActive: true } }),
      this.prisma.bed.count({ where: { tenantId, isActive: true, status: 'AVAILABLE' } }),
      this.prisma.bed.count({ where: { tenantId, isActive: true, status: 'OCCUPIED' } }),
    ]);
    return {
      success: true,
      data: {
        wards: totalWards,
        beds: { total: totalBeds, available: availableBeds, occupied: occupiedBeds },
        occupancyRate: totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(2) : 0,
      },
    };
  }
}
