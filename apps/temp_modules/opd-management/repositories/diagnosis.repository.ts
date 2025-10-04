import { EntityRepository, Repository, Between, In, Not, IsNull, FindConditions } from 'typeorm';
import { Diagnosis, DiagnosisStatus, DiagnosisType } from '../entities/diagnosis.entity';
import { Icd10Code } from '../entities/icd10-code.entity';
import { PaginationParams } from '../../common/dto/pagination-params.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@EntityRepository(Diagnosis)
export class DiagnosisRepository extends Repository<Diagnosis> {
  async findPatientDiagnoses(
    patientId: string,
    { page = 1, limit = 20 }: PaginationParams = {},
    filters: {
      status?: DiagnosisStatus | DiagnosisStatus[];
      type?: DiagnosisType;
      isPrimary?: boolean;
      fromDate?: Date;
      toDate?: Date;
      searchTerm?: string;
    } = {}
  ): Promise<PaginatedResult<Diagnosis>> {
    const skip = (page - 1) * limit;
    const queryBuilder = this.createQueryBuilder('diagnosis')
      .leftJoinAndSelect('diagnosis.icd10', 'icd10')
      .leftJoinAndSelect('diagnosis.recordedBy', 'recordedBy')
      .where('diagnosis.patientId = :patientId', { patientId })
      .take(limit)
      .skip(skip)
      .orderBy('diagnosis.createdAt', 'DESC');

    // Apply filters
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        queryBuilder.andWhere('diagnosis.status IN (:...statuses)', { statuses: filters.status });
      } else {
        queryBuilder.andWhere('diagnosis.status = :status', { status: filters.status });
      }
    }

    if (filters.type) {
      queryBuilder.andWhere('diagnosis.type = :type', { type: filters.type });
    }

    if (filters.isPrimary !== undefined) {
      queryBuilder.andWhere('diagnosis.isPrimary = :isPrimary', { isPrimary: filters.isPrimary });
    }

    if (filters.fromDate) {
      queryBuilder.andWhere('diagnosis.createdAt >= :fromDate', { fromDate: filters.fromDate });
    }

    if (filters.toDate) {
      queryBuilder.andWhere('diagnosis.createdAt <= :toDate', { toDate: filters.toDate });
    }

    if (filters.searchTerm) {
      queryBuilder.andWhere(
        '(icd10.code ILIKE :searchTerm OR icd10.description ILIKE :searchTerm)',
        { searchTerm: `%${filters.searchTerm}%` }
      );
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findEncounterDiagnoses(encounterId: string): Promise<Diagnosis[]> {
    return this.find({
      where: { encounterId },
      relations: ['icd10', 'recordedBy'],
      order: { isPrimary: 'DESC', createdAt: 'ASC' },
    });
  }

  async findActiveDiagnoses(patientId: string): Promise<Diagnosis[]> {
    return this.find({
      where: {
        patientId,
        status: In([DiagnosisStatus.ACTIVE, DiagnosisStatus.CHRONIC]),
      },
      relations: ['icd10', 'recordedBy'],
      order: { isPrimary: 'DESC', createdAt: 'ASC' },
    });
  }

  async findChronicConditions(patientId: string): Promise<Diagnosis[]> {
    return this.find({
      where: {
        patientId,
        status: DiagnosisStatus.CHRONIC,
      },
      relations: ['icd10'],
    });
  }

  async resolveDiagnosis(id: string, resolvedDate: Date = new Date()): Promise<Diagnosis | undefined> {
    await this.update(id, {
      status: DiagnosisStatus.RESOLVED,
      resolvedDate,
    });
    return this.findOne(id, { relations: ['icd10', 'recordedBy'] });
  }

  async reactivateDiagnosis(id: string): Promise<Diagnosis | undefined> {
    const diagnosis = await this.findOne(id);
    if (!diagnosis) return undefined;

    if ([DiagnosisStatus.RESOLVED, DiagnosisStatus.RULED_OUT].includes(diagnosis.status)) {
      await this.update(id, {
        status: DiagnosisStatus.RECURRED,
        resolvedDate: null,
      });
      return this.findOne(id, { relations: ['icd10', 'recordedBy'] });
    }
    return diagnosis;
  }

  async getDiagnosisStats(patientId: string): Promise<{
    total: number;
    active: number;
    chronic: number;
    resolved: number;
    byCategory: Array<{ category: string; count: number }>;
  }> {
    const [total, active, chronic, resolved, byCategory] = await Promise.all([
      this.count({ where: { patientId } }),
      this.count({ where: { patientId, status: DiagnosisStatus.ACTIVE } }),
      this.count({ where: { patientId, status: DiagnosisStatus.CHRONIC } }),
      this.count({ where: { patientId, status: DiagnosisStatus.RESOLVED } }),
      this.createQueryBuilder('diagnosis')
        .select('icd10.category', 'category')
        .addSelect('COUNT(diagnosis.id)', 'count')
        .leftJoin('diagnosis.icd10', 'icd10')
        .where('diagnosis.patientId = :patientId', { patientId })
        .andWhere('icd10.category IS NOT NULL')
        .groupBy('icd10.category')
        .getRawMany(),
    ]);

    return {
      total,
      active,
      chronic,
      resolved,
      byCategory: byCategory.map(({ category, count }) => ({
        category,
        count: parseInt(count, 10),
      })),
    };
  }

  async getCommonDiagnoses(limit = 10): Promise<Array<{
    icd10Code: Icd10Code;
    count: number;
  }>> {
    return this.createQueryBuilder('diagnosis')
      .select('diagnosis.icd10Code', 'icd10Code')
      .addSelect('COUNT(diagnosis.id)', 'count')
      .leftJoinAndSelect('diagnosis.icd10', 'icd10')
      .groupBy('diagnosis.icd10Code, icd10.code, icd10.description')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getDiagnosisTimeline(patientId: string): Promise<Array<{
    date: Date;
    diagnoses: Diagnosis[];
  }>> {
    const diagnoses = await this.find({
      where: { patientId },
      relations: ['icd10'],
      order: { createdAt: 'DESC' },
    });

    // Group by date
    const grouped = diagnoses.reduce((acc, diagnosis) => {
      const date = diagnosis.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(diagnosis);
      return acc;
    }, {} as Record<string, Diagnosis[]>);

    // Convert to array and sort by date
    return Object.entries(grouped)
      .map(([date, diagnoses]) => ({
        date: new Date(date),
        diagnoses,
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
