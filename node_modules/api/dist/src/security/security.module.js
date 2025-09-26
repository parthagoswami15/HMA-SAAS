"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityModule = void 0;
const common_1 = require("@nestjs/common");
const security_controller_1 = require("./security.controller");
const security_service_1 = require("./security.service");
const authentication_service_1 = require("./services/authentication.service");
const authorization_service_1 = require("./services/authorization.service");
const mfa_service_1 = require("./services/mfa.service");
const encryption_service_1 = require("./services/encryption.service");
const audit_service_1 = require("./services/audit.service");
const session_service_1 = require("./services/session.service");
const device_service_1 = require("./services/device.service");
const ip_service_1 = require("./services/ip.service");
const data_retention_service_1 = require("./services/data-retention.service");
const anomaly_detection_service_1 = require("./services/anomaly-detection.service");
const prisma_module_1 = require("../prisma/prisma.module");
const audit_module_1 = require("../audit/audit.module");
let SecurityModule = class SecurityModule {
};
exports.SecurityModule = SecurityModule;
exports.SecurityModule = SecurityModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, audit_module_1.AuditModule],
        controllers: [security_controller_1.SecurityController],
        providers: [
            security_service_1.SecurityService,
            authentication_service_1.AuthenticationService,
            authorization_service_1.AuthorizationService,
            mfa_service_1.MfaService,
            encryption_service_1.EncryptionService,
            audit_service_1.AuditService,
            session_service_1.SessionService,
            device_service_1.DeviceService,
            ip_service_1.IpService,
            data_retention_service_1.DataRetentionService,
            anomaly_detection_service_1.AnomalyDetectionService,
        ],
        exports: [
            security_service_1.SecurityService,
            authentication_service_1.AuthenticationService,
            authorization_service_1.AuthorizationService,
            mfa_service_1.MfaService,
            encryption_service_1.EncryptionService,
            audit_service_1.AuditService,
            session_service_1.SessionService,
            device_service_1.DeviceService,
            ip_service_1.IpService,
            data_retention_service_1.DataRetentionService,
            anomaly_detection_service_1.AnomalyDetectionService,
        ],
    })
], SecurityModule);
//# sourceMappingURL=security.module.js.map