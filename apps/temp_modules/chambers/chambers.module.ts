import { Module } from '@nestjs/common';
import { ChambersService } from './chambers.service';
import { ChambersController } from './chambers.controller';

@Module({
  controllers: [ChambersController],
  providers: [ChambersService],
  exports: [ChambersService],
})
export class ChambersModule {}
