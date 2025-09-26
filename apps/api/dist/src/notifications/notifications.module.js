"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const notifications_controller_1 = require("./notifications.controller");
const notifications_service_1 = require("./notifications.service");
const sms_service_1 = require("./services/sms.service");
const email_service_1 = require("./services/email.service");
const whatsapp_service_1 = require("./services/whatsapp.service");
const ivr_service_1 = require("./services/ivr.service");
const template_service_1 = require("./services/template.service");
const thread_service_1 = require("./services/thread.service");
const provider_service_1 = require("./services/provider.service");
const scheduler_service_1 = require("./services/scheduler.service");
const prisma_module_1 = require("../prisma/prisma.module");
const audit_module_1 = require("../audit/audit.module");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, audit_module_1.AuditModule],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [
            notifications_service_1.NotificationsService,
            sms_service_1.SmsService,
            email_service_1.EmailService,
            whatsapp_service_1.WhatsAppService,
            ivr_service_1.IvrService,
            template_service_1.NotificationTemplateService,
            thread_service_1.NotificationThreadService,
            provider_service_1.NotificationProviderService,
            scheduler_service_1.NotificationSchedulerService,
        ],
        exports: [
            notifications_service_1.NotificationsService,
            sms_service_1.SmsService,
            email_service_1.EmailService,
            whatsapp_service_1.WhatsAppService,
            ivr_service_1.IvrService,
            template_service_1.NotificationTemplateService,
            thread_service_1.NotificationThreadService,
        ],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map