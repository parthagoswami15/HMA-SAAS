import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vitals } from '../entities/vitals.entity';
import { VitalsService } from '../services/vitals.service';
import { VitalsController } from '../controllers/vitals.controller';
import { VitalsRepository } from '../repositories/vitals.repository';
import { PatientModule } from '../../patient/patient.module';
import { VisitModule } from './visit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vitals, VitalsRepository]), 
    PatientModule,
    VisitModule,
  ],
  controllers: [VitalsController],
  providers: [VitalsService],
  exports: [VitalsService],
})
export class VitalsModule {}
