import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdmissionModule } from './submodules/admission/admission.module';
import { BedWardModule } from './submodules/bed-ward/bed-ward.module';
import { NursingModule } from './submodules/nursing/nursing.module';
import { OTModule } from './submodules/ot/ot.module';
import { DischargeModule } from './submodules/discharge/discharge.module';
import { IPDService } from './services/ipd.service';
import { IPDController } from './controllers/ipd.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    AdmissionModule,
    BedWardModule,
    NursingModule,
    OTModule,
    DischargeModule,
  ],
  controllers: [IPDController],
  providers: [
    IPDService,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [IPDService],
})
export class IPDModule {}
