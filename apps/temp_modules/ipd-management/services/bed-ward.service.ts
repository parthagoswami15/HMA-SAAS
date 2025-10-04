import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindConditions, Between, Like } from 'typeorm';
import { Bed } from '../entities/bed.entity';
import { Ward } from '../entities/ward.entity';
import { BedStatus } from '../enums/bed-status.enum';
import { BedClass } from '../enums/bed-class.enum';
import { Admission } from '../entities/admission.entity';

@Injectable()
export class BedWardService {
  constructor(
    @InjectRepository(Bed)
    private readonly bedRepository: Repository<Bed>,
    @InjectRepository(Ward)
    private readonly wardRepository: Repository<Ward>,
    @InjectRepository(Admission)
    private readonly admissionRepository: Repository<Admission>,
  ) {}

  // Ward Management
  async createWard(createWardDto: any) {
    const { code, name } = createWardDto;
    
    // Check if ward with same code or name already exists
    const existingWard = await this.wardRepository.findOne({
      where: [{ code }, { name }],
    });

    if (existingWard) {
      if (existingWard.code === code) {
        throw new ConflictException(`Ward with code '${code}' already exists`);
      }
      if (existingWard.name === name) {
        throw new ConflictException(`Ward with name '${name}' already exists`);
      }
    }

    const ward = this.wardRepository.create(createWardDto);
    return this.wardRepository.save(ward);
  }

  async findAllWards(filterDto: any = {}) {
    const { search, status, floor, type, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;
    
    const where: FindConditions<Ward> = {};
    
    if (search) {
      where.name = Like(`%${search}%`);
    }
    
    if (status) {
      where.status = status;
    }
    
    if (floor) {
      where.floor = floor;
    }
    
    if (type) {
      where.type = type;
    }

    const [wards, total] = await this.wardRepository.findAndCount({
      where,
      relations: ['beds'],
      skip,
      take: limit,
    });

    return {
      data: wards,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findWardById(id: string) {
    const ward = await this.wardRepository.findOne({
      where: { id },
      relations: ['beds', 'beds.currentAdmission', 'beds.currentAdmission.patient'],
    });

    if (!ward) {
      throw new NotFoundException(`Ward with ID ${id} not found`);
    }

    return ward;
  }

  async updateWard(id: string, updateWardDto: any) {
    const ward = await this.findWardById(id);
    
    // Check for duplicate code or name
    if (updateWardDto.code || updateWardDto.name) {
      const existingWard = await this.wardRepository.findOne({
        where: [
          { code: updateWardDto.code },
          { name: updateWardDto.name },
        ].filter(condition => Object.values(condition)[0] !== undefined),
      });

      if (existingWard && existingWard.id !== id) {
        if (updateWardDto.code && existingWard.code === updateWardDto.code) {
          throw new ConflictException(`Ward with code '${updateWardDto.code}' already exists`);
        }
        if (updateWardDto.name && existingWard.name === updateWardDto.name) {
          throw new ConflictException(`Ward with name '${updateWardDto.name}' already exists`);
        }
      }
    }

    Object.assign(ward, updateWardDto);
    return this.wardRepository.save(ward);
  }

  async removeWard(id: string) {
    const ward = await this.findWardById(id);
    
    // Check if ward has beds
    const bedCount = await this.bedRepository.count({ where: { wardId: id } });
    
    if (bedCount > 0) {
      throw new BadRequestException('Cannot delete ward with existing beds. Please remove all beds first.');
    }

    return this.wardRepository.softRemove(ward);
  }

  // Bed Management
  async createBed(createBedDto: any) {
    const { wardId, bedNumber } = createBedDto;
    
    // Check if ward exists
    const ward = await this.wardRepository.findOne(wardId);
    if (!ward) {
      throw new NotFoundException(`Ward with ID ${wardId} not found`);
    }
    
    // Check if bed number already exists in the ward
    const existingBed = await this.bedRepository.findOne({
      where: { bedNumber, wardId },
    });
    
    if (existingBed) {
      throw new ConflictException(`Bed with number '${bedNumber}' already exists in this ward`);
    }
    
    const bed = this.bedRepository.create({
      ...createBedDto,
      status: BedStatus.AVAILABLE,
    });
    
    return this.bedRepository.save(bed);
  }

  async findAllBeds(filterDto: any = {}) {
    const {
      wardId,
      status,
      bedClass,
      isIsolation,
      search,
      page = 1,
      limit = 10,
    } = filterDto;
    
    const skip = (page - 1) * limit;
    const where: FindConditions<Bed> = {};
    
    if (wardId) where.wardId = wardId;
    if (status) where.status = status;
    if (bedClass) where.class = bedClass;
    if (isIsolation !== undefined) where.isIsolation = isIsolation === 'true';
    
    if (search) {
      where.bedNumber = Like(`%${search}%`);
    }

    const [beds, total] = await this.bedRepository.findAndCount({
      where,
      relations: ['ward', 'currentAdmission', 'currentAdmission.patient'],
      skip,
      take: limit,
    });

    return {
      data: beds,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBedById(id: string) {
    const bed = await this.bedRepository.findOne({
      where: { id },
      relations: ['ward', 'currentAdmission', 'currentAdmission.patient'],
    });

    if (!bed) {
      throw new NotFoundException(`Bed with ID ${id} not found`);
    }

    return bed;
  }

  async updateBed(id: string, updateBedDto: any) {
    const bed = await this.findBedById(id);
    
    // Check if bed number is being updated and if it already exists in the ward
    if (updateBedDto.bedNumber && updateBedDto.bedNumber !== bed.bedNumber) {
      const existingBed = await this.bedRepository.findOne({
        where: { 
          bedNumber: updateBedDto.bedNumber, 
          wardId: bed.wardId,
        },
      });
      
      if (existingBed) {
        throw new ConflictException(`Bed with number '${updateBedDto.bedNumber}' already exists in this ward`);
      }
    }
    
    // Prevent updating bed status directly - use dedicated methods
    if (updateBedDto.status) {
      delete updateBedDto.status;
    }

    Object.assign(bed, updateBedDto);
    return this.bedRepository.save(bed);
  }

  async updateBedStatus(bedId: string, status: BedStatus, updatedById: string) {
    const bed = await this.findBedById(bedId);
    
    // Validate status transition
    if (bed.status === status) {
      return bed; // No change needed
    }
    
    // Additional validation for status transitions
    if (status === BedStatus.OCCUPIED && bed.status !== BedStatus.AVAILABLE) {
      throw new BadRequestException(`Cannot set bed to OCCUPIED from ${bed.status} status`);
    }
    
    bed.status = status;
    bed.updatedBy = updatedById;
    
    return this.bedRepository.save(bed);
  }

  async removeBed(id: string) {
    const bed = await this.findBedById(id);
    
    // Check if bed is occupied
    if (bed.status === BedStatus.OCCUPIED) {
      throw new BadRequestException('Cannot delete an occupied bed. Please discharge the patient first.');
    }
    
    return this.bedRepository.softRemove(bed);
  }

  async getBedAvailability(filters: {
    wardId?: string;
    bedClass?: BedClass;
    startDate?: Date;
    endDate?: Date;
  } = {}) {
    const { wardId, bedClass, startDate, endDate } = filters;
    
    const query = this.bedRepository
      .createQueryBuilder('bed')
      .leftJoinAndSelect('bed.ward', 'ward')
      .select([
        'bed.id',
        'bed.bedNumber',
        'bed.status',
        'bed.class',
        'bed.isIsolation',
        'ward.id',
        'ward.name',
        'ward.type',
      ]);
    
    if (wardId) {
      query.andWhere('bed.wardId = :wardId', { wardId });
    }
    
    if (bedClass) {
      query.andWhere('bed.class = :bedClass', { bedClass });
    }
    
    // Get all beds matching the filters
    const beds = await query.getMany();
    
    // If date range is provided, check for scheduled admissions/transfers
    if (startDate && endDate) {
      const scheduledAdmissions = await this.admissionRepository
        .createQueryBuilder('admission')
        .where('admission.admissionDate BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere('admission.status IN (:...statuses)', {
          statuses: ['ADMITTED', 'TRANSFERRED'],
        })
        .getMany();
      
      // Mark beds as reserved if they have scheduled admissions
      const reservedBedIds = new Set(scheduledAdmissions.map(admission => admission.bedId));
      
      beds.forEach(bed => {
        if (reservedBedIds.has(bed.id) && bed.status === BedStatus.AVAILABLE) {
          bed.status = BedStatus.RESERVED;
        }
      });
    }
    
    // Calculate availability statistics
    const totalBeds = beds.length;
    const availableBeds = beds.filter(bed => bed.status === BedStatus.AVAILABLE).length;
    const occupiedBeds = beds.filter(bed => bed.status === BedStatus.OCCUPIED).length;
    const reservedBeds = beds.filter(bed => bed.status === BedStatus.RESERVED).length;
    const maintenanceBeds = beds.filter(bed => bed.status === BedStatus.MAINTENANCE).length;
    
    return {
      totalBeds,
      availableBeds,
      occupiedBeds,
      reservedBeds,
      maintenanceBeds,
      occupancyRate: totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0,
      beds,
    };
  }

  async getWardOccupancy(wardId: string) {
    const ward = await this.findWardById(wardId);
    
    const totalBeds = await this.bedRepository.count({ where: { wardId } });
    const occupiedBeds = await this.bedRepository.count({
      where: { wardId, status: BedStatus.OCCUPIED },
    });
    
    const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
    
    // Get current patients in the ward
    const currentPatients = await this.bedRepository
      .createQueryBuilder('bed')
      .leftJoinAndSelect('bed.currentAdmission', 'admission')
      .leftJoinAndSelect('admission.patient', 'patient')
      .where('bed.wardId = :wardId', { wardId })
      .andWhere('bed.status = :status', { status: BedStatus.OCCUPIED })
      .select([
        'bed.id',
        'bed.bedNumber',
        'admission.id',
        'admission.admissionDate',
        'patient.id',
        'patient.firstName',
        'patient.lastName',
        'patient.mrn',
      ])
      .getMany();
    
    return {
      ward: {
        id: ward.id,
        name: ward.name,
        code: ward.code,
        totalBeds,
        occupiedBeds,
        availableBeds: totalBeds - occupiedBeds,
        occupancyRate,
      },
      currentPatients: currentPatients.map(bed => ({
        bedId: bed.id,
        bedNumber: bed.bedNumber,
        admissionId: bed.currentAdmission?.id,
        admissionDate: bed.currentAdmission?.admissionDate,
        patient: bed.currentAdmission?.patient ? {
          id: bed.currentAdmission.patient.id,
          mrn: bed.currentAdmission.patient.mrn,
          name: `${bed.currentAdmission.patient.firstName} ${bed.currentAdmission.patient.lastName}`,
        } : null,
      })),
    };
  }
}
