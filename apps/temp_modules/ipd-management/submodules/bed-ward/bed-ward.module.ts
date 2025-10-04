import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bed } from '../../entities/bed.entity';
import { Ward } from '../../entities/ward.entity';
import { Admission } from '../../entities/admission.entity';
import { BedWardController } from '../controllers/bed-ward.controller';
import { BedWardService } from '../../services/bed-ward.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Bed,
      Ward,
      Admission,
    ]),
  ],
  controllers: [BedWardController],
  providers: [BedWardService],
  exports: [BedWardService],
})
export class BedWardModule {}
