import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discharge } from '../../entities/discharge.entity';
import { Admission } from '../../entities/admission.entity';
import { Patient } from '../../../patients/entities/patient.entity';
import { Staff } from '../../../staff/entities/staff.entity';
import { Bed } from '../../entities/bed.entity';
import { DischargeController } from '../controllers/discharge.controller';
import { DischargeService } from '../../services/discharge.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Discharge,
      Admission,
      Patient,
      Staff,
      Bed,
    ]),
  ],
  controllers: [DischargeController],
  providers: [DischargeService],
  exports: [DischargeService],
})
export class DischargeModule {}
