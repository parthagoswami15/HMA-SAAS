import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Icd10Code } from '../entities/icd10-code.entity';
import { Icd10Controller } from '../controllers/icd10.controller';
import { Icd10Service } from '../services/icd10.service';
import { Icd10Repository } from '../repositories/icd10.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Icd10Code, Icd10Repository]),
  ],
  controllers: [Icd10Controller],
  providers: [Icd10Service],
  exports: [Icd10Service],
})
export class Icd10Module {}
