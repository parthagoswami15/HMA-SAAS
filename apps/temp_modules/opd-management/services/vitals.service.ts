import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions } from 'typeorm';
import { Vitals } from '../entities/vitals.entity';
import { VitalsRepository } from '../repositories/vitals.repository';
import { CreateVitalsDto } from '../dto/vitals/create-vitals.dto';
import { UpdateVitalsDto } from '../dto/vitals/update-vitals.dto';
import { PatientService } from '../../patient/patient.service';
import { VisitService } from './visit.service';

@Injectable()
export class VitalsService {
  constructor(
    @InjectRepository(Vitals)
    private readonly vitalsRepository: VitalsRepository,
    private readonly patientService: PatientService,
    private readonly visitService: VisitService,
  ) {}

  async create(createVitalsDto: CreateVitalsDto, recordedById: string): Promise<Vitals> {
    // Validate patient exists
    await this.patientService.getPatientById(createVitalsDto.patientId);
    
    // Validate visit exists
    await this.visitService.getVisitById(createVitalsDto.visitId);

    const vitals = this.vitalsRepository.create({
      ...createVitalsDto,
      recordedById,
    });

    // Calculate BMI if height and weight are provided
    if (createVitalsDto.height && createVitalsDto.weight) {
      vitals.calculateBMI();
    }

    return this.vitalsRepository.save(vitals);
  }

  async findAll(filters?: {
    patientId?: string;
    visitId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Vitals[]> {
    const where: FindConditions<Vitals> = {};
    
    if (filters?.patientId) where.patientId = filters.patientId;
    if (filters?.visitId) where.visitId = filters.visitId;
    
    if (filters?.startDate || filters?.endDate) {
      where.recordedAt = Between(
        filters.startDate || new Date(0), // Default to beginning of time
        filters.endDate || new Date(),    // Default to now
      );
    }

    return this.vitalsRepository.find({
      where,
      order: { recordedAt: 'DESC' },
      relations: ['recordedBy'],
    });
  }

  async findOne(id: string): Promise<Vitals> {
    const vitals = await this.vitalsRepository.findOne(id, {
      relations: ['patient', 'visit', 'recordedBy'],
    });
    
    if (!vitals) {
      throw new NotFoundException(`Vitals with ID ${id} not found`);
    }
    
    return vitals;
  }

  async update(id: string, updateVitalsDto: UpdateVitalsDto): Promise<Vitals> {
    const vitals = await this.findOne(id);
    
    // Update only the provided fields
    Object.assign(vitals, updateVitalsDto);
    
    // Recalculate BMI if height or weight was updated
    if (updateVitalsDto.height || updateVitalsDto.weight) {
      vitals.calculateBMI();
    }
    
    return this.vitalsRepository.save(vitals);
  }

  async remove(id: string): Promise<void> {
    const result = await this.vitalsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Vitals with ID ${id} not found`);
    }
  }

  async getPatientVitalsTrends(
    patientId: string, 
    metric: keyof Vitals, 
    days = 30
  ): Promise<{ date: Date; value: any }[]> {
    return this.vitalsRepository.getVitalsTrends(patientId, metric, days);
  }

  async getAbnormalVitals(thresholds: {
    temperature?: { min: number; max: number };
    heartRate?: { min: number; max: number };
    bloodPressure?: { minSys: number; maxSys: number; minDia: number; maxDia: number };
    oxygenSaturation?: { min: number };
  }): Promise<Vitals[]> {
    return this.vitalsRepository.getAbnormalVitals(thresholds);
  }

  async getLastVitals(patientId: string): Promise<Partial<Vitals> | null> {
    return this.vitalsRepository.getLastVitals(patientId);
  }

  async getVitalsByVisit(visitId: string): Promise<Vitals[]> {
    return this.vitalsRepository.findByVisitId(visitId);
  }

  async getRecentVitals(patientId: string, limit = 5): Promise<Vitals[]> {
    return this.vitalsRepository.findByPatientId(patientId, limit);
  }
}
