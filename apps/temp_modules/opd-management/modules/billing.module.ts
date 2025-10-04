import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingService } from '../services/billing.service';
import { BillingController } from '../controllers/billing.controller';
import { PatientModule } from '../../patient/patient.module';
import { StaffModule } from '../../staff-management/staff.module';
import { EncounterModule } from './encounter.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    PatientModule,
    StaffModule,
    EncounterModule,
  ],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
