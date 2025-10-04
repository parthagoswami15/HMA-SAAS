import { Module } from '@nestjs/common';
import { IpdService } from './ipd.service';
import { IpdController } from './ipd.controller';

@Module({
  providers: [IpdService],
  controllers: [IpdController],
})
export class IpdModule {}


