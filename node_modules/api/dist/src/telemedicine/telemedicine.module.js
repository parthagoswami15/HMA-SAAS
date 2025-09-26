"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemedicineModule = void 0;
const common_1 = require("@nestjs/common");
const telemedicine_controller_1 = require("./telemedicine.controller");
const telemedicine_service_1 = require("./telemedicine.service");
const video_service_1 = require("./services/video.service");
const scheduling_service_1 = require("./services/scheduling.service");
const prescription_service_1 = require("./services/prescription.service");
const payment_service_1 = require("./services/payment.service");
const file_service_1 = require("./services/file.service");
const state_restriction_service_1 = require("./services/state-restriction.service");
const identity_verification_service_1 = require("./services/identity-verification.service");
const bandwidth_service_1 = require("./services/bandwidth.service");
const notification_service_1 = require("./services/notification.service");
const prisma_module_1 = require("../prisma/prisma.module");
const audit_module_1 = require("../audit/audit.module");
const compliance_module_1 = require("../compliance/compliance.module");
const notifications_module_1 = require("../notifications/notifications.module");
let TelemedicineModule = class TelemedicineModule {
};
exports.TelemedicineModule = TelemedicineModule;
exports.TelemedicineModule = TelemedicineModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, audit_module_1.AuditModule, compliance_module_1.ComplianceModule, notifications_module_1.NotificationsModule],
        controllers: [telemedicine_controller_1.TelemedicineController],
        providers: [
            telemedicine_service_1.TelemedicineService,
            video_service_1.VideoService,
            scheduling_service_1.SchedulingService,
            prescription_service_1.PrescriptionService,
            payment_service_1.PaymentService,
            file_service_1.FileService,
            state_restriction_service_1.StateRestrictionService,
            identity_verification_service_1.IdentityVerificationService,
            bandwidth_service_1.BandwidthService,
            notification_service_1.NotificationService,
        ],
        exports: [
            telemedicine_service_1.TelemedicineService,
            video_service_1.VideoService,
            scheduling_service_1.SchedulingService,
            prescription_service_1.PrescriptionService,
            payment_service_1.PaymentService,
            file_service_1.FileService,
            state_restriction_service_1.StateRestrictionService,
            identity_verification_service_1.IdentityVerificationService,
            bandwidth_service_1.BandwidthService,
        ],
    })
], TelemedicineModule);
//# sourceMappingURL=telemedicine.module.js.map