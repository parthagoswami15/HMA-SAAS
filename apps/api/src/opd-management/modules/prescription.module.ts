import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription } from '../entities/prescription.entity';
import { PrescriptionService } from '../services/prescription.service';
import { PrescriptionController } from '../controllers/prescription.controller';
import { PrescriptionRepository } from '../repositories/prescription.repository';
import { PatientModule } from '../../patient/patient.module';
import { StaffModule } from '../../staff-management/staff.module';
import { EncounterModule } from './encounter.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prescription, PrescriptionRepository]),
    PatientModule,
    StaffModule,
    EncounterModule,
  ],
  controllers: [PrescriptionController],
  providers: [PrescriptionService],
  exports: [PrescriptionService],
})
export class PrescriptionModule {}
