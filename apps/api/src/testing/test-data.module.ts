import { Module } from '@nestjs/common';
import { TestDataService } from './test-data.service';
import { TestDataController } from './test-data.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [PrismaModule, PatientsModule],
  controllers: [TestDataController],
  providers: [TestDataService],
  exports: [TestDataService],
})
export class TestDataModule {}
