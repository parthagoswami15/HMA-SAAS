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
exports.SchedulingController = void 0;
const common_1 = require("@nestjs/common");
const scheduling_service_1 = require("./scheduling.service");
const class_validator_1 = require("class-validator");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
class CreateScheduleDto {
    doctorId;
    dayOfWeek;
    startTime;
    endTime;
    location;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "doctorId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], CreateScheduleDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "location", void 0);
class CreateAppointmentDto {
    patientId;
    doctorId;
    startsAt;
    endsAt;
    notes;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "doctorId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "startsAt", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "endsAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "notes", void 0);
let SchedulingController = class SchedulingController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    createSchedule(tenantId, dto) {
        return this.svc.createSchedule(tenantId, dto);
    }
    listSchedules(tenantId) {
        return this.svc.listSchedules(tenantId);
    }
    createAppointment(tenantId, dto) {
        return this.svc.createAppointment(tenantId, { ...dto, startsAt: new Date(dto.startsAt), endsAt: new Date(dto.endsAt) });
    }
    listAppointments(tenantId) {
        return this.svc.listAppointments(tenantId);
    }
    updateAppointment(tenantId, id, dto) {
        const payload = { ...dto };
        if (dto.startsAt)
            payload.startsAt = new Date(dto.startsAt);
        if (dto.endsAt)
            payload.endsAt = new Date(dto.endsAt);
        return this.svc.updateAppointment(tenantId, id, payload);
    }
    cancel(tenantId, id) {
        return this.svc.cancelAppointment(tenantId, id);
    }
};
exports.SchedulingController = SchedulingController;
__decorate([
    (0, common_1.Post)('schedules'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateScheduleDto]),
    __metadata("design:returntype", void 0)
], SchedulingController.prototype, "createSchedule", null);
__decorate([
    (0, common_1.Get)('schedules'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchedulingController.prototype, "listSchedules", null);
__decorate([
    (0, common_1.Post)('appointments'),
    (0, roles_decorator_1.Roles)(client_1.Role.RECEPTIONIST, client_1.Role.DOCTOR),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateAppointmentDto]),
    __metadata("design:returntype", void 0)
], SchedulingController.prototype, "createAppointment", null);
__decorate([
    (0, common_1.Get)('appointments'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchedulingController.prototype, "listAppointments", null);
__decorate([
    (0, common_1.Patch)('appointments/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.RECEPTIONIST, client_1.Role.DOCTOR),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], SchedulingController.prototype, "updateAppointment", null);
__decorate([
    (0, common_1.Delete)('appointments/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.RECEPTIONIST, client_1.Role.DOCTOR),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SchedulingController.prototype, "cancel", null);
exports.SchedulingController = SchedulingController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('scheduling'),
    __metadata("design:paramtypes", [scheduling_service_1.SchedulingService])
], SchedulingController);
//# sourceMappingURL=scheduling.controller.js.map