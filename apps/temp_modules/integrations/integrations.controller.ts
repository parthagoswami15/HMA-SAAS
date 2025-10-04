import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
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

@Controller('integrations')
export class IntegrationsController {
  constructor(
    private readonly integrationsService: IntegrationsService,
    private readonly fhirService: FhirService,
    private readonly hl7Service: Hl7Service,
    private readonly pacsService: PacsService,
    private readonly lisService: LisService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly gstService: GstService,
    private readonly accountingService: AccountingService,
    private readonly webhookService: WebhookService,
    private readonly apiKeyService: ApiKeyService,
  ) {}

  // FHIR endpoints
  @Get('fhir/patient/:patientId')
  async getFhirPatient(@Param('patientId') patientId: string, @Request() req) {
    return this.fhirService.getPatient(patientId, req.user);
  }

  @Post('fhir/patient')
  @HttpCode(HttpStatus.CREATED)
  async createFhirPatient(@Body() patientDto: any, @Request() req) {
    return this.fhirService.createPatient(patientDto, req.user);
  }

  @Put('fhir/patient/:patientId')
  async updateFhirPatient(
    @Param('patientId') patientId: string,
    @Body() patientDto: any,
    @Request() req,
  ) {
    return this.fhirService.updatePatient(patientId, patientDto, req.user);
  }

  @Get('fhir/encounter/:encounterId')
  async getFhirEncounter(@Param('encounterId') encounterId: string, @Request() req) {
    return this.fhirService.getEncounter(encounterId, req.user);
  }

  @Post('fhir/observation')
  @HttpCode(HttpStatus.CREATED)
  async createFhirObservation(@Body() observationDto: any, @Request() req) {
    return this.fhirService.createObservation(observationDto, req.user);
  }

  @Get('fhir/observation/:observationId')
  async getFhirObservation(@Param('observationId') observationId: string, @Request() req) {
    return this.fhirService.getObservation(observationId, req.user);
  }

  // HL7 endpoints
  @Post('hl7/message')
  @HttpCode(HttpStatus.CREATED)
  async processHl7Message(@Body() hl7Dto: any, @Request() req) {
    return this.hl7Service.processHl7Message(hl7Dto, req.user);
  }

  @Get('hl7/message/:messageId')
  async getHl7Message(@Param('messageId') messageId: string, @Request() req) {
    return this.hl7Service.getHl7Message(messageId, req.user);
  }

  @Post('hl7/admit')
  @HttpCode(HttpStatus.CREATED)
  async processAdmitMessage(@Body() admitDto: any, @Request() req) {
    return this.hl7Service.processAdmitMessage(admitDto, req.user);
  }

  @Post('hl7/discharge')
  @HttpCode(HttpStatus.OK)
  async processDischargeMessage(@Body() dischargeDto: any, @Request() req) {
    return this.hl7Service.processDischargeMessage(dischargeDto, req.user);
  }

  // PACS endpoints
  @Post('pacs/study')
  @HttpCode(HttpStatus.CREATED)
  async uploadStudy(@Body() studyDto: any, @Request() req) {
    return this.pacsService.uploadStudy(studyDto, req.user);
  }

  @Get('pacs/study/:studyId')
  async getStudy(@Param('studyId') studyId: string, @Request() req) {
    return this.pacsService.getStudy(studyId, req.user);
  }

  @Get('pacs/patient/:patientId/studies')
  async getPatientStudies(@Param('patientId') patientId: string, @Request() req) {
    return this.pacsService.getPatientStudies(patientId, req.user);
  }

  @Post('pacs/study/:studyId/report')
  @HttpCode(HttpStatus.CREATED)
  async addStudyReport(@Param('studyId') studyId: string, @Body() reportDto: any, @Request() req) {
    return this.pacsService.addStudyReport(studyId, reportDto, req.user);
  }

  // LIS endpoints
  @Post('lis/order')
  @HttpCode(HttpStatus.CREATED)
  async createLabOrder(@Body() orderDto: any, @Request() req) {
    return this.lisService.createLabOrder(orderDto, req.user);
  }

  @Get('lis/order/:orderId')
  async getLabOrder(@Param('orderId') orderId: string, @Request() req) {
    return this.lisService.getLabOrder(orderId, req.user);
  }

  @Put('lis/order/:orderId/result')
  async updateLabResult(@Param('orderId') orderId: string, @Body() resultDto: any, @Request() req) {
    return this.lisService.updateLabResult(orderId, resultDto, req.user);
  }

  @Get('lis/patient/:patientId/orders')
  async getPatientLabOrders(@Param('patientId') patientId: string, @Request() req) {
    return this.lisService.getPatientLabOrders(patientId, req.user);
  }

  // Payment Gateway endpoints
  @Post('payments/process')
  @HttpCode(HttpStatus.CREATED)
  async processPayment(@Body() paymentDto: any, @Request() req) {
    return this.paymentGatewayService.processPayment(paymentDto, req.user);
  }

  @Get('payments/:paymentId/status')
  async getPaymentStatus(@Param('paymentId') paymentId: string, @Request() req) {
    return this.paymentGatewayService.getPaymentStatus(paymentId, req.user);
  }

  @Post('payments/refund')
  @HttpCode(HttpStatus.CREATED)
  async processRefund(@Body() refundDto: any, @Request() req) {
    return this.paymentGatewayService.processRefund(refundDto, req.user);
  }

  @Get('payments/gateways')
  async getAvailableGateways(@Request() req) {
    return this.paymentGatewayService.getAvailableGateways(req.user);
  }

  // GST endpoints
  @Post('gst/invoice')
  @HttpCode(HttpStatus.CREATED)
  async generateGstInvoice(@Body() invoiceDto: any, @Request() req) {
    return this.gstService.generateGstInvoice(invoiceDto, req.user);
  }

  @Get('gst/invoice/:invoiceId')
  async getGstInvoice(@Param('invoiceId') invoiceId: string, @Request() req) {
    return this.gstService.getGstInvoice(invoiceId, req.user);
  }

  @Post('gst/credit-note')
  @HttpCode(HttpStatus.CREATED)
  async generateCreditNote(@Body() creditNoteDto: any, @Request() req) {
    return this.gstService.generateCreditNote(creditNoteDto, req.user);
  }

  @Get('gst/reports')
  async getGstReports(@Query() query: any, @Request() req) {
    return this.gstService.getGstReports(query, req.user);
  }

  // Accounting endpoints
  @Post('accounting/journal-entry')
  @HttpCode(HttpStatus.CREATED)
  async createJournalEntry(@Body() entryDto: any, @Request() req) {
    return this.accountingService.createJournalEntry(entryDto, req.user);
  }

  @Get('accounting/ledger/:accountCode')
  async getAccountLedger(@Param('accountCode') accountCode: string, @Query() query: any, @Request() req) {
    return this.accountingService.getAccountLedger(accountCode, query, req.user);
  }

  @Get('accounting/trial-balance')
  async getTrialBalance(@Query() query: any, @Request() req) {
    return this.accountingService.getTrialBalance(query, req.user);
  }

  @Get('accounting/balance-sheet')
  async getBalanceSheet(@Query() query: any, @Request() req) {
    return this.accountingService.getBalanceSheet(query, req.user);
  }

  @Get('accounting/profit-loss')
  async getProfitLoss(@Query() query: any, @Request() req) {
    return this.accountingService.getProfitLoss(query, req.user);
  }

  // Webhook endpoints
  @Post('webhooks/:webhookId')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Param('webhookId') webhookId: string, @Body() webhookDto: any) {
    return this.webhookService.handleWebhook(webhookId, webhookDto);
  }

  @Post('webhooks')
  @HttpCode(HttpStatus.CREATED)
  async createWebhook(@Body() webhookDto: any, @Request() req) {
    return this.webhookService.createWebhook(webhookDto, req.user);
  }

  @Get('webhooks')
  async getWebhooks(@Request() req) {
    return this.webhookService.getWebhooks(req.user);
  }

  @Put('webhooks/:webhookId')
  async updateWebhook(@Param('webhookId') webhookId: string, @Body() webhookDto: any, @Request() req) {
    return this.webhookService.updateWebhook(webhookId, webhookDto, req.user);
  }

  @Delete('webhooks/:webhookId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWebhook(@Param('webhookId') webhookId: string, @Request() req) {
    await this.webhookService.deleteWebhook(webhookId, req.user);
  }

  @Post('webhooks/:webhookId/test')
  @HttpCode(HttpStatus.OK)
  async testWebhook(@Param('webhookId') webhookId: string, @Request() req) {
    return this.webhookService.testWebhook(webhookId, req.user);
  }

  // API Key endpoints
  @Post('api-keys')
  @HttpCode(HttpStatus.CREATED)
  async createApiKey(@Body() apiKeyDto: any, @Request() req) {
    return this.apiKeyService.createApiKey(apiKeyDto, req.user);
  }

  @Get('api-keys')
  async getApiKeys(@Request() req) {
    return this.apiKeyService.getApiKeys(req.user);
  }

  @Put('api-keys/:apiKeyId')
  async updateApiKey(@Param('apiKeyId') apiKeyId: string, @Body() apiKeyDto: any, @Request() req) {
    return this.apiKeyService.updateApiKey(apiKeyId, apiKeyDto, req.user);
  }

  @Delete('api-keys/:apiKeyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeApiKey(@Param('apiKeyId') apiKeyId: string, @Request() req) {
    await this.apiKeyService.revokeApiKey(apiKeyId, req.user);
  }

  @Post('api-keys/:apiKeyId/rotate')
  @HttpCode(HttpStatus.OK)
  async rotateApiKey(@Param('apiKeyId') apiKeyId: string, @Request() req) {
    return this.apiKeyService.rotateApiKey(apiKeyId, req.user);
  }

  // Integration status and configuration
  @Get('status')
  async getIntegrationStatus(@Request() req) {
    return this.integrationsService.getIntegrationStatus(req.user);
  }

  @Get('configurations')
  async getIntegrationConfigurations(@Request() req) {
    return this.integrationsService.getIntegrationConfigurations(req.user);
  }

  @Put('configurations')
  async updateIntegrationConfiguration(@Body() configDto: any, @Request() req) {
    return this.integrationsService.updateIntegrationConfiguration(configDto, req.user);
  }

  // Data synchronization
  @Post('sync/fhir')
  @HttpCode(HttpStatus.OK)
  async syncFhirData(@Body() syncDto: any, @Request() req) {
    return this.integrationsService.syncFhirData(syncDto, req.user);
  }

  @Post('sync/hl7')
  @HttpCode(HttpStatus.OK)
  async syncHl7Data(@Body() syncDto: any, @Request() req) {
    return this.integrationsService.syncHl7Data(syncDto, req.user);
  }

  @Get('sync/status')
  async getSyncStatus(@Request() req) {
    return this.integrationsService.getSyncStatus(req.user);
  }
}
