import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OpdService {
  constructor(private prisma: PrismaService) {}

  createEncounter(tenantId: string, data: { patientId: string; doctorId: string; type: string; occurredAt?: Date; vitals?: any; diagnosis?: string; procedures?: any; notes?: string }) {
    return this.prisma.encounter.create({ data: { tenantId, occurredAt: new Date(), ...data } });
  }

  async getEncounter(tenantId: string, id: string) {
    const e = await this.prisma.encounter.findFirst({ where: { id, tenantId } });
    if (!e) throw new NotFoundException('Encounter not found');
    return e;
  }

  listEncounters(tenantId: string) {
    return this.prisma.encounter.findMany({ where: { tenantId }, orderBy: { occurredAt: 'desc' } });
  }

  async updateEncounter(tenantId: string, id: string, data: any) {
    await this.getEncounter(tenantId, id);
    return this.prisma.encounter.update({ where: { id }, data });
  }
}


