"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsController = void 0;
const common_1 = require("@nestjs/common");
const integrations_service_1 = require("./integrations.service");
const fhir_service_1 = require("./services/fhir.service");
const hl7_service_1 = require("./services/hl7.service");
const pacs_service_1 = require("./services/pacs.service");
const lis_service_1 = require("./services/lis.service");
const payment_gateway_service_1 = require("./services/payment-gateway.service");
const gst_service_1 = require("./services/gst.service");
const accounting_service_1 = require("./services/accounting.service");
const webhook_service_1 = require("./services/webhook.service");
const api_key_service_1 = require("./services/api-key.service");
let IntegrationsController = class IntegrationsController {
    integrationsService;
    fhirService;
    hl7Service;
    pacsService;
    lisService;
    paymentGatewayService;
    gstService;
    accountingService;
    webhookService;
    apiKeyService;
    constructor(integrationsService, fhirService, hl7Service, pacsService, lisService, paymentGatewayService, gstService, accountingService, webhookService, apiKeyService) {
        this.integrationsService = integrationsService;
        this.fhirService = fhirService;
        this.hl7Service = hl7Service;
        this.pacsService = pacsService;
        this.lisService = lisService;
        this.paymentGatewayService = paymentGatewayService;
        this.gstService = gstService;
        this.accountingService = accountingService;
        this.webhookService = webhookService;
        this.apiKeyService = apiKeyService;
    }
    async getFhirPatient(patientId, req) {
        return this.fhirService.getPatient(patientId, req.user);
    }
    async createFhirPatient(patientDto, req) {
        return this.fhirService.createPatient(patientDto, req.user);
    }
    async updateFhirPatient(patientId, patientDto, req) {
        return this.fhirService.updatePatient(patientId, patientDto, req.user);
    }
    async getFhirEncounter(encounterId, req) {
        return this.fhirService.getEncounter(encounterId, req.user);
    }
    async createFhirObservation(observationDto, req) {
        return this.fhirService.createObservation(observationDto, req.user);
    }
    async getFhirObservation(observationId, req) {
        return this.fhirService.getObservation(observationId, req.user);
    }
    async processHl7Message(hl7Dto, req) {
        return this.hl7Service.processHl7Message(hl7Dto, req.user);
    }
    async getHl7Message(messageId, req) {
        return this.hl7Service.getHl7Message(messageId, req.user);
    }
    async processAdmitMessage(admitDto, req) {
        return this.hl7Service.processAdmitMessage(admitDto, req.user);
    }
    async processDischargeMessage(dischargeDto, req) {
        return this.hl7Service.processDischargeMessage(dischargeDto, req.user);
    }
    async uploadStudy(studyDto, req) {
        return this.pacsService.uploadStudy(studyDto, req.user);
    }
    async getStudy(studyId, req) {
        return this.pacsService.getStudy(studyId, req.user);
    }
    async getPatientStudies(patientId, req) {
        return this.pacsService.getPatientStudies(patientId, req.user);
    }
    async addStudyReport(studyId, reportDto, req) {
        return this.pacsService.addStudyReport(studyId, reportDto, req.user);
    }
    async createLabOrder(orderDto, req) {
        return this.lisService.createLabOrder(orderDto, req.user);
    }
    async getLabOrder(orderId, req) {
        return this.lisService.getLabOrder(orderId, req.user);
    }
    async updateLabResult(orderId, resultDto, req) {
        return this.lisService.updateLabResult(orderId, resultDto, req.user);
    }
    async getPatientLabOrders(patientId, req) {
        return this.lisService.getPatientLabOrders(patientId, req.user);
    }
    async processPayment(paymentDto, req) {
        return this.paymentGatewayService.processPayment(paymentDto, req.user);
    }
    async getPaymentStatus(paymentId, req) {
        return this.paymentGatewayService.getPaymentStatus(paymentId, req.user);
    }
    async processRefund(refundDto, req) {
        return this.paymentGatewayService.processRefund(refundDto, req.user);
    }
    async getAvailableGateways(req) {
        return this.paymentGatewayService.getAvailableGateways(req.user);
    }
    async generateGstInvoice(invoiceDto, req) {
        return this.gstService.generateGstInvoice(invoiceDto, req.user);
    }
    async getGstInvoice(invoiceId, req) {
        return this.gstService.getGstInvoice(invoiceId, req.user);
    }
    async generateCreditNote(creditNoteDto, req) {
        return this.gstService.generateCreditNote(creditNoteDto, req.user);
    }
    async getGstReports(query, req) {
        return this.gstService.getGstReports(query, req.user);
    }
    async createJournalEntry(entryDto, req) {
        return this.accountingService.createJournalEntry(entryDto, req.user);
    }
    async getAccountLedger(accountCode, query, req) {
        return this.accountingService.getAccountLedger(accountCode, query, req.user);
    }
    async getTrialBalance(query, req) {
        return this.accountingService.getTrialBalance(query, req.user);
    }
    async getBalanceSheet(query, req) {
        return this.accountingService.getBalanceSheet(query, req.user);
    }
    async getProfitLoss(query, req) {
        return this.accountingService.getProfitLoss(query, req.user);
    }
    async handleWebhook(webhookId, webhookDto) {
        return this.webhookService.handleWebhook(webhookId, webhookDto);
    }
    async createWebhook(webhookDto, req) {
        return this.webhookService.createWebhook(webhookDto, req.user);
    }
    async getWebhooks(req) {
        return this.webhookService.getWebhooks(req.user);
    }
    async updateWebhook(webhookId, webhookDto, req) {
        return this.webhookService.updateWebhook(webhookId, webhookDto, req.user);
    }
    async deleteWebhook(webhookId, req) {
        await this.webhookService.deleteWebhook(webhookId, req.user);
    }
    async testWebhook(webhookId, req) {
        return this.webhookService.testWebhook(webhookId, req.user);
    }
    async createApiKey(apiKeyDto, req) {
        return this.apiKeyService.createApiKey(apiKeyDto, req.user);
    }
    async getApiKeys(req) {
        return this.apiKeyService.getApiKeys(req.user);
    }
    async updateApiKey(apiKeyId, apiKeyDto, req) {
        return this.apiKeyService.updateApiKey(apiKeyId, apiKeyDto, req.user);
    }
    async revokeApiKey(apiKeyId, req) {
        await this.apiKeyService.revokeApiKey(apiKeyId, req.user);
    }
    async rotateApiKey(apiKeyId, req) {
        return this.apiKeyService.rotateApiKey(apiKeyId, req.user);
    }
    async getIntegrationStatus(req) {
        return this.integrationsService.getIntegrationStatus(req.user);
    }
    async getIntegrationConfigurations(req) {
        return this.integrationsService.getIntegrationConfigurations(req.user);
    }
    async updateIntegrationConfiguration(configDto, req) {
        return this.integrationsService.updateIntegrationConfiguration(configDto, req.user);
    }
    async syncFhirData(syncDto, req) {
        return this.integrationsService.syncFhirData(syncDto, req.user);
    }
    async syncHl7Data(syncDto, req) {
        return this.integrationsService.syncHl7Data(syncDto, req.user);
    }
    async getSyncStatus(req) {
        return this.integrationsService.getSyncStatus(req.user);
    }
};
exports.IntegrationsController = IntegrationsController;
__decorate([
    (0, common_1.Get)('fhir/patient/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getFhirPatient", null);
__decorate([
    (0, common_1.Post)('fhir/patient'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "createFhirPatient", null);
__decorate([
    (0, common_1.Put)('fhir/patient/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "updateFhirPatient", null);
__decorate([
    (0, common_1.Get)('fhir/encounter/:encounterId'),
    __param(0, (0, common_1.Param)('encounterId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getFhirEncounter", null);
__decorate([
    (0, common_1.Post)('fhir/observation'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "createFhirObservation", null);
__decorate([
    (0, common_1.Get)('fhir/observation/:observationId'),
    __param(0, (0, common_1.Param)('observationId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getFhirObservation", null);
__decorate([
    (0, common_1.Post)('hl7/message'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "processHl7Message", null);
__decorate([
    (0, common_1.Get)('hl7/message/:messageId'),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getHl7Message", null);
__decorate([
    (0, common_1.Post)('hl7/admit'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "processAdmitMessage", null);
__decorate([
    (0, common_1.Post)('hl7/discharge'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "processDischargeMessage", null);
__decorate([
    (0, common_1.Post)('pacs/study'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "uploadStudy", null);
__decorate([
    (0, common_1.Get)('pacs/study/:studyId'),
    __param(0, (0, common_1.Param)('studyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getStudy", null);
__decorate([
    (0, common_1.Get)('pacs/patient/:patientId/studies'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getPatientStudies", null);
__decorate([
    (0, common_1.Post)('pacs/study/:studyId/report'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('studyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "addStudyReport", null);
__decorate([
    (0, common_1.Post)('lis/order'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "createLabOrder", null);
__decorate([
    (0, common_1.Get)('lis/order/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getLabOrder", null);
__decorate([
    (0, common_1.Put)('lis/order/:orderId/result'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "updateLabResult", null);
__decorate([
    (0, common_1.Get)('lis/patient/:patientId/orders'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getPatientLabOrders", null);
__decorate([
    (0, common_1.Post)('payments/process'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "processPayment", null);
__decorate([
    (0, common_1.Get)('payments/:paymentId/status'),
    __param(0, (0, common_1.Param)('paymentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getPaymentStatus", null);
__decorate([
    (0, common_1.Post)('payments/refund'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "processRefund", null);
__decorate([
    (0, common_1.Get)('payments/gateways'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getAvailableGateways", null);
__decorate([
    (0, common_1.Post)('gst/invoice'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "generateGstInvoice", null);
__decorate([
    (0, common_1.Get)('gst/invoice/:invoiceId'),
    __param(0, (0, common_1.Param)('invoiceId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getGstInvoice", null);
__decorate([
    (0, common_1.Post)('gst/credit-note'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "generateCreditNote", null);
__decorate([
    (0, common_1.Get)('gst/reports'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getGstReports", null);
__decorate([
    (0, common_1.Post)('accounting/journal-entry'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "createJournalEntry", null);
__decorate([
    (0, common_1.Get)('accounting/ledger/:accountCode'),
    __param(0, (0, common_1.Param)('accountCode')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getAccountLedger", null);
__decorate([
    (0, common_1.Get)('accounting/trial-balance'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getTrialBalance", null);
__decorate([
    (0, common_1.Get)('accounting/balance-sheet'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getBalanceSheet", null);
__decorate([
    (0, common_1.Get)('accounting/profit-loss'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getProfitLoss", null);
__decorate([
    (0, common_1.Post)('webhooks/:webhookId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('webhookId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Post)('webhooks'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "createWebhook", null);
__decorate([
    (0, common_1.Get)('webhooks'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getWebhooks", null);
__decorate([
    (0, common_1.Put)('webhooks/:webhookId'),
    __param(0, (0, common_1.Param)('webhookId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "updateWebhook", null);
__decorate([
    (0, common_1.Delete)('webhooks/:webhookId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('webhookId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "deleteWebhook", null);
__decorate([
    (0, common_1.Post)('webhooks/:webhookId/test'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('webhookId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "testWebhook", null);
__decorate([
    (0, common_1.Post)('api-keys'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "createApiKey", null);
__decorate([
    (0, common_1.Get)('api-keys'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getApiKeys", null);
__decorate([
    (0, common_1.Put)('api-keys/:apiKeyId'),
    __param(0, (0, common_1.Param)('apiKeyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "updateApiKey", null);
__decorate([
    (0, common_1.Delete)('api-keys/:apiKeyId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('apiKeyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "revokeApiKey", null);
__decorate([
    (0, common_1.Post)('api-keys/:apiKeyId/rotate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('apiKeyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "rotateApiKey", null);
__decorate([
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getIntegrationStatus", null);
__decorate([
    (0, common_1.Get)('configurations'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getIntegrationConfigurations", null);
__decorate([
    (0, common_1.Put)('configurations'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "updateIntegrationConfiguration", null);
__decorate([
    (0, common_1.Post)('sync/fhir'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "syncFhirData", null);
__decorate([
    (0, common_1.Post)('sync/hl7'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "syncHl7Data", null);
__decorate([
    (0, common_1.Get)('sync/status'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getSyncStatus", null);
exports.IntegrationsController = IntegrationsController = __decorate([
    (0, common_1.Controller)('integrations'),
    __metadata("design:paramtypes", [integrations_service_1.IntegrationsService,
        fhir_service_1.FhirService,
        hl7_service_1.Hl7Service,
        pacs_service_1.PacsService,
        lis_service_1.LisService,
        payment_gateway_service_1.PaymentGatewayService,
        gst_service_1.GstService,
        accounting_service_1.AccountingService,
        webhook_service_1.WebhookService,
        api_key_service_1.ApiKeyService])
], IntegrationsController);
//# sourceMappingURL=integrations.controller.js.map