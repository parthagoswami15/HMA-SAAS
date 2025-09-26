import { EntityRepository, Repository, Between, MoreThan, LessThan } from 'typeorm';
import { Vitals } from '../entities/vitals.entity';
import { Patient } from '../../patient/entities/patient.entity';

@EntityRepository(Vitals)
export class VitalsRepository extends Repository<Vitals> {
  async findByPatientId(patientId: string, limit = 10): Promise<Vitals[]> {
    return this.find({
      where: { patientId },
      order: { recordedAt: 'DESC' },
      take: limit,
      relations: ['recordedBy'],
    });
  }

  async findByVisitId(visitId: string): Promise<Vitals[]> {
    return this.find({
      where: { visitId },
      order: { recordedAt: 'DESC' },
      relations: ['recordedBy'],
    });
  }

  async findRecentByPatient(patientId: string, days = 30): Promise<Vitals[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.find({
      where: {
        patientId,
        recordedAt: MoreThan(date),
      },
      order: { recordedAt: 'DESC' },
    });
  }

  async getVitalsTrends(patientId: string, metric: keyof Vitals, days = 30): Promise<{ date: Date; value: any }[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const vitals = await this.createQueryBuilder('vitals')
      .select(['vitals.recordedAt', `vitals.${metric}`])
      .where('vitals.patientId = :patientId', { patientId })
      .andWhere('vitals.recordedAt > :date', { date })
      .orderBy('vitals.recordedAt', 'ASC')
      .getMany();

    return vitals.map(v => ({
      date: v.recordedAt,
      value: v[metric],
    }));
  }

  async getAbnormalVitals(thresholds: {
    temperature?: { min: number; max: number };
    heartRate?: { min: number; max: number };
    bloodPressure?: { minSys: number; maxSys: number; minDia: number; maxDia: number };
    oxygenSaturation?: { min: number };
  }): Promise<Vitals[]> {
    const query = this.createQueryBuilder('vitals')
      .where('1=1');

    if (thresholds.temperature) {
      query.andWhere('(vitals.temperature < :minTemp OR vitals.temperature > :maxTemp)', {
        minTemp: thresholds.temperature.min,
        maxTemp: thresholds.temperature.max,
      });
    }

    if (thresholds.heartRate) {
      query.andWhere('(vitals.heartRate < :minHR OR vitals.heartRate > :maxHR)', {
        minHR: thresholds.heartRate.min,
        maxHR: thresholds.heartRate.max,
      });
    }

    if (thresholds.bloodPressure) {
      query.andWhere(
        `(CAST(SPLIT_PART(vitals.bloodPressure, '/', 1) AS INTEGER) < :minSys OR ` +
        `CAST(SPLIT_PART(vitals.bloodPressure, '/', 1) AS INTEGER) > :maxSys OR ` +
        `CAST(SPLIT_PART(vitals.bloodPressure, '/', 2) AS INTEGER) < :minDia OR ` +
        `CAST(SPLIT_PART(vitals.bloodPressure, '/', 2) AS INTEGER) > :maxDia)`,
        {
          minSys: thresholds.bloodPressure.minSys,
          maxSys: thresholds.bloodPressure.maxSys,
          minDia: thresholds.bloodPressure.minDia,
          maxDia: thresholds.bloodPressure.maxDia,
        }
      );
    }

    if (thresholds.oxygenSaturation) {
      query.andWhere('vitals.oxygenSaturation < :minSpO2', {
        minSpO2: thresholds.oxygenSaturation.min,
      });
    }

    return query
      .orderBy('vitals.recordedAt', 'DESC')
      .leftJoinAndSelect('vitals.patient', 'patient')
      .getMany();
  }

  async getLastVitals(patientId: string): Promise<Partial<Vitals> | null> {
    const vitals = await this.findOne({
      where: { patientId },
      order: { recordedAt: 'DESC' },
    });

    if (!vitals) return null;

    // Return only the most recent vitals
    return {
      temperature: vitals.temperature,
      heartRate: vitals.heartRate,
      bloodPressure: vitals.bloodPressure,
      respiratoryRate: vitals.respiratoryRate,
      oxygenSaturation: vitals.oxygenSaturation,
      height: vitals.height,
      weight: vitals.weight,
      bmi: vitals.bmi,
      painScore: vitals.painScore,
      recordedAt: vitals.recordedAt,
    };
  }
}
