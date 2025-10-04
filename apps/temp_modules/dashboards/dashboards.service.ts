import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardsService {
  constructor(private prisma: PrismaService) {}

  async overview(tenantId: string) {
    const [patients, invoices, labOrders] = await Promise.all([
      this.prisma.patient.count({ where: { tenantId } }),
      this.prisma.invoice.count({ where: { tenantId } }),
      this.prisma.labOrder.count({ where: { tenantId } }),
    ]);
    return { patients, invoices, labOrders };
  }
}


