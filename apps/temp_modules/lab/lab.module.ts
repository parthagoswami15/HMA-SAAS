import { Module } from '@nestjs/common';
import { LabService } from './lab.service';
import { LabController } from './lab.controller';

@Module({
  providers: [LabService],
  controllers: [LabController],
})
export class LabModule {}


