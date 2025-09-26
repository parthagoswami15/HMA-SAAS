import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindConditions, Like, Repository } from 'typeorm';
import { NursingChart } from '../entities/nursing-chart.entity';
import { MedicationAdministration } from '../entities/medication-administration.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Admission } from '../entities/admission.entity';
import { MedicationStatus } from '../enums/medication-status.enum';
import { VitalSigns } from '../entities/nursing-chart.entity';

@Injectable()
export class NursingService {
  constructor(
    @InjectRepository(NursingChart)
    private readonly nursingChartRepository: Repository<NursingChart>,
    @InjectRepository(MedicationAdministration)
    private readonly medicationAdminRepository: Repository<MedicationAdministration>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Admission)
    private readonly admissionRepository: Repository<Admission>,
  ) {}

  // Nursing Chart Methods
  async recordVitalSigns(patientId: string, recordedById: string, vitalSigns: Array<{
    vitalSign: VitalSigns;
    value: string;
    unit?: string;
    notes?: string;
  }>) {
    // Check if patient exists
    const patient = await this.patientRepository.findOne(patientId);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    // Check if staff exists
    const staff = await this.staffRepository.findOne(recordedById);
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${recordedById} not found`);
    }

    // Get current admission
    const admission = await this.admissionRepository.findOne({
      where: {
        patientId,
        status: 'ADMITTED',
      },
    });

    if (!admission) {
      throw new BadRequestException('Patient does not have an active admission');
    }

    const records = vitalSigns.map(vs => 
      this.nursingChartRepository.create({
        ...vs,
        patientId,
        recordedById,
        admissionId: admission.id,
      })
    );

    return this.nursingChartRepository.save(records);
  }

  async getVitalSigns(patientId: string, filters: {
    startDate?: Date;
    endDate?: Date;
    vitalSign?: VitalSigns;
    limit?: number;
  } = {}) {
    const { startDate, endDate, vitalSign, limit = 100 } = filters;
    
    const where: FindConditions<NursingChart> = { patientId };
    
    if (vitalSign) {
      where.vitalSign = vitalSign;
    }
    
    if (startDate && endDate) {
      where.recordedAt = Between(startDate, endDate);
    } else if (startDate) {
      where.recordedAt = Between(startDate, new Date());
    }
    
    return this.nursingChartRepository.find({
      where,
      relations: ['recordedBy'],
      order: { recordedAt: 'DESC' },
      take: limit,
    });
  }

  // Medication Administration Record (MAR) Methods
  async scheduleMedication(createMedicationDto: {
    patientId: string;
    medicationOrderId: string;
    medicationName: string;
    dosage: string;
    route?: string;
    frequency: string;
    scheduledTime: Date;
    isPRN?: boolean;
    prnReason?: string;
    isStat?: boolean;
    notes?: string;
    scheduledById: string;
  }) {
    const { patientId, scheduledById, ...rest } = createMedicationDto;
    
    // Check if patient exists
    const patient = await this.patientRepository.findOne(patientId);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }
    
    // Check if staff exists
    const staff = await this.staffRepository.findOne(scheduledById);
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${scheduledById} not found`);
    }
    
    // Get current admission
    const admission = await this.admissionRepository.findOne({
      where: {
        patientId,
        status: 'ADMITTED',
      },
    });

    if (!admission) {
      throw new BadRequestException('Patient does not have an active admission');
    }

    const medication = this.medicationAdminRepository.create({
      ...rest,
      patientId,
      admissionId: admission.id,
      scheduledById: staff.id,
      status: MedicationStatus.PENDING,
    });

    return this.medicationAdminRepository.save(medication);
  }

  async administerMedication(
    medicationId: string, 
    administeredById: string,
    data: {
      administeredAt?: Date;
      notes?: string;
      vitalSigns?: {
        bloodPressure?: string;
        pulse?: number;
        temperature?: number;
        respiration?: number;
      };
    } = {}
  ) {
    const medication = await this.medicationAdminRepository.findOne(medicationId, {
      relations: ['patient', 'admission'],
    });
    
    if (!medication) {
      throw new NotFoundException(`Medication administration record with ID ${medicationId} not found`);
    }
    
    if (medication.status !== MedicationStatus.PENDING && 
        medication.status !== MedicationStatus.HOLD) {
      throw new BadRequestException(`Cannot administer medication with status: ${medication.status}`);
    }
    
    // Check if staff exists
    const staff = await this.staffRepository.findOne(administeredById);
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${administeredById} not found`);
    }
    
    // Update medication status to ADMINISTERED
    medication.status = MedicationStatus.ADMINISTERED;
    medication.administeredAt = data.administeredAt || new Date();
    medication.administeredById = staff.id;
    medication.notes = data.notes || medication.notes;
    
    if (data.vitalSigns) {
      medication.vitalSigns = data.vitalSigns;
    }
    
    // Add to audit log
    medication.auditLog = medication.auditLog || [];
    medication.auditLog.push({
      timestamp: new Date(),
      action: 'MEDICATION_ADMINISTERED',
      performedById: staff.id,
      performedBy: `${staff.firstName} ${staff.lastName}`,
      changes: {
        status: MedicationStatus.ADMINISTERED,
        administeredAt: medication.administeredAt,
        notes: medication.notes,
      },
    });
    
    return this.medicationAdminRepository.save(medication);
  }

  async updateMedicationStatus(
    medicationId: string, 
    status: MedicationStatus, 
    updatedById: string,
    notes?: string
  ) {
    const medication = await this.medicationAdminRepository.findOne(medicationId);
    
    if (!medication) {
      throw new NotFoundException(`Medication administration record with ID ${medicationId} not found`);
    }
    
    // Check if staff exists
    const staff = await this.staffRepository.findOne(updatedById);
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${updatedById} not found`);
    }
    
    // Validate status transition
    const validTransitions = {
      [MedicationStatus.PENDING]: [
        MedicationStatus.ADMINISTERED, 
        MedicationStatus.REFUSED, 
        MedicationStatus.MISSED, 
        MedicationStatus.HOLD,
        MedicationStatus.CANCELLED
      ],
      [MedicationStatus.HOLD]: [
        MedicationStatus.ADMINISTERED, 
        MedicationStatus.CANCELLED
      ],
    };
    
    const allowedTransitions = validTransitions[medication.status] || [];
    
    if (medication.status !== status && !allowedTransitions.includes(status)) {
      throw new BadRequestException(
        `Invalid status transition from ${medication.status} to ${status}`
      );
    }
    
    const previousStatus = medication.status;
    medication.status = status;
    
    if (status === MedicationStatus.ADMINISTERED) {
      medication.administeredAt = new Date();
      medication.administeredById = staff.id;
    }
    
    if (notes) {
      medication.notes = notes;
    }
    
    // Add to audit log
    medication.auditLog = medication.auditLog || [];
    medication.auditLog.push({
      timestamp: new Date(),
      action: `STATUS_CHANGED_${status}`,
      performedById: staff.id,
      performedBy: `${staff.firstName} ${staff.lastName}`,
      changes: {
        status,
        notes: notes || null,
      },
    });
    
    return this.medicationAdminRepository.save(medication);
  }

  async getMedicationAdministrations(patientId: string, filters: {
    startDate?: Date;
    endDate?: Date;
    status?: MedicationStatus;
    isPRN?: boolean;
    medicationName?: string;
    limit?: number;
  } = {}) {
    const { 
      startDate, 
      endDate, 
      status, 
      isPRN, 
      medicationName, 
      limit = 100 
    } = filters;
    
    const query = this.medicationAdminRepository
      .createQueryBuilder('mar')
      .leftJoinAndSelect('mar.patient', 'patient')
      .leftJoinAndSelect('mar.admission', 'admission')
      .leftJoinAndSelect('mar.administeredBy', 'administeredBy')
      .where('mar.patientId = :patientId', { patientId });
    
    if (status) {
      query.andWhere('mar.status = :status', { status });
    }
    
    if (isPRN !== undefined) {
      query.andWhere('mar.isPRN = :isPRN', { isPRN });
    }
    
    if (medicationName) {
      query.andWhere('mar.medicationName ILIKE :medicationName', { 
        medicationName: `%${medicationName}%` 
      });
    }
    
    if (startDate && endDate) {
      query.andWhere('mar.scheduledTime BETWEEN :startDate AND :endDate', { 
        startDate, 
        endDate 
      });
    } else if (startDate) {
      query.andWhere('mar.scheduledTime >= :startDate', { startDate });
    }
    
    query.orderBy('mar.scheduledTime', 'DESC').take(limit);
    
    return query.getMany();
  }

  async getMedicationAdministration(id: string) {
    const medication = await this.medicationAdminRepository.findOne(id, {
      relations: [
        'patient', 
        'admission', 
        'administeredBy', 
        'scheduledBy'
      ],
    });
    
    if (!medication) {
      throw new NotFoundException(`Medication administration record with ID ${id} not found`);
    }
    
    return medication;
  }

  // Reports
  async getMedicationAdherenceReport(patientId: string, startDate: Date, endDate: Date) {
    const medications = await this.medicationAdminRepository
      .createQueryBuilder('mar')
      .where('mar.patientId = :patientId', { patientId })
      .andWhere('mar.scheduledTime BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('mar.scheduledTime', 'ASC')
      .getMany();
    
    const totalScheduled = medications.length;
    const administered = medications.filter(m => m.status === MedicationStatus.ADMINISTERED).length;
    const missed = medications.filter(m => m.status === MedicationStatus.MISSED).length;
    const refused = medications.filter(m => m.status === MedicationStatus.REFUSED).length;
    const onHold = medications.filter(m => m.status === MedicationStatus.HOLD).length;
    const pending = medications.filter(m => m.status === MedicationStatus.PENDING).length;
    
    const adherenceRate = totalScheduled > 0 
      ? Math.round((administered / totalScheduled) * 100) 
      : 0;
    
    return {
      totalScheduled,
      administered,
      missed,
      refused,
      onHold,
      pending,
      adherenceRate,
      medications,
    };
  }
}
