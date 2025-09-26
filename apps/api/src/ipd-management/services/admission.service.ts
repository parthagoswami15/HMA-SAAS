import { Injectable, NotFoundException, BadRequestException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, FindManyOptions, Between, Like, Not, In } from 'typeorm';
import { Admission } from '../entities/admission.entity';
import { CreateAdmissionDto } from '../dto/admission/create-admission.dto';
import { UpdateAdmissionDto } from '../dto/admission/update-admission.dto';
import { AdmissionFilterDto } from '../dto/admission/admission-filter.dto';
import { AdmissionResponseDto } from '../dto/admission/admission-response.dto';
import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Bed } from '../entities/bed.entity';
import { AdmissionStatus } from '../enums/admission-status.enum';
import { BedStatus } from '../enums/bed-status.enum';
import { AdmissionType } from '../enums/admission-type.enum';
import { BedService } from './bed.service';
import { generateAdmissionNumber } from '../../common/utils/number-generator';

@Injectable()
export class AdmissionService {
  constructor(
    @InjectRepository(Admission)
    private readonly admissionRepository: Repository<Admission>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Bed)
    private readonly bedRepository: Repository<Bed>,
    @Inject(forwardRef(() => BedService))
    private readonly bedService: BedService,
  ) {}

  async create(createAdmissionDto: CreateAdmissionDto, userId: string): Promise<AdmissionResponseDto> {
    // Check if patient exists
    const patient = await this.patientRepository.findOne(createAdmissionDto.patientId);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${createAdmissionDto.patientId} not found`);
    }

    // Check if doctor exists
    const doctor = await this.staffRepository.findOne(createAdmissionDto.admittingDoctorId);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${createAdmissionDto.admittingDoctorId} not found`);
    }

    // Check if bed exists and is available
    const bed = await this.bedRepository.findOne({
      where: { id: createAdmissionDto.bedId },
      relations: ['ward'],
    });

    if (!bed) {
      throw new NotFoundException(`Bed with ID ${createAdmissionDto.bedId} not found`);
    }

    if (bed.status !== BedStatus.AVAILABLE) {
      throw new ConflictException(`Bed ${bed.bedNumber} is not available for admission`);
    }

    // Check if patient already has an active admission
    const existingAdmission = await this.admissionRepository.findOne({
      where: {
        patientId: createAdmissionDto.patientId,
        status: Not(In([AdmissionStatus.DISCHARGED, AdmissionStatus.LAMA, AdmissionStatus.DAMA, AdmissionStatus.ABSCONDED, AdmissionStatus.DECEASED])),
      },
    });

    if (existingAdmission) {
      throw new ConflictException(`Patient already has an active admission (${existingAdmission.admissionNumber})`);
    }

    // Create new admission
    const admission = this.admissionRepository.create({
      ...createAdmissionDto,
      admissionNumber: generateAdmissionNumber(),
      patient,
      admittingDoctor: doctor,
      bed,
      status: AdmissionStatus.ADMITTED,
      createdBy: userId,
      updatedBy: userId,
    });

    // Update bed status to OCCUPIED
    await this.bedService.updateBedStatus(bed.id, BedStatus.OCCUPIED, userId);

    const savedAdmission = await this.admissionRepository.save(admission);
    return new AdmissionResponseDto(savedAdmission);
  }

  async findAll(filterDto: AdmissionFilterDto): Promise<{ data: AdmissionResponseDto[], total: number }> {
    const {
      patientId,
      doctorId,
      wardId,
      bedId,
      admissionType,
      status,
      admissionDateFrom,
      admissionDateTo,
      dischargeDateFrom,
      dischargeDateTo,
      activeOnly,
      searchTerm,
      page = 1,
      limit = 10,
      sortBy = 'admissionDate',
      sortOrder = 'DESC',
    } = filterDto;

    const skip = (page - 1) * limit;
    const where: FindConditions<Admission> = {};
    const relations = ['patient', 'admittingDoctor', 'bed', 'bed.ward'];

    // Apply filters
    if (patientId) where.patientId = patientId;
    if (doctorId) where.admittingDoctorId = doctorId;
    if (bedId) where.bedId = bedId;
    if (admissionType) where.admissionType = admissionType;
    if (status) where.status = status;
    if (activeOnly) where.status = Not(In([AdmissionStatus.DISCHARGED, AdmissionStatus.LAMA, AdmissionStatus.DAMA, AdmissionStatus.ABSCONDED, AdmissionStatus.DECEASED]));

    // Date range filters
    if (admissionDateFrom && admissionDateTo) {
      where.admissionDate = Between(new Date(admissionDateFrom), new Date(admissionDateTo));
    } else if (admissionDateFrom) {
      where.admissionDate = Between(new Date(admissionDateFrom), new Date());
    }

    if (dischargeDateFrom && dischargeDateTo) {
      where.dischargeDate = Between(new Date(dischargeDateFrom), new Date(dischargeDateTo));
    } else if (dischargeDateFrom) {
      where.dischargeDate = Between(new Date(dischargeDateFrom), new Date());
    }

    // Search term
    if (searchTerm) {
      where.admissionNumber = Like(`%${searchTerm}%`);
    }

    // Ward filter (through bed relation)
    if (wardId) {
      where.bed = { wardId } as any;
    }

    // Build query
    const [admissions, total] = await this.admissionRepository.findAndCount({
      where,
      relations,
      order: { [sortBy]: sortOrder },
      skip,
      take: limit,
    });

    return {
      data: admissions.map(admission => new AdmissionResponseDto(admission)),
      total,
    };
  }

  async findOne(id: string): Promise<AdmissionResponseDto> {
    const admission = await this.admissionRepository.findOne({
      where: { id },
      relations: ['patient', 'admittingDoctor', 'bed', 'bed.ward', 'documents'],
    });

    if (!admission) {
      throw new NotFoundException(`Admission with ID ${id} not found`);
    }

    return new AdmissionResponseDto(admission);
  }

  async update(id: string, updateAdmissionDto: UpdateAdmissionDto, userId: string): Promise<AdmissionResponseDto> {
    const admission = await this.admissionRepository.findOne({
      where: { id },
      relations: ['patient', 'admittingDoctor', 'bed'],
    });

    if (!admission) {
      throw new NotFoundException(`Admission with ID ${id} not found`);
    }

    // Handle bed transfer if bedId is being updated
    if (updateAdmissionDto.bedId && updateAdmissionDto.bedId !== admission.bedId) {
      const newBed = await this.bedRepository.findOne(updateAdmissionDto.bedId);
      
      if (!newBed) {
        throw new NotFoundException(`New bed with ID ${updateAdmissionDto.bedId} not found`);
      }

      if (newBed.status !== BedStatus.AVAILABLE) {
        throw new ConflictException(`Bed ${newBed.bedNumber} is not available`);
      }

      // Update old bed status to AVAILABLE
      await this.bedService.updateBedStatus(admission.bedId, BedStatus.AVAILABLE, userId);
      
      // Update new bed status to OCCUPIED
      await this.bedService.updateBedStatus(newBed.id, BedStatus.OCCUPIED, userId);
      
      admission.bed = newBed;
      admission.bedId = newBed.id;
    }

    // Handle status changes (e.g., discharge)
    if (updateAdmissionDto.status) {
      // Add validation for status transitions if needed
      admission.status = updateAdmissionDto.status;
      
      // If discharging, set discharge date
      if (updateAdmissionDto.status === AdmissionStatus.DISCHARGED && !admission.dischargeDate) {
        admission.dischargeDate = updateAdmissionDto.dischargeDate || new Date();
        
        // Free up the bed
        await this.bedService.updateBedStatus(admission.bedId, BedStatus.AVAILABLE, userId);
      }
    }

    // Update other fields
    Object.assign(admission, {
      ...updateAdmissionDto,
      updatedBy: userId,
      updatedAt: new Date(),
    });

    const updatedAdmission = await this.admissionRepository.save(admission);
    return new AdmissionResponseDto(updatedAdmission);
  }

  async remove(id: string, userId: string): Promise<void> {
    const admission = await this.admissionRepository.findOne(id, {
      relations: ['bed'],
    });

    if (!admission) {
      throw new NotFoundException(`Admission with ID ${id} not found`);
    }

    // Only allow deletion of admissions that are not active
    if (![AdmissionStatus.DISCHARGED, AdmissionStatus.LAMA, AdmissionStatus.DAMA, AdmissionStatus.ABSCONDED, AdmissionStatus.DECEASED].includes(admission.status as any)) {
      throw new BadRequestException('Cannot delete an active admission. Please discharge the patient first.');
    }

    // Update bed status to AVAILABLE if it was OCCUPIED
    if (admission.bed && admission.bed.status === BedStatus.OCCUPIED) {
      await this.bedService.updateBedStatus(admission.bedId, BedStatus.AVAILABLE, userId);
    }

    // Soft delete the admission
    await this.admissionRepository.softDelete(id);
  }

  async getActiveAdmissionByPatientId(patientId: string): Promise<AdmissionResponseDto | null> {
    const admission = await this.admissionRepository.findOne({
      where: {
        patientId,
        status: Not(In([AdmissionStatus.DISCHARGED, AdmissionStatus.LAMA, AdmissionStatus.DAMA, AdmissionStatus.ABSCONDED, AdmissionStatus.DECEASED])),
      },
      relations: ['patient', 'admittingDoctor', 'bed', 'bed.ward'],
    });

    return admission ? new AdmissionResponseDto(admission) : null;
  }

  async getAdmissionStatistics() {
    const totalAdmissions = await this.admissionRepository.count();
    const activeAdmissions = await this.admissionRepository.count({
      where: {
        status: Not(In([AdmissionStatus.DISCHARGED, AdmissionStatus.LAMA, AdmissionStatus.DAMA, AdmissionStatus.ABSCONDED, AdmissionStatus.DECEASED])),
      },
    });

    const admissionsByType = await this.admissionRepository
      .createQueryBuilder('admission')
      .select('admission.admissionType', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('admission.admissionType')
      .getRawMany();

    return {
      totalAdmissions,
      activeAdmissions,
      admissionsByType: admissionsByType.reduce((acc, { type, count }) => ({
        ...acc,
        [type]: parseInt(count, 10),
      }), {}),
    };
  }
}
