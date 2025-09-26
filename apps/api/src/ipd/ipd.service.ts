import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IpdService {
  constructor(private prisma: PrismaService) {}

  // Rooms
  createRoom(tenantId: string, data: { code: string; type: string; capacity?: number }) {
    return this.prisma.room.create({ data: { tenantId, occupied: 0, capacity: data.capacity ?? 1, code: data.code, type: data.type } });
  }

  listRooms(tenantId: string) {
    return this.prisma.room.findMany({ where: { tenantId }, orderBy: { code: 'asc' } });
  }

  // Admissions
  async admit(tenantId: string, data: { patientId: string; roomId: string; diagnosis?: string; notes?: string }) {
    const room = await this.prisma.room.findFirst({ where: { id: data.roomId, tenantId } });
    if (!room) throw new NotFoundException('Room not found');
    if (room.occupied >= room.capacity) throw new Error('Room full');
    const admission = await this.prisma.admission.create({ data: { tenantId, ...data } });
    await this.prisma.room.update({ where: { id: room.id }, data: { occupied: { increment: 1 } } });
    return admission;
  }

  listAdmissions(tenantId: string) {
    return this.prisma.admission.findMany({ where: { tenantId }, orderBy: { admittedAt: 'desc' } });
  }

  async discharge(tenantId: string, id: string) {
    const adm = await this.prisma.admission.findFirst({ where: { id, tenantId } });
    if (!adm) throw new NotFoundException('Admission not found');
    const updated = await this.prisma.admission.update({ where: { id }, data: { dischargedAt: new Date() } });
    await this.prisma.room.update({ where: { id: adm.roomId }, data: { occupied: { decrement: 1 } } });
    return updated;
  }
}


