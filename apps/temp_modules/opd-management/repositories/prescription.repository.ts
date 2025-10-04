import { EntityRepository, Repository, Between, In, Not } from 'typeorm';
import { Prescription, PrescriptionStatus } from '../entities/prescription.entity';

@EntityRepository(Prescription)
export class PrescriptionRepository extends Repository<Prescription> {
  async findByVisitId(visitId: string): Promise<Prescription[]> {
    return this.find({
      where: { visitId },
      relations: ['provider', 'items'],
      order: { datePrescribed: 'DESC' },
    });
  }

  async findByPatientId(patientId: string, status?: PrescriptionStatus): Promise<Prescription[]> {
    const where: any = { patientId };
    if (status) where.status = status;

    return this.find({
      where,
      relations: ['provider', 'items', 'visit'],
      order: { datePrescribed: 'DESC' },
    });
  }

  async findActivePrescriptions(patientId: string): Promise<Prescription[]> {
    return this.find({
      where: {
        patientId,
        status: In([PrescriptionStatus.ACTIVE, PrescriptionStatus.PENDING]),
        endDate: Not(IsNull()),
      },
      relations: ['provider', 'items'],
      order: { endDate: 'ASC' },
    });
  }

  async findExpiringPrescriptions(days: number = 7): Promise<Prescription[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return this.createQueryBuilder('prescription')
      .where('prescription.endDate BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('prescription.status = :status', { status: PrescriptionStatus.ACTIVE })
      .leftJoinAndSelect('prescription.patient', 'patient')
      .leftJoinAndSelect('prescription.provider', 'provider')
      .orderBy('prescription.endDate', 'ASC')
      .getMany();
  }

  async countPrescriptionsByStatus(providerId?: string): Promise<{ status: string; count: number }[]> {
    const query = this.createQueryBuilder('prescription')
      .select('prescription.status', 'status')
      .addSelect('COUNT(prescription.id)', 'count')
      .groupBy('prescription.status');

    if (providerId) {
      query.where('prescription.providerId = :providerId', { providerId });
    }

    return query.getRawMany();
  }

  async findPrescriptionsByMedication(medicationName: string): Promise<Prescription[]> {
    return this.createQueryBuilder('prescription')
      .innerJoin('prescription.items', 'item')
      .where('LOWER(item.name) LIKE LOWER(:name)', { name: `%${medicationName}%` })
      .orWhere('LOWER(item.genericName) LIKE LOWER(:name)', { name: `%${medicationName}%` })
      .leftJoinAndSelect('prescription.patient', 'patient')
      .leftJoinAndSelect('prescription.provider', 'provider')
      .orderBy('prescription.datePrescribed', 'DESC')
      .getMany();
  }
}
