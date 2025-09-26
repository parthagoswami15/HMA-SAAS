import { EntityRepository, Repository, Not, IsNull } from 'typeorm';
import { Visit } from '../entities/visit.entity';
import { VisitStatus } from '../enums/visit.enum';

@EntityRepository(Visit)
export class VisitRepository extends Repository<Visit> {
  async hasAssociatedRecords(visitId: string): Promise<boolean> {
    const [encounters, prescriptions, orders] = await Promise.all([
      this.manager.count('encounter', { where: { visitId } }),
      this.manager.count('prescription', { where: { visitId } }),
      this.manager.count('order', { where: { visitId } }),
    ]);

    return encounters > 0 || prescriptions > 0 || orders > 0;
  }

  async findActiveVisits(patientId: string): Promise<Visit[]> {
    return this.find({
      where: {
        patientId,
        status: In([VisitStatus.SCHEDULED, VisitStatus.IN_PROGRESS, VisitStatus.ARRIVED]),
      },
      order: { scheduledAt: 'DESC' },
    });
  }

  async findCompletedVisits(patientId: string, limit = 10): Promise<Visit[]> {
    return this.find({
      where: {
        patientId,
        status: VisitStatus.COMPLETED,
      },
      order: { completedAt: 'DESC' },
      take: limit,
    });
  }

  async findVisitsByProvider(providerId: string, status?: VisitStatus): Promise<Visit[]> {
    const where: any = { providerId };
    if (status) where.status = status;

    return this.find({
      where,
      relations: ['patient'],
      order: { scheduledAt: 'DESC' },
    });
  }

  async findVisitsByDateRange(
    startDate: Date,
    endDate: Date,
    status?: VisitStatus,
  ): Promise<Visit[]> {
    const where: any = {
      scheduledAt: Between(startDate, endDate),
    };

    if (status) where.status = status;

    return this.find({
      where,
      relations: ['patient', 'provider'],
      order: { scheduledAt: 'ASC' },
    });
  }

  async countVisitsByStatus(patientId?: string): Promise<{ status: string; count: number }[]> {
    const query = this.createQueryBuilder('visit')
      .select('visit.status', 'status')
      .addSelect('COUNT(visit.id)', 'count')
      .groupBy('visit.status');

    if (patientId) {
      query.where('visit.patientId = :patientId', { patientId });
    }

    return query.getRawMany();
  }
}
