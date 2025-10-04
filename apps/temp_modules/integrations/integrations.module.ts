import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { FhirService } from './services/fhir.service';
import { Hl7Service } from './services/hl7.service';
import { PacsService } from './services/pacs.service';
import { LisService } from './services/lis.service';
import { PaymentGatewayService } from './services/payment-gateway.service';
import { GstService } from './services/gst.service';
import { AccountingService } from './services/accounting.service';
import { WebhookService } from './services/webhook.service';
import { ApiKeyService } from './services/api-key.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [IntegrationsController],
  providers: [
    IntegrationsService,
    FhirService,
    Hl7Service,
    PacsService,
    LisService,
    PaymentGatewayService,
    GstService,
    AccountingService,
    WebhookService,
    ApiKeyService,
  ],
  exports: [
    IntegrationsService,
    FhirService,
    Hl7Service,
    PacsService,
    LisService,
    PaymentGatewayService,
    GstService,
    AccountingService,
    WebhookService,
    ApiKeyService,
  ],
})
export class IntegrationsModule {}
