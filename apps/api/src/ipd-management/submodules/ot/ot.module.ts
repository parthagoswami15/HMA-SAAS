import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Surgery } from '../../entities/surgery.entity';
import { Patient } from '../../../patients/entities/patient.entity';
import { Staff } from '../../../staff/entities/staff.entity';
import { Admission } from '../../entities/admission.entity';
import { OTController } from '../controllers/ot.controller';
import { OTService } from '../../services/ot.service';
import { OTTheater } from '../../entities/ot-theater.entity';
import { Bed } from '../../entities/bed.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Surgery,
      OTTheater,
      Patient,
      Staff,
      Admission,
      Bed,
    ]),
  ],
  controllers: [OTController],
  providers: [OTService],
  exports: [OTService],
})
export class OTModule {}
