import { Module } from '@nestjs/common';
import { TelemedicineController } from './telemedicine.controller';
import { TelemedicineService } from './telemedicine.service';
import { VideoService } from './services/video.service';
import { SchedulingService } from './services/scheduling.service';
import { PrescriptionService } from './services/prescription.service';
import { PaymentService } from './services/payment.service';
import { FileService } from './services/file.service';
import { StateRestrictionService } from './services/state-restriction.service';
import { IdentityVerificationService } from './services/identity-verification.service';
import { BandwidthService } from './services/bandwidth.service';
import { NotificationService } from './services/notification.service';
import { PrismaModule } from '../prisma/prisma.module';
// import { AuditModule } from '../audit/audit.module'; // TODO: Create audit module
// import { ComplianceModule } from '../compliance/compliance.module'; // TODO: Create compliance module
// import { NotificationsModule } from '../notifications/notifications.module'; // TODO: Create notifications module

@Module({
  imports: [PrismaModule], // TODO: Add AuditModule, ComplianceModule, NotificationsModule when created
  controllers: [TelemedicineController],
  providers: [
    TelemedicineService,
    VideoService,
    SchedulingService,
    PrescriptionService,
    PaymentService,
    FileService,
    StateRestrictionService,
    IdentityVerificationService,
    BandwidthService,
    NotificationService,
  ],
  exports: [
    TelemedicineService,
    VideoService,
    SchedulingService,
    PrescriptionService,
    PaymentService,
    FileService,
    StateRestrictionService,
    IdentityVerificationService,
    BandwidthService,
  ],
})
export class TelemedicineModule {}
