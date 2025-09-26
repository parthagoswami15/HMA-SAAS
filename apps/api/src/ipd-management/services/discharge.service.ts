import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindConditions, In, Repository } from 'typeorm';
import { Discharge } from '../entities/discharge.entity';
import { Admission } from '../entities/admission.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Bed } from '../entities/bed.entity';
import { DischargeStatus } from '../enums/discharge-status.enum';
import { DischargeType } from '../enums/discharge-type.enum';
import { AdmissionStatus } from '../enums/admission-status.enum';

@Injectable()
export class DischargeService {
  constructor(
    @InjectRepository(Discharge)
    private readonly dischargeRepository: Repository<Discharge>,
    @InjectRepository(Admission)
    private readonly admissionRepository: Repository<Admission>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Bed)
    private readonly bedRepository: Repository<Bed>,
  ) {}

  async initiateDischarge(admissionId: string, dischargedById: string, dischargeType: DischargeType) {
    // Check if admission exists and is active
    const admission = await this.admissionRepository.findOne({
      where: { id: admissionId },
      relations: ['patient', 'bed', 'discharge'],
    });

    if (!admission) {
      throw new NotFoundException(`Admission with ID ${admissionId} not found`);
    }

    // Check if admission is already discharged
    if (admission.status !== AdmissionStatus.ADMITTED) {
      throw new BadRequestException(`Admission is already ${admission.status.toLowerCase()}`);
    }

    // Check if discharge already exists
    if (admission.discharge) {
      throw new ConflictException('Discharge process already initiated for this admission');
    }

    // Check if staff exists
    const staff = await this.staffRepository.findOne(dischargedById);
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${dischargedById} not found`);
    }

    // Create discharge record
    const discharge = this.dischargeRepository.create({
      admissionId,
      patientId: admission.patientId,
      dischargedById,
      dischargeType,
      status: DischargeStatus.INITIATED,
      dischargeDate: new Date(),
    });

    // Save discharge record
    const savedDischarge = await this.dischargeRepository.save(discharge);
    
    // Update admission status
    await this.admissionRepository.update(admissionId, {
      status: AdmissionStatus.DISCHARGED,
      dischargeDate: new Date(),
    });

    return savedDischarge;
  }

  async updateDischargeStatus(dischargeId: string, status: DischargeStatus, updatedById: string) {
    const discharge = await this.dischargeRepository.findOne(dischargeId, {
      relations: ['admission', 'patient', 'dischargedBy'],
    });

    if (!discharge) {
      throw new NotFoundException(`Discharge with ID ${dischargeId} not found`);
    }

    // Validate status transition
    const validTransitions = {
      [DischargeStatus.INITIATED]: [
        DischargeStatus.BILLING_PENDING, 
        DischargeStatus.CANCELLED
      ],
      [DischargeStatus.BILLING_PENDING]: [
        DischargeStatus.BILLING_COMPLETED, 
        DischargeStatus.CANCELLED
      ],
      [DischargeStatus.BILLING_COMPLETED]: [
        DischargeStatus.MEDICATION_PENDING,
        DischargeStatus.CANCELLED
      ],
      [DischargeStatus.MEDICATION_PENDING]: [
        DischargeStatus.DOCUMENTATION_PENDING,
        DischargeStatus.CANCELLED
      ],
      [DischargeStatus.DOCUMENTATION_PENDING]: [
        DischargeStatus.FINAL_REVIEW,
        DischargeStatus.CANCELLED
      ],
      [DischargeStatus.FINAL_REVIEW]: [
        DischargeStatus.COMPLETED,
        DischargeStatus.CANCELLED
      ],
    };
    
    const allowedTransitions = validTransitions[discharge.status] || [];
    
    if (discharge.status !== status && !allowedTransitions.includes(status)) {
      throw new BadRequestException(
        `Invalid status transition from ${discharge.status} to ${status}`
      );
    }

    // Update discharge status
    const previousStatus = discharge.status;
    discharge.status = status;
    
    // Update timestamps based on status
    const now = new Date();
    switch (status) {
      case DischargeStatus.BILLING_COMPLETED:
        discharge.billingCompletedAt = discharge.billingCompletedAt || now;
        break;
      case DischargeStatus.MEDICATION_PENDING:
        discharge.medicationIssuedAt = discharge.medicationIssuedAt || now;
        break;
      case DischargeStatus.DOCUMENTATION_PENDING:
        discharge.documentationCompletedAt = discharge.documentationCompletedAt || now;
        break;
      case DischargeStatus.FINAL_REVIEW:
        discharge.finalReviewAt = discharge.finalReviewAt || now;
        break;
      case DischargeStatus.COMPLETED:
        discharge.completedAt = discharge.completedAt || now;
        
        // Free up the bed if not already done
        if (discharge.admission?.bedId) {
          await this.bedRepository.update(discharge.admission.bedId, {
            status: 'AVAILABLE',
            updatedBy: updatedById,
          });
        }
        break;
      case DischargeStatus.CANCELLED:
        discharge.cancelledAt = discharge.cancelledAt || now;
        discharge.cancelledBy = updatedById;
        
        // Revert admission status if cancelled
        if (discharge.admission) {
          await this.admissionRepository.update(discharge.admission.id, {
            status: AdmissionStatus.ADMITTED,
            dischargeDate: null,
          });
        }
        break;
    }
    
    // Add to audit log
    discharge.auditLog = discharge.auditLog || [];
    discharge.auditLog.push({
      timestamp: now,
      action: `STATUS_CHANGED_${status}`,
      performedById: updatedById,
      performedBy: 'System', // This would be replaced with actual user name in a real implementation
      changes: {
        status: {
          from: previousStatus,
          to: status,
        },
      },
    });
    
    return this.dischargeRepository.save(discharge);
  }

  async updateDischargeSummary(dischargeId: string, summaryData: {
    diagnosisAtDischarge?: string;
    proceduresPerformed?: string;
    hospitalCourse?: string;
    conditionAtDischarge?: string;
    followUpPlan?: string;
    patientEducation?: string;
    dischargeMedications?: Array<{
      medicationId: string;
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string;
    }>;
    followUpAppointments?: Array<{
      date: Date;
      department: string;
      doctorId: string;
      notes: string;
    }>;
    billingNotes?: string;
  }, updatedById: string) {
    const discharge = await this.dischargeRepository.findOne(dischargeId);
    
    if (!discharge) {
      throw new NotFoundException(`Discharge with ID ${dischargeId} not found`);
    }
    
    // Track changes for audit log
    const changes: Record<string, any> = {};
    Object.keys(summaryData).forEach(key => {
      if (JSON.stringify(discharge[key]) !== JSON.stringify(summaryData[key])) {
        changes[key] = {
          from: discharge[key],
          to: summaryData[key],
        };
      }
    });
    
    // Update discharge summary
    Object.assign(discharge, summaryData);
    
    // Add to audit log if there are changes
    if (Object.keys(changes).length > 0) {
      discharge.auditLog = discharge.auditLog || [];
      discharge.auditLog.push({
        timestamp: new Date(),
        action: 'SUMMARY_UPDATED',
        performedById: updatedById,
        performedBy: 'System', // This would be replaced with actual user name in a real implementation
        changes,
      });
    }
    
    return this.dischargeRepository.save(discharge);
  }

  async getDischargeById(dischargeId: string) {
    const discharge = await this.dischargeRepository.findOne(dischargeId, {
      relations: [
        'patient', 
        'admission', 
        'admission.bed', 
        'admission.bed.ward',
        'dischargedBy',
        'cancelledBy',
      ],
    });
    
    if (!discharge) {
      throw new NotFoundException(`Discharge with ID ${dischargeId} not found`);
    }
    
    return discharge;
  }

  async getDischarges(filters: {
    patientId?: string;
    doctorId?: string;
    wardId?: string;
    status?: DischargeStatus | DischargeStatus[];
    dischargeType?: DischargeType | DischargeType[];
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  } = {}) {
    const {
      patientId,
      doctorId,
      wardId,
      status,
      dischargeType,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = filters;
    
    const skip = (page - 1) * limit;
    const query = this.dischargeRepository
      .createQueryBuilder('discharge')
      .leftJoinAndSelect('discharge.patient', 'patient')
      .leftJoinAndSelect('discharge.admission', 'admission')
      .leftJoinAndSelect('admission.bed', 'bed')
      .leftJoinAndSelect('bed.ward', 'ward')
      .leftJoinAndSelect('discharge.dischargedBy', 'dischargedBy');
    
    // Apply filters
    if (patientId) {
      query.andWhere('discharge.patientId = :patientId', { patientId });
    }
    
    if (doctorId) {
      query.andWhere('admission.admittingDoctorId = :doctorId', { doctorId });
    }
    
    if (wardId) {
      query.andWhere('bed.wardId = :wardId', { wardId });
    }
    
    if (status) {
      if (Array.isArray(status)) {
        query.andWhere('discharge.status IN (:...statuses)', { statuses: status });
      } else {
        query.andWhere('discharge.status = :status', { status });
      }
    }
    
    if (dischargeType) {
      if (Array.isArray(dischargeType)) {
        query.andWhere('discharge.dischargeType IN (:...types)', { types: dischargeType });
      } else {
        query.andWhere('discharge.dischargeType = :dischargeType', { dischargeType });
      }
    }
    
    if (startDate && endDate) {
      query.andWhere('discharge.dischargeDate BETWEEN :startDate AND :endDate', { startDate, endDate });
    } else if (startDate) {
      query.andWhere('discharge.dischargeDate >= :startDate', { startDate });
    } else if (endDate) {
      query.andWhere('discharge.dischargeDate <= :endDate', { endDate });
    }
    
    // Get total count
    const total = await query.getCount();
    
    // Apply pagination
    const data = await query
      .orderBy('discharge.dischargeDate', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();
    
    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getDischargeSummary(dischargeId: string) {
    const discharge = await this.dischargeRepository.findOne(dischargeId, {
      relations: [
        'patient', 
        'admission', 
        'admission.admittingDoctor',
        'admission.bed', 
        'admission.bed.ward',
        'dischargedBy',
      ],
    });
    
    if (!discharge) {
      throw new NotFoundException(`Discharge with ID ${dischargeId} not found`);
    }
    
    // In a real implementation, you would fetch additional data like:
    // - Diagnosis and procedures from clinical notes
    // - Medications from prescriptions
    // - Lab results and imaging reports
    // - Vitals and nursing notes
    // - Billing details
    
    return {
      patient: {
        id: discharge.patient.id,
        name: `${discharge.patient.firstName} ${discharge.patient.lastName}`,
        dateOfBirth: discharge.patient.dateOfBirth,
        gender: discharge.patient.gender,
        bloodGroup: discharge.patient.bloodGroup,
        address: discharge.patient.address,
        phone: discharge.patient.phone,
      },
      admission: {
        id: discharge.admission.id,
        admissionDate: discharge.admission.admissionDate,
        admissionDiagnosis: discharge.admission.diagnosis,
        admittingDoctor: discharge.admission.admittingDoctor 
          ? `${discharge.admission.admittingDoctor.firstName} ${discharge.admission.admittingDoctor.lastName}`
          : null,
        ward: discharge.admission.bed?.ward?.name,
        bed: discharge.admission.bed?.bedNumber,
      },
      discharge: {
        id: discharge.id,
        dischargeDate: discharge.dischargeDate,
        dischargeType: discharge.dischargeType,
        status: discharge.status,
        dischargedBy: discharge.dischargedBy 
          ? `${discharge.dischargedBy.firstName} ${discharge.dischargedBy.lastName}`
          : null,
        diagnosisAtDischarge: discharge.diagnosisAtDischarge,
        proceduresPerformed: discharge.proceduresPerformed,
        hospitalCourse: discharge.hospitalCourse,
        conditionAtDischarge: discharge.conditionAtDischarge,
        followUpPlan: discharge.followUpPlan,
        patientEducation: discharge.patientEducation,
        dischargeMedications: discharge.dischargeMedications,
        followUpAppointments: discharge.followUpAppointments,
      },
      // Additional data would be fetched and included here
    };
  }

  async getDischargeStatistics(startDate: Date, endDate: Date) {
    // Get total discharges in the date range
    const totalDischarges = await this.dischargeRepository.count({
      where: {
        dischargeDate: Between(startDate, endDate),
      },
    });
    
    // Get discharges by type
    const dischargesByType = await this.dischargeRepository
      .createQueryBuilder('discharge')
      .select('discharge.dischargeType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('discharge.dischargeDate BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('discharge.dischargeType')
      .getRawMany();
    
    // Get average length of stay (in days)
    const avgStayDuration = await this.dischargeRepository
      .createQueryBuilder('discharge')
      .select('AVG(DATEDIFF(discharge.dischargeDate, admission.admissionDate))', 'avgDays')
      .innerJoin('discharge.admission', 'admission')
      .where('discharge.dischargeDate BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();
    
    // Get readmission rate (within 30 days)
    const readmissionThreshold = new Date(endDate);
    readmissionThreshold.setDate(readmissionThreshold.getDate() - 30);
    
    const readmissions = await this.dischargeRepository
      .createQueryBuilder('d1')
      .select('COUNT(DISTINCT d1.patientId)', 'readmissionCount')
      .innerJoin('d1.admission', 'a1')
      .innerJoin(
        Admission,
        'a2',
        'a2.patientId = d1.patientId AND a2.admissionDate > d1.dischargeDate AND a2.admissionDate <= DATE_ADD(d1.dischargeDate, INTERVAL 30 DAY)'
      )
      .where('d1.dischargeDate BETWEEN :startDate AND :endDate', { 
        startDate: readmissionThreshold, 
        endDate 
      })
      .getRawOne();
    
    const readmissionRate = totalDischarges > 0 
      ? (parseInt(readmissions.readmissionCount, 10) / totalDischarges) * 100 
      : 0;
    
    return {
      totalDischarges,
      dischargesByType: dischargesByType.reduce((acc, { type, count }) => ({
        ...acc,
        [type]: parseInt(count, 10),
      }), {}),
      averageLengthOfStay: parseFloat(avgStayDuration.avgDays || 0).toFixed(2),
      readmissionRate: readmissionRate.toFixed(2),
      timePeriod: { startDate, endDate },
    };
  }
}
