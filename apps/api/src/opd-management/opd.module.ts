import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OPDController } from './opd.controller';
import { OPDService } from './opd.service';
import { Icd10Module } from './modules/icd10.module';
import { DiagnosisModule } from './modules/diagnosis.module';
import { VitalsModule } from './modules/vitals.module';
import { VisitModule } from './modules/visit.module';
import { EncounterModule } from './modules/encounter.module';
import { PrescriptionModule } from './modules/prescription.module';
import { QueueModule } from './modules/queue.module';
import { OrderModule } from './modules/order.module';
import { DocumentModule } from './modules/document.module';
import { BillingModule } from './modules/billing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    Icd10Module,
    DiagnosisModule,
    VitalsModule,
    VisitModule,
    EncounterModule,
    PrescriptionModule,
    QueueModule,
    OrderModule,
    DocumentModule,
    BillingModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [OPDController],
  providers: [OPDService, JwtStrategy, RolesGuard],
  exports: [OPDService],
})
export class OPDModule {}
