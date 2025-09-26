"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsModule = void 0;
const common_1 = require("@nestjs/common");
const integrations_controller_1 = require("./integrations.controller");
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
const prisma_module_1 = require("../prisma/prisma.module");
const audit_module_1 = require("../audit/audit.module");
let IntegrationsModule = class IntegrationsModule {
};
exports.IntegrationsModule = IntegrationsModule;
exports.IntegrationsModule = IntegrationsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, audit_module_1.AuditModule],
        controllers: [integrations_controller_1.IntegrationsController],
        providers: [
            integrations_service_1.IntegrationsService,
            fhir_service_1.FhirService,
            hl7_service_1.Hl7Service,
            pacs_service_1.PacsService,
            lis_service_1.LisService,
            payment_gateway_service_1.PaymentGatewayService,
            gst_service_1.GstService,
            accounting_service_1.AccountingService,
            webhook_service_1.WebhookService,
            api_key_service_1.ApiKeyService,
        ],
        exports: [
            integrations_service_1.IntegrationsService,
            fhir_service_1.FhirService,
            hl7_service_1.Hl7Service,
            pacs_service_1.PacsService,
            lis_service_1.LisService,
            payment_gateway_service_1.PaymentGatewayService,
            gst_service_1.GstService,
            accounting_service_1.AccountingService,
            webhook_service_1.WebhookService,
            api_key_service_1.ApiKeyService,
        ],
    })
], IntegrationsModule);
//# sourceMappingURL=integrations.module.js.map