import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admission } from '../../entities/admission.entity';
import { Patient } from '../../../patients/entities/patient.entity';
import { Staff } from '../../../staff/entities/staff.entity';
import { Bed } from '../../entities/bed.entity';
import { AdmissionService } from '../services/admission.service';
import { AdmissionController } from '../controllers/admission.controller';
import { BedWardService } from '../services/bed-ward.service';
import { Ward } from '../../entities/ward.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admission,
      Patient,
      Staff,
      Bed,
      Ward,
    ]),
  ],
  controllers: [AdmissionController],
  providers: [AdmissionService, BedWardService],
  exports: [AdmissionService],
})
export class AdmissionModule {}
