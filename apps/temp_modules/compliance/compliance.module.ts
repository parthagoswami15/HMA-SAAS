import { Module } from '@nestjs/common';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';
import { AadhaarService } from './services/aadhaar.service';
import { AuditService } from './services/audit.service';
import { BirthDeathService } from './services/birth-death.service';
import { PcpndtService } from './services/pcpndt.service';
import { PrescriptionService } from './services/prescription.service';
import { DataLocalizationService } from './services/data-localization.service';
import { ComplianceGuard } from './guards/compliance.guard';
import { PcpndtGuard } from './guards/pcpndt.guard';
import { PrescriptionGuard } from './guards/prescription.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [ComplianceController],
  providers: [
    ComplianceService,
    AadhaarService,
    AuditService,
    BirthDeathService,
    PcpndtService,
    PrescriptionService,
    DataLocalizationService,
    ComplianceGuard,
    PcpndtGuard,
    PrescriptionGuard,
  ],
  exports: [
    ComplianceService,
    AadhaarService,
    AuditService,
    BirthDeathService,
    PcpndtService,
    PrescriptionService,
    DataLocalizationService,
  ],
})
export class ComplianceModule {}
