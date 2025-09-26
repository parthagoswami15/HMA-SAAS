import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueToken } from '../entities/queue-token.entity';
import { QueueService } from '../services/queue.service';
import { QueueController } from '../controllers/queue.controller';
import { QueueTokenRepository } from '../repositories/queue-token.repository';
import { PatientModule } from '../../patient/patient.module';
import { StaffModule } from '../../staff-management/staff.module';
import { VisitModule } from './visit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QueueToken, QueueTokenRepository]),
    PatientModule,
    StaffModule,
    VisitModule,
  ],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
