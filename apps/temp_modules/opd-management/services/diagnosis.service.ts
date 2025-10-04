import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diagnosis, DiagnosisStatus, DiagnosisType } from '../entities/diagnosis.entity';
import { Icd10Code } from '../entities/icd10-code.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { Staff } from '../../staff-management/entities/staff.entity';
import { Encounter } from '../entities/encounter.entity';
import { CreatePatientDiagnosisDto, CreateEncounterDiagnosisDto, UpdateDiagnosisDto, ResolveDiagnosisDto, ReactivateDiagnosisDto } from '../dto/diagnosis';
import { DiagnosisRepository } from '../repositories/diagnosis.repository';
import { Icd10Service } from './icd10.service';
import { PatientService } from '../../patient/patient.service';
import { StaffService } from '../../staff-management/services/staff.service';
import { EncounterService } from './encounter.service';

@Injectable()
export class DiagnosisService {
  constructor(
    @InjectRepository(Diagnosis)
    private readonly diagnosisRepository: DiagnosisRepository,
    private readonly icd10Service: Icd10Service,
    private readonly patientService: PatientService,
    private readonly staffService: StaffService,
    private readonly encounterService: EncounterService,
  ) {}

  async createPatientDiagnosis(
    createDiagnosisDto: CreatePatientDiagnosisDto,
    recordedById: string,
  ): Promise<Diagnosis> {
    // Validate patient exists
    await this.patientService.getPatientById(createDiagnosisDto.patientId);
    
    // Validate ICD-10 code
    await this.icd10Service.findByCode(createDiagnosisDto.icd10Code);
    
    // Validate encounter if provided
    if (createDiagnosisDto.encounterId) {
      await this.encounterService.getEncounterById(createDiagnosisDto.encounterId);
    }

    // Only one primary diagnosis per encounter
    if (createDiagnosisDto.isPrimary && createDiagnosisDto.encounterId) {
      await this.clearPrimaryDiagnosis(createDiagnosisDto.encounterId);
    }

    const diagnosis = this.diagnosisRepository.create({
      ...createDiagnosisDto,
      recordedById,
      status: createDiagnosisDto.status || DiagnosisStatus.ACTIVE,
    });

    return this.diagnosisRepository.save(diagnosis);
  }

  async createEncounterDiagnosis(
    createDiagnosisDto: CreateEncounterDiagnosisDto,
    recordedById: string,
  ): Promise<Diagnosis> {
    // Get encounter to validate and get patient ID
    const encounter = await this.encounterService.getEncounterById(createDiagnosisDto.encounterId);
    
    return this.createPatientDiagnosis(
      {
        ...createDiagnosisDto,
        patientId: encounter.patientId,
      },
      recordedById,
    );
  }

  async updateDiagnosis(
    id: string,
    updateDiagnosisDto: UpdateDiagnosisDto,
    updatedById: string,
  ): Promise<Diagnosis> {
    const diagnosis = await this.getDiagnosisById(id);
    
    // If changing ICD-10 code, validate it
    if (updateDiagnosisDto.icd10Code && updateDiagnosisDto.icd10Code !== diagnosis.icd10Code) {
      await this.icd10Service.findByCode(updateDiagnosisDto.icd10Code);
    }

    // Handle status changes
    if (updateDiagnosisDto.status === DiagnosisStatus.RESOLVED && diagnosis.status !== DiagnosisStatus.RESOLVED) {
      updateDiagnosisDto.resolvedDate = new Date();
    } else if (updateDiagnosisDto.status === DiagnosisStatus.ACTIVE && diagnosis.status === DiagnosisStatus.RESOLVED) {
      updateDiagnosisDto.resolvedDate = null;
    }

    // Only one primary diagnosis per encounter
    if (updateDiagnosisDto.isPrimary && diagnosis.encounterId) {
      await this.clearPrimaryDiagnosis(diagnosis.encounterId, id);
    }

    await this.diagnosisRepository.update(id, {
      ...updateDiagnosisDto,
      updatedById,
    });

    return this.getDiagnosisById(id);
  }

  async resolveDiagnosis(
    id: string,
    resolveDto: ResolveDiagnosisDto,
    resolvedById: string,
  ): Promise<Diagnosis> {
    const diagnosis = await this.getDiagnosisById(id);
    
    if (diagnosis.status === DiagnosisStatus.RESOLVED) {
      throw new ConflictException('Diagnosis is already resolved');
    }

    return this.updateDiagnosis(
      id,
      {
        status: DiagnosisStatus.RESOLVED,
        resolvedDate: resolveDto.resolvedDate ? new Date(resolveDto.resolvedDate) : new Date(),
        notes: resolveDto.notes || diagnosis.notes,
      },
      resolvedById,
    );
  }

  async reactivateDiagnosis(
    id: string,
    reactivateDto: ReactivateDiagnosisDto,
    reactivatedById: string,
  ): Promise<Diagnosis> {
    const diagnosis = await this.getDiagnosisById(id);
    
    if (diagnosis.status !== DiagnosisStatus.RESOLVED && diagnosis.status !== DiagnosisStatus.RULED_OUT) {
      throw new BadRequestException('Only resolved or ruled out diagnoses can be reactivated');
    }

    return this.updateDiagnosis(
      id,
      {
        status: DiagnosisStatus.RECURRED,
        resolvedDate: null,
        notes: reactivateDto.notes || diagnosis.notes,
      },
      reactivatedById,
    );
  }

  async getDiagnosisById(id: string): Promise<Diagnosis> {
    const diagnosis = await this.diagnosisRepository.findOne(id, {
      relations: ['icd10', 'recordedBy', 'patient', 'encounter', 'updatedBy'],
    });
    
    if (!diagnosis) {
      throw new NotFoundException(`Diagnosis with ID ${id} not found`);
    }
    
    return diagnosis;
  }

  async getPatientDiagnoses(
    patientId: string,
    filters: {
      status?: DiagnosisStatus | DiagnosisStatus[];
      type?: DiagnosisType;
      isPrimary?: boolean;
      fromDate?: Date;
      toDate?: Date;
      searchTerm?: string;
    } = {},
    pagination = { page: 1, limit: 20 },
  ) {
    // Validate patient exists
    await this.patientService.getPatientById(patientId);
    
    return this.diagnosisRepository.findPatientDiagnoses(patientId, pagination, filters);
  }

  async getEncounterDiagnoses(encounterId: string): Promise<Diagnosis[]> {
    // Validate encounter exists
    await this.encounterService.getEncounterById(encounterId);
    
    return this.diagnosisRepository.findEncounterDiagnoses(encounterId);
  }

  async getActiveDiagnoses(patientId: string): Promise<Diagnosis[]> {
    // Validate patient exists
    await this.patientService.getPatientById(patientId);
    
    return this.diagnosisRepository.findActiveDiagnoses(patientId);
  }

  async getChronicConditions(patientId: string): Promise<Diagnosis[]> {
    // Validate patient exists
    await this.patientService.getPatientById(patientId);
    
    return this.diagnosisRepository.findChronicConditions(patientId);
  }

  async getDiagnosisStats(patientId: string) {
    // Validate patient exists
    await this.patientService.getPatientById(patientId);
    
    return this.diagnosisRepository.getDiagnosisStats(patientId);
  }

  async getDiagnosisTimeline(patientId: string) {
    // Validate patient exists
    await this.patientService.getPatientById(patientId);
    
    return this.diagnosisRepository.getDiagnosisTimeline(patientId);
  }

  private async clearPrimaryDiagnosis(encounterId: string, excludeId?: string): Promise<void> {
    const updateCondition: any = { 
      encounterId, 
      isPrimary: true 
    };
    
    if (excludeId) {
      updateCondition.id = Not(excludeId);
    }
    
    await this.diagnosisRepository.update(updateCondition, { isPrimary: false });
  }

  async getCommonDiagnoses(limit = 10) {
    return this.diagnosisRepository.getCommonDiagnoses(limit);
  }

  async deleteDiagnosis(id: string): Promise<void> {
    const result = await this.diagnosisRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Diagnosis with ID ${id} not found`);
    }
  }
}
