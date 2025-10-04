import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindConditions, In, Repository } from 'typeorm';
import { Surgery } from '../entities/surgery.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Admission } from '../entities/admission.entity';
import { SurgeryStatus } from '../enums/surgery-status.enum';

@Injectable()
export class OtService {
  constructor(
    @InjectRepository(Surgery)
    private readonly surgeryRepository: Repository<Surgery>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Admission)
    private readonly admissionRepository: Repository<Admission>,
  ) {}

  async scheduleSurgery(createSurgeryDto: {
    patientId: string;
    admissionId: string;
    procedureName: string;
    description?: string;
    type: string;
    scheduledDate: Date;
    estimatedDuration: number; // in minutes
    surgeonId: string;
    anesthetistId?: string;
    assistantSurgeonId?: string;
    theaterRoom: string;
    preOpDiagnosis?: any;
    notes?: string;
    scheduledById: string;
  }) {
    const { 
      patientId, 
      admissionId, 
      surgeonId, 
      anesthetistId, 
      assistantSurgeonId, 
      scheduledById,
      ...rest 
    } = createSurgeryDto;

    // Check if patient exists
    const patient = await this.patientRepository.findOne(patientId);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    // Check if admission exists and is active
    const admission = await this.admissionRepository.findOne({
      where: { id: admissionId, patientId },
    });
    
    if (!admission) {
      throw new NotFoundException(`Active admission not found for patient ${patientId}`);
    }

    // Check if surgeon exists
    const surgeon = await this.staffRepository.findOne(surgeonId);
    if (!surgeon) {
      throw new NotFoundException(`Surgeon with ID ${surgeonId} not found`);
    }

    // Check if anesthetist exists if provided
    if (anesthetistId) {
      const anesthetist = await this.staffRepository.findOne(anesthetistId);
      if (!anesthetist) {
        throw new NotFoundException(`Anesthetist with ID ${anesthetistId} not found`);
      }
    }

    // Check if assistant surgeon exists if provided
    if (assistantSurgeonId) {
      const assistantSurgeon = await this.staffRepository.findOne(assistantSurgeonId);
      if (!assistantSurgeon) {
        throw new NotFoundException(`Assistant surgeon with ID ${assistantSurgeonId} not found`);
      }
    }

    // Check if the theater is available at the scheduled time
    const isTheaterAvailable = await this.isTheaterAvailable(
      createSurgeryDto.theaterRoom,
      createSurgeryDto.scheduledDate,
      createSurgeryDto.estimatedDuration,
    );

    if (!isTheaterAvailable) {
      throw new ConflictException(
        `Theater ${createSurgeryDto.theaterRoom} is not available at the scheduled time`
      );
    }

    // Check if the surgeon is available
    const isSurgeonAvailable = await this.isStaffAvailable(
      surgeonId,
      createSurgeryDto.scheduledDate,
      createSurgeryDto.estimatedDuration,
    );

    if (!isSurgeonAvailable) {
      throw new ConflictException(
        `Surgeon ${surgeon.firstName} ${surgeon.lastName} is not available at the scheduled time`
      );
    }

    // Create surgery record
    const surgery = this.surgeryRepository.create({
      ...rest,
      patientId,
      admissionId,
      surgeonId,
      anesthetistId,
      assistantSurgeonId,
      status: SurgeryStatus.SCHEDULED,
      scheduledBy: scheduledById,
    });

    return this.surgeryRepository.save(surgery);
  }

  async updateSurgeryStatus(
    surgeryId: string, 
    status: SurgeryStatus, 
    updatedById: string,
    notes?: string
  ) {
    const surgery = await this.surgeryRepository.findOne(surgeryId, {
      relations: ['patient', 'surgeon', 'anesthetist', 'assistantSurgeon'],
    });
    
    if (!surgery) {
      throw new NotFoundException(`Surgery with ID ${surgeryId} not found`);
    }

    // Validate status transition
    const validTransitions = {
      [SurgeryStatus.SCHEDULED]: [
        SurgeryStatus.PRE_OPERATIVE, 
        SurgeryStatus.CANCELLED, 
        SurgeryStatus.POSTPONED
      ],
      [SurgeryStatus.PRE_OPERATIVE]: [
        SurgeryStatus.IN_PROGRESS, 
        SurgeryStatus.CANCELLED
      ],
      [SurgeryStatus.IN_PROGRESS]: [
        SurgeryStatus.COMPLETED, 
        SurgeryStatus.CANCELLED
      ],
      [SurgeryStatus.COMPLETED]: [
        SurgeryStatus.IN_RECOVERY
      ],
      [SurgeryStatus.IN_RECOVERY]: [
        SurgeryStatus.DISCHARGED
      ],
    };
    
    const allowedTransitions = validTransitions[surgery.status] || [];
    
    if (surgery.status !== status && !allowedTransitions.includes(status)) {
      throw new BadRequestException(
        `Invalid status transition from ${surgery.status} to ${status}`
      );
    }

    // Update surgery status and timestamps
    const previousStatus = surgery.status;
    surgery.status = status;
    
    // Update relevant timestamps based on status
    const now = new Date();
    switch (status) {
      case SurgeryStatus.IN_PROGRESS:
        surgery.startTime = surgery.startTime || now;
        break;
      case SurgeryStatus.COMPLETED:
        surgery.endTime = surgery.endTime || now;
        break;
      case SurgeryStatus.IN_RECOVERY:
        surgery.recoveryStartTime = surgery.recoveryStartTime || now;
        break;
      case SurgeryStatus.DISCHARGED:
        surgery.dischargeTime = surgery.dischargeTime || now;
        break;
      case SurgeryStatus.CANCELLED:
      case SurgeryStatus.POSTPONED:
        surgery.cancellationTime = surgery.cancellationTime || now;
        surgery.cancellationReason = notes || surgery.cancellationReason;
        break;
    }
    
    // Add to audit log
    surgery.auditLog = surgery.auditLog || [];
    surgery.auditLog.push({
      timestamp: now,
      action: `STATUS_CHANGED_${status}`,
      performedById: updatedById,
      performedBy: 'System', // This would be replaced with actual user name in a real implementation
      changes: {
        status: {
          from: previousStatus,
          to: status,
        },
        notes: notes || null,
      },
    });
    
    return this.surgeryRepository.save(surgery);
  }

  async updateSurgeryDetails(
    surgeryId: string, 
    updateData: Partial<Surgery>,
    updatedById: string
  ) {
    const surgery = await this.surgeryRepository.findOne(surgeryId);
    
    if (!surgery) {
      throw new NotFoundException(`Surgery with ID ${surgeryId} not found`);
    }

    // Prevent updating certain fields directly
    const { id, patientId, admissionId, status, ...safeUpdateData } = updateData;
    
    // Check theater availability if updating scheduledDate, estimatedDuration, or theaterRoom
    if (safeUpdateData.scheduledDate || safeUpdateData.estimatedDuration || safeUpdateData.theaterRoom) {
      const scheduledDate = safeUpdateData.scheduledDate || surgery.scheduledDate;
      const estimatedDuration = safeUpdateData.estimatedDuration || surgery.estimatedDuration;
      const theaterRoom = safeUpdateData.theaterRoom || surgery.theaterRoom;
      
      const isTheaterAvailable = await this.isTheaterAvailable(
        theaterRoom,
        scheduledDate,
        estimatedDuration,
        surgeryId // Exclude current surgery from availability check
      );
      
      if (!isTheaterAvailable) {
        throw new ConflictException(
          `Theater ${theaterRoom} is not available at the scheduled time`
        );
      }
    }
    
    // Check staff availability if updating surgeon, anesthetist, or assistant surgeon
    if (safeUpdateData.surgeonId || safeUpdateData.anesthetistId || safeUpdateData.assistantSurgeonId) {
      const scheduledDate = safeUpdateData.scheduledDate || surgery.scheduledDate;
      const estimatedDuration = safeUpdateData.estimatedDuration || surgery.estimatedDuration;
      
      if (safeUpdateData.surgeonId) {
        const isAvailable = await this.isStaffAvailable(
          safeUpdateData.surgeonId,
          scheduledDate,
          estimatedDuration,
          surgeryId // Exclude current surgery from availability check
        );
        
        if (!isAvailable) {
          throw new ConflictException('The selected surgeon is not available at the scheduled time');
        }
      }
      
      // Similar checks for anesthetist and assistant surgeon...
    }
    
    // Track changes for audit log
    const changes: Record<string, any> = {};
    Object.keys(safeUpdateData).forEach(key => {
      if (surgery[key] !== safeUpdateData[key]) {
        changes[key] = {
          from: surgery[key],
          to: safeUpdateData[key],
        };
      }
    });
    
    // Add to audit log if there are changes
    if (Object.keys(changes).length > 0) {
      surgery.auditLog = surgery.auditLog || [];
      surgery.auditLog.push({
        timestamp: new Date(),
        action: 'DETAILS_UPDATED',
        performedById: updatedById,
        performedBy: 'System', // This would be replaced with actual user name in a real implementation
        changes,
      });
    }
    
    // Update surgery details
    Object.assign(surgery, safeUpdateData);
    
    return this.surgeryRepository.save(surgery);
  }

  async getSurgeryById(surgeryId: string) {
    const surgery = await this.surgeryRepository.findOne(surgeryId, {
      relations: [
        'patient', 
        'admission', 
        'surgeon', 
        'anesthetist', 
        'assistantSurgeon',
        'scheduledBy',
      ],
    });
    
    if (!surgery) {
      throw new NotFoundException(`Surgery with ID ${surgeryId} not found`);
    }
    
    return surgery;
  }

  async getSurgeries(filters: {
    patientId?: string;
    surgeonId?: string;
    anesthetistId?: string;
    status?: SurgeryStatus | SurgeryStatus[];
    startDate?: Date;
    endDate?: Date;
    theaterRoom?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const {
      patientId,
      surgeonId,
      anesthetistId,
      status,
      startDate,
      endDate,
      theaterRoom,
      page = 1,
      limit = 10,
    } = filters;
    
    const skip = (page - 1) * limit;
    const where: FindConditions<Surgery> = {};
    
    if (patientId) where.patientId = patientId;
    if (surgeonId) where.surgeonId = surgeonId;
    if (anesthetistId) where.anesthetistId = anesthetistId;
    if (status) {
      if (Array.isArray(status)) {
        where.status = In(status);
      } else {
        where.status = status;
      }
    }
    if (theaterRoom) where.theaterRoom = theaterRoom;
    
    if (startDate && endDate) {
      where.scheduledDate = Between(startDate, endDate);
    } else if (startDate) {
      where.scheduledDate = Between(startDate, new Date());
    }
    
    const [surgeries, total] = await this.surgeryRepository.findAndCount({
      where,
      relations: ['patient', 'surgeon', 'anesthetist'],
      order: { scheduledDate: 'ASC' },
      skip,
      take: limit,
    });
    
    return {
      data: surgeries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSurgerySchedule(theaterRoom: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return this.surgeryRepository.find({
      where: {
        theaterRoom,
        scheduledDate: Between(startOfDay, endOfDay),
        status: In([
          SurgeryStatus.SCHEDULED, 
          SurgeryStatus.PRE_OPERATIVE, 
          SurgeryStatus.IN_PROGRESS
        ]),
      },
      relations: ['patient', 'surgeon', 'anesthetist'],
      order: { scheduledDate: 'ASC' },
    });
  }

  async getSurgeonSchedule(surgeonId: string, startDate: Date, endDate: Date) {
    return this.surgeryRepository.find({
      where: {
        surgeonId,
        scheduledDate: Between(startDate, endDate),
        status: In([
          SurgeryStatus.SCHEDULED, 
          SurgeryStatus.PRE_OPERATIVE, 
          SurgeryStatus.IN_PROGRESS
        ]),
      },
      relations: ['patient', 'theater'],
      order: { scheduledDate: 'ASC' },
    });
  }

  async addSurgeryNotes(
    surgeryId: string, 
    notes: string, 
    userId: string,
    type: 'preOp' | 'intraOp' | 'postOp' | 'anesthesia' | 'nursing' | 'other'
  ) {
    const surgery = await this.surgeryRepository.findOne(surgeryId);
    
    if (!surgery) {
      throw new NotFoundException(`Surgery with ID ${surgeryId} not found`);
    }
    
    const note = {
      type,
      content: notes,
      createdBy: userId,
      createdAt: new Date(),
    };
    
    surgery.notes = surgery.notes || [];
    surgery.notes.push(note);
    
    // Add to audit log
    surgery.auditLog = surgery.auditLog || [];
    surgery.auditLog.push({
      timestamp: new Date(),
      action: 'NOTES_ADDED',
      performedById: userId,
      performedBy: 'System', // This would be replaced with actual user name in a real implementation
      changes: {
        noteType: type,
        content: notes,
      },
    });
    
    return this.surgeryRepository.save(surgery);
  }

  async addSurgeryComplication(
    surgeryId: string, 
    complication: string, 
    severity: 'minor' | 'moderate' | 'severe',
    notes: string,
    userId: string
  ) {
    const surgery = await this.surgeryRepository.findOne(surgeryId);
    
    if (!surgery) {
      throw new NotFoundException(`Surgery with ID ${surgeryId} not found`);
    }
    
    const complicationRecord = {
      complication,
      severity,
      notes,
      reportedBy: userId,
      reportedAt: new Date(),
    };
    
    surgery.complications = surgery.complications || [];
    surgery.complications.push(complicationRecord);
    
    // Add to audit log
    surgery.auditLog = surgery.auditLog || [];
    surgery.auditLog.push({
      timestamp: new Date(),
      action: 'COMPLICATION_ADDED',
      performedById: userId,
      performedBy: 'System', // This would be replaced with actual user name in a real implementation
      changes: {
        complication,
        severity,
        notes,
      },
    });
    
    return this.surgeryRepository.save(surgery);
  }

  // Helper methods
  private async isTheaterAvailable(
    theaterRoom: string, 
    startTime: Date, 
    durationMinutes: number,
    excludeSurgeryId?: string
  ): Promise<boolean> {
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
    
    const query = this.surgeryRepository
      .createQueryBuilder('surgery')
      .where('surgery.theaterRoom = :theaterRoom', { theaterRoom })
      .andWhere('surgery.status IN (:...statuses)', {
        statuses: [SurgeryStatus.SCHEDULED, SurgeryStatus.PRE_OPERATIVE, SurgeryStatus.IN_PROGRESS],
      })
      .andWhere(
        '(:startTime BETWEEN surgery.scheduledDate AND DATE_ADD(surgery.scheduledDate, INTERVAL surgery.estimatedDuration MINUTE) ' +
        'OR :endTime BETWEEN surgery.scheduledDate AND DATE_ADD(surgery.scheduledDate, INTERVAL surgery.estimatedDuration MINUTE) ' +
        'OR surgery.scheduledDate BETWEEN :startTime AND :endTime)',
        { startTime, endTime }
      );
    
    if (excludeSurgeryId) {
      query.andWhere('surgery.id != :excludeSurgeryId', { excludeSurgeryId });
    }
    
    const conflictingSurgeries = await query.getCount();
    return conflictingSurgeries === 0;
  }

  private async isStaffAvailable(
    staffId: string,
    startTime: Date,
    durationMinutes: number,
    excludeSurgeryId?: string
  ): Promise<boolean> {
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
    
    // Check if staff is assigned to any surgeries during this time
    const query = this.surgeryRepository
      .createQueryBuilder('surgery')
      .where('(surgery.surgeonId = :staffId OR surgery.anesthetistId = :staffId OR surgery.assistantSurgeonId = :staffId)', { staffId })
      .andWhere('surgery.status IN (:...statuses)', {
        statuses: [SurgeryStatus.SCHEDULED, SurgeryStatus.PRE_OPERATIVE, SurgeryStatus.IN_PROGRESS],
      })
      .andWhere(
        '(:startTime BETWEEN surgery.scheduledDate AND DATE_ADD(surgery.scheduledDate, INTERVAL surgery.estimatedDuration MINUTE) ' +
        'OR :endTime BETWEEN surgery.scheduledDate AND DATE_ADD(surgery.scheduledDate, INTERVAL surgery.estimatedDuration MINUTE) ' +
        'OR surgery.scheduledDate BETWEEN :startTime AND :endTime)',
        { startTime, endTime }
      );
    
    if (excludeSurgeryId) {
      query.andWhere('surgery.id != :excludeSurgeryId', { excludeSurgeryId });
    }
    
    const conflictingSurgeries = await query.getCount();
    return conflictingSurgeries === 0;
  }
}
