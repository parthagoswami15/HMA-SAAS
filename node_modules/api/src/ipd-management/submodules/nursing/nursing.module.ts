import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NursingChart } from '../../entities/nursing-chart.entity';
import { MedicationAdministration } from '../../entities/medication-administration.entity';
import { Patient } from '../../../patients/entities/patient.entity';
import { Staff } from '../../../staff/entities/staff.entity';
import { Admission } from '../../entities/admission.entity';
import { NursingController } from '../controllers/nursing.controller';
import { NursingService } from '../../services/nursing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NursingChart,
      MedicationAdministration,
      Patient,
      Staff,
      Admission,
    ]),
  ],
  controllers: [NursingController],
  providers: [NursingService],
  exports: [NursingService],
})
export class NursingModule {}
