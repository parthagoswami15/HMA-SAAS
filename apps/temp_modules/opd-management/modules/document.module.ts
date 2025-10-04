import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../entities/document.entity';
import { DocumentService } from '../services/document.service';
import { DocumentController } from '../controllers/document.controller';
import { DocumentRepository } from '../repositories/document.repository';
import { PatientModule } from '../../patient/patient.module';
import { StaffModule } from '../../staff-management/staff.module';
import { EncounterModule } from './encounter.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, DocumentRepository]),
    PatientModule,
    StaffModule,
    EncounterModule,
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
