import { Module } from '@nestjs/common';
import { PatientPortalController } from './patient-portal.controller';
import { PatientPortalService } from './patient-portal.service';
import { OnboardingService } from './services/onboarding.service';
import { AppointmentService } from './services/appointment.service';
import { FamilyService } from './services/family.service';
import { HealthTimelineService } from './services/health-timeline.service';
import { ConsentService } from './services/consent.service';
import { PaymentService } from './services/payment.service';
import { ReportService } from './services/report.service';
import { NotificationService } from './services/notification.service';
import { LanguageService } from './services/language.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TelemedicineModule } from '../telemedicine/telemedicine.module';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    NotificationsModule,
    TelemedicineModule,
    SecurityModule,
  ],
  controllers: [PatientPortalController],
  providers: [
    PatientPortalService,
    OnboardingService,
    AppointmentService,
    FamilyService,
    HealthTimelineService,
    ConsentService,
    PaymentService,
    ReportService,
    NotificationService,
    LanguageService,
  ],
  exports: [
    PatientPortalService,
    OnboardingService,
    AppointmentService,
    FamilyService,
    HealthTimelineService,
    ConsentService,
    PaymentService,
    ReportService,
    NotificationService,
    LanguageService,
  ],
})
export class PatientPortalModule {}
