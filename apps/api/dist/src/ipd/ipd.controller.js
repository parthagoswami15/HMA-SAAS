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
exports.IpdController = void 0;
const common_1 = require("@nestjs/common");
const ipd_service_1 = require("./ipd.service");
const class_validator_1 = require("class-validator");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
class CreateRoomDto {
    code;
    type;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "type", void 0);
class AdmitDto {
    patientId;
    roomId;
    diagnosis;
    notes;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmitDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmitDto.prototype, "roomId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmitDto.prototype, "diagnosis", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmitDto.prototype, "notes", void 0);
let IpdController = class IpdController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    createRoom(tenantId, dto) {
        return this.svc.createRoom(tenantId, dto);
    }
    listRooms(tenantId) { return this.svc.listRooms(tenantId); }
    admit(tenantId, dto) {
        return this.svc.admit(tenantId, dto);
    }
    list(tenantId) { return this.svc.listAdmissions(tenantId); }
    discharge(tenantId, id) { return this.svc.discharge(tenantId, id); }
};
exports.IpdController = IpdController;
__decorate([
    (0, common_1.Post)('rooms'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateRoomDto]),
    __metadata("design:returntype", void 0)
], IpdController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Get)('rooms'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IpdController.prototype, "listRooms", null);
__decorate([
    (0, common_1.Post)('admissions'),
    (0, roles_decorator_1.Roles)(client_1.Role.RECEPTIONIST, client_1.Role.DOCTOR),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AdmitDto]),
    __metadata("design:returntype", void 0)
], IpdController.prototype, "admit", null);
__decorate([
    (0, common_1.Get)('admissions'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IpdController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('admissions/:id/discharge'),
    (0, roles_decorator_1.Roles)(client_1.Role.RECEPTIONIST, client_1.Role.DOCTOR),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], IpdController.prototype, "discharge", null);
exports.IpdController = IpdController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('ipd'),
    __metadata("design:paramtypes", [ipd_service_1.IpdService])
], IpdController);
//# sourceMappingURL=ipd.controller.js.map