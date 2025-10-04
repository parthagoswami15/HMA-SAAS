import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Encounter } from '../entities/encounter.entity';
import { EncounterService } from '../services/encounter.service';
import { EncounterController } from '../controllers/encounter.controller';
import { EncounterRepository } from '../repositories/encounter.repository';
import { PatientModule } from '../../patient/patient.module';
import { StaffModule } from '../../staff-management/staff.module';
import { VisitModule } from './visit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Encounter, EncounterRepository]),
    PatientModule,
    StaffModule,
    VisitModule,
  ],
  controllers: [EncounterController],
  providers: [EncounterService],
  exports: [EncounterService],
})
export class EncounterModule {}
