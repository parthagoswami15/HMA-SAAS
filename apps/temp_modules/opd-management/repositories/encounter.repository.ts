import { EntityRepository, Repository, Between, In } from 'typeorm';
import { Encounter } from '../entities/encounter.entity';

@EntityRepository(Encounter)
export class EncounterRepository extends Repository<Encounter> {
  async findByVisitId(visitId: string): Promise<Encounter[]> {
    return this.find({
      where: { visitId },
      relations: ['provider'],
      order: { startTime: 'DESC' },
    });
  }

  async findByProviderId(providerId: string, startDate?: Date, endDate?: Date): Promise<Encounter[]> {
    const where: any = { providerId };
    
    if (startDate && endDate) {
      where.startTime = Between(startDate, endDate);
    }

    return this.find({
      where,
      relations: ['visit', 'visit.patient'],
      order: { startTime: 'DESC' },
    });
  }

  async findIncompleteEncounters(providerId?: string): Promise<Encounter[]> {
    const where: any = { endTime: null };
    if (providerId) where.providerId = providerId;

    return this.find({
      where,
      relations: ['visit', 'visit.patient'],
      order: { startTime: 'ASC' },
    });
  }

  async findEncountersWithSoapNotes(visitId?: string): Promise<Encounter[]> {
    const query = this.createQueryBuilder('encounter')
      .where("encounter.soapNote IS NOT NULL AND encounter.soapNote != '{}'");

    if (visitId) {
      query.andWhere('encounter.visitId = :visitId', { visitId });
    }

    return query.getMany();
  }

  async countEncountersByType(providerId?: string): Promise<{ type: string; count: number }[]> {
    const query = this.createQueryBuilder('encounter')
      .select('encounter.encounterType', 'type')
      .addSelect('COUNT(encounter.id)', 'count')
      .groupBy('encounter.encounterType');

    if (providerId) {
      query.where('encounter.providerId = :providerId', { providerId });
    }

    return query.getRawMany();
  }
}
