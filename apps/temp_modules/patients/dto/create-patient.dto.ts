import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  Visit, 
  QueueToken, 
  Prisma,
  QueueStatus 
} from '@prisma/client';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class OPDService {
  constructor(
    private prisma: PrismaService,
  ) {}

  // Visit Management
  async createVisit(data: Prisma.VisitCreateInput) {
    return this.prisma.visit.create({ data });
  }

  async updateVisit(id: string, data: Prisma.VisitUpdateInput) {
    return this.prisma.visit.update({
      where: { id },
      data,
    });
  }

  async getVisit(id: string) {
    return this.prisma.visit.findUnique({
      where: { id },
      include: { patient: true, doctor: true },
    });
  }

  async getVisits(options: IPaginationOptions): Promise<Pagination<Visit>> {
    return paginate<Visit>(this.prisma.visit, options, {
      include: { patient: true, doctor: true },
    });
  }

  // Queue Management
  async addToQueue(createQueueTokenDto: any): Promise<QueueToken> {
    return this.prisma.queueToken.create({
      data: {
        ...createQueueTokenDto,
        status: QueueStatus.WAITING,
        tokenNumber: await this.generateTokenNumber(),
      },
    });
  }

  async getQueue(departmentId?: string): Promise<QueueToken[]> {
    const where: any = {};
    if (departmentId) {
      where.departmentId = departmentId;
    }
    return this.prisma.queueToken.findMany({
      where,
      include: { patient: true, department: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async callNextPatient(id: string, updateData: any): Promise<QueueToken> {
    return this.prisma.$transaction(async (tx) => {
      // Update current patient
      const updated = await tx.queueToken.update({
        where: { id },
        data: {
          status: updateData.status || QueueStatus.IN_PROGRESS,
          calledAt: new Date(),
        },
        include: { patient: true },
      });

      // Update previous in-progress to completed
      await tx.queueToken.updateMany({
        where: {
          id: { not: id },
          status: QueueStatus.IN_PROGRESS,
          departmentId: updateData.departmentId,
        },
        data: { status: QueueStatus.COMPLETED, completedAt: new Date() },
      });

      return updated;
    });
  }

  private async generateTokenNumber(): Promise<number> {
    const lastToken = await this.prisma.queueToken.findFirst({
      orderBy: { tokenNumber: 'desc' },
      select: { tokenNumber: true },
    });
    return lastToken ? lastToken.tokenNumber + 1 : 1;
  }
}