import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { AuthenticationService } from './services/authentication.service';
import { AuthorizationService } from './services/authorization.service';
import { MfaService } from './services/mfa.service';
import { EncryptionService } from './services/encryption.service';
import { AuditService } from './services/audit.service';
import { SessionService } from './services/session.service';
import { DeviceService } from './services/device.service';
import { IpService } from './services/ip.service';
import { DataRetentionService } from './services/data-retention.service';
import { AnomalyDetectionService } from './services/anomaly-detection.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [SecurityController],
  providers: [
    SecurityService,
    AuthenticationService,
    AuthorizationService,
    MfaService,
    EncryptionService,
    AuditService,
    SessionService,
    DeviceService,
    IpService,
    DataRetentionService,
    AnomalyDetectionService,
  ],
  exports: [
    SecurityService,
    AuthenticationService,
    AuthorizationService,
    MfaService,
    EncryptionService,
    AuditService,
    SessionService,
    DeviceService,
    IpService,
    DataRetentionService,
    AnomalyDetectionService,
  ],
})
export class SecurityModule {}
