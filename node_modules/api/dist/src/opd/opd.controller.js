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
exports.OpdController = void 0;
const common_1 = require("@nestjs/common");
const opd_service_1 = require("./opd.service");
const class_validator_1 = require("class-validator");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
class CreateEncounterDto {
    patientId;
    doctorId;
    type;
    diagnosis;
    notes;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "doctorId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "diagnosis", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "notes", void 0);
let OpdController = class OpdController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    create(tenantId, dto) {
        return this.svc.createEncounter(tenantId, dto);
    }
    list(tenantId) { return this.svc.listEncounters(tenantId); }
    update(tenantId, id, dto) {
        return this.svc.updateEncounter(tenantId, id, dto);
    }
};
exports.OpdController = OpdController;
__decorate([
    (0, common_1.Post)('encounters'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateEncounterDto]),
    __metadata("design:returntype", void 0)
], OpdController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('encounters'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OpdController.prototype, "list", null);
__decorate([
    (0, common_1.Patch)('encounters/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], OpdController.prototype, "update", null);
exports.OpdController = OpdController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('opd'),
    __metadata("design:paramtypes", [opd_service_1.OpdService])
], OpdController);
//# sourceMappingURL=opd.controller.js.map