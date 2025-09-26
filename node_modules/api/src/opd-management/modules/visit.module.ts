import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from '../entities/visit.entity';
import { VisitService } from '../services/visit.service';
import { VisitController } from '../controllers/visit.controller';
import { VisitRepository } from '../repositories/visit.repository';
import { PatientModule } from '../../patient/patient.module';
import { StaffModule } from '../../staff-management/staff.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Visit, VisitRepository]),
    PatientModule,
    StaffModule,
  ],
  controllers: [VisitController],
  providers: [VisitService],
  exports: [VisitService],
})
export class VisitModule {}
