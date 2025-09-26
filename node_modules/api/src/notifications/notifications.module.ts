import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { SmsService } from './services/sms.service';
import { EmailService } from './services/email.service';
import { WhatsAppService } from './services/whatsapp.service';
import { IvrService } from './services/ivr.service';
import { NotificationTemplateService } from './services/template.service';
import { NotificationThreadService } from './services/thread.service';
import { NotificationProviderService } from './services/provider.service';
import { NotificationSchedulerService } from './services/scheduler.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    SmsService,
    EmailService,
    WhatsAppService,
    IvrService,
    NotificationTemplateService,
    NotificationThreadService,
    NotificationProviderService,
    NotificationSchedulerService,
  ],
  exports: [
    NotificationsService,
    SmsService,
    EmailService,
    WhatsAppService,
    IvrService,
    NotificationTemplateService,
    NotificationThreadService,
  ],
})
export class NotificationsModule {}


