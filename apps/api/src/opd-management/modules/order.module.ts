import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderService } from '../services/order.service';
import { OrderController } from '../controllers/order.controller';
import { OrderRepository } from '../repositories/order.repository';
import { PatientModule } from '../../patient/patient.module';
import { StaffModule } from '../../staff-management/staff.module';
import { EncounterModule } from './encounter.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderRepository]),
    PatientModule,
    StaffModule,
    EncounterModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
