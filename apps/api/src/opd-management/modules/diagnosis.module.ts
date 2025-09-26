import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnosis } from '../entities/diagnosis.entity';
import { Icd10Code } from '../entities/icd10-code.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { Staff } from '../../staff-management/entities/staff.entity';
import { Encounter } from '../entities/encounter.entity';
import { DiagnosisController } from '../controllers/diagnosis.controller';
import { DiagnosisService } from '../services/diagnosis.service';
import { Icd10Service } from '../services/icd10.service';
import { DiagnosisRepository } from '../repositories/diagnosis.repository';
import { Icd10Repository } from '../repositories/icd10.repository';
import { PatientModule } from '../../patient/patient.module';
import { StaffModule } from '../../staff-management/staff.module';
import { EncounterModule } from './encounter.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Diagnosis,
      Icd10Code,
      Patient,
      Staff,
      Encounter,
      DiagnosisRepository,
      Icd10Repository,
    ]),
    PatientModule,
    StaffModule,
    EncounterModule,
  ],
  controllers: [DiagnosisController],
  providers: [DiagnosisService, Icd10Service],
  exports: [DiagnosisService],
})
export class DiagnosisModule {}
