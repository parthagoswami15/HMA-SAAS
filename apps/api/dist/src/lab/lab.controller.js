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
exports.LabController = void 0;
const common_1 = require("@nestjs/common");
const lab_service_1 = require("./lab.service");
const class_validator_1 = require("class-validator");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const client_1 = require("@prisma/client");
class CreateTestDto {
    name;
    code;
    description;
    priceCents;
    currency;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTestDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTestDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTestDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTestDto.prototype, "priceCents", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTestDto.prototype, "currency", void 0);
class OrderTestDto {
    patientId;
    testId;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderTestDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderTestDto.prototype, "testId", void 0);
let LabController = class LabController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    createTest(tenantId, dto) {
        return this.svc.createTest(tenantId, dto);
    }
    listTests(tenantId) {
        return this.svc.listTests(tenantId);
    }
    order(tenantId, dto) {
        return this.svc.orderTest(tenantId, dto);
    }
    listOrders(tenantId) {
        return this.svc.listOrders(tenantId);
    }
};
exports.LabController = LabController;
__decorate([
    (0, common_1.Post)('tests'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateTestDto]),
    __metadata("design:returntype", void 0)
], LabController.prototype, "createTest", null);
__decorate([
    (0, common_1.Get)('tests'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LabController.prototype, "listTests", null);
__decorate([
    (0, common_1.Post)('orders'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR, client_1.Role.LAB_TECHNICIAN),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, OrderTestDto]),
    __metadata("design:returntype", void 0)
], LabController.prototype, "order", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LabController.prototype, "listOrders", null);
exports.LabController = LabController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('lab'),
    __metadata("design:paramtypes", [lab_service_1.LabService])
], LabController);
//# sourceMappingURL=lab.controller.js.map