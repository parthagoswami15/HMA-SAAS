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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../users/enums/user-role.enum");
const ot_service_1 = require("../services/ot.service");
const create_surgery_dto_1 = require("../dto/create-surgery.dto");
const update_surgery_dto_1 = require("../dto/update-surgery.dto");
const surgery_status_enum_1 = require("../enums/surgery-status.enum");
const create_ot_theater_dto_1 = require("../dto/create-ot-theater.dto");
const update_ot_theater_dto_1 = require("../dto/update-ot-theater.dto");
let OTController = class OTController {
    otService;
    constructor(otService) {
        this.otService = otService;
    }
    async scheduleSurgery(createSurgeryDto) {
        return this.otService.scheduleSurgery(createSurgeryDto);
    }
    async getSurgeries(status, surgeonId, patientId, startDate, endDate) {
        return this.otService.getSurgeries({
            status,
            surgeonId,
            patientId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
    }
    async getSurgeryById(surgeryId) {
        return this.otService.getSurgeryById(surgeryId);
    }
    async updateSurgery(surgeryId, updateSurgeryDto) {
        return this.otService.updateSurgery(surgeryId, updateSurgeryDto);
    }
    async updateSurgeryStatus(surgeryId, status, updatedById, notes) {
        if (!Object.values(surgery_status_enum_1.SurgeryStatus).includes(status)) {
            throw new common_1.BadRequestException('Invalid surgery status');
        }
        return this.otService.updateSurgeryStatus(surgeryId, status, updatedById, notes);
    }
    async getPatientSurgeries(patientId) {
        return this.otService.getPatientSurgeries(patientId);
    }
    async addTheater(createTheaterDto) {
        return this.otService.addTheater(createTheaterDto);
    }
    async getTheaters(includeSchedule = false) {
        return this.otService.getTheaters(includeSchedule);
    }
    async getTheaterById(theaterId, includeSchedule = true) {
        return this.otService.getTheaterById(theaterId, includeSchedule);
    }
    async updateTheater(theaterId, updateTheaterDto) {
        return this.otService.updateTheater(theaterId, updateTheaterDto);
    }
    async checkTheaterAvailability(theaterId, startTime, endTime) {
        return this.otService.checkTheaterAvailability(theaterId, new Date(startTime), new Date(endTime));
    }
    async getUpcomingSurgeries(days = 7) {
        return this.otService.getUpcomingSurgeries(days);
    }
    async getSurgeonSchedule(surgeonId, startDate, endDate) {
        return this.otService.getSurgeonSchedule({
            surgeonId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
    }
    async addSurgeryNotes(surgeryId, notes, addedById, isCritical = false) {
        return this.otService.addSurgeryNotes(surgeryId, notes, addedById, isCritical);
    }
    async recordComplications(surgeryId, description, severity, actionTaken, recordedById) {
        return this.otService.recordComplications(surgeryId, description, severity, actionTaken, recordedById);
    }
    async getOTDashboardStats() {
        return this.otService.getOTDashboardStats();
    }
};
exports.OTController = OTController;
__decorate([
    (0, common_1.Post)('surgeries'),
    (0, swagger_1.ApiOperation)({ summary: 'Schedule a new surgery' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Surgery scheduled successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.SURGEON),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_surgery_dto_1.CreateSurgeryDto !== "undefined" && create_surgery_dto_1.CreateSurgeryDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "scheduleSurgery", null);
__decorate([
    (0, common_1.Get)('surgeries'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all surgeries with filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of surgeries' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: surgery_status_enum_1.SurgeryStatus }),
    (0, swagger_1.ApiQuery)({ name: 'surgeonId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: Date }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.SURGEON, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ANESTHETIST),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('surgeonId')),
    __param(2, (0, common_1.Query)('patientId')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "getSurgeries", null);
__decorate([
    (0, common_1.Get)('surgeries/:surgeryId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get surgery details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery details' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.SURGEON, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ANESTHETIST),
    __param(0, (0, common_1.Param)('surgeryId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "getSurgeryById", null);
__decorate([
    (0, common_1.Put)('surgeries/:surgeryId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update surgery details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery updated successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.SURGEON),
    __param(0, (0, common_1.Param)('surgeryId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_surgery_dto_1.UpdateSurgeryDto !== "undefined" && update_surgery_dto_1.UpdateSurgeryDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "updateSurgery", null);
__decorate([
    (0, common_1.Put)('surgeries/:surgeryId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update surgery status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery status updated' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.SURGEON, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ANESTHETIST),
    __param(0, (0, common_1.Param)('surgeryId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('updatedById')),
    __param(3, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "updateSurgeryStatus", null);
__decorate([
    (0, common_1.Get)('surgeries/patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient\'s surgery history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of patient surgeries' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.SURGEON, user_role_enum_1.UserRole.NURSE),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "getPatientSurgeries", null);
__decorate([
    (0, common_1.Post)('theaters'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new operation theater' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Operation theater added successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.HOSPITAL_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof create_ot_theater_dto_1.CreateOTTheaterDto !== "undefined" && create_ot_theater_dto_1.CreateOTTheaterDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "addTheater", null);
__decorate([
    (0, common_1.Get)('theaters'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all operation theaters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of operation theaters' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.SURGEON, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ANESTHETIST),
    __param(0, (0, common_1.Query)('includeSchedule')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "getTheaters", null);
__decorate([
    (0, common_1.Get)('theaters/:theaterId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get operation theater by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Operation theater details' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.SURGEON, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ANESTHETIST),
    __param(0, (0, common_1.Param)('theaterId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('includeSchedule')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "getTheaterById", null);
__decorate([
    (0, common_1.Put)('theaters/:theaterId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update operation theater details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Operation theater updated successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.HOSPITAL_ADMIN),
    __param(0, (0, common_1.Param)('theaterId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof update_ot_theater_dto_1.UpdateOTTheaterDto !== "undefined" && update_ot_theater_dto_1.UpdateOTTheaterDto) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "updateTheater", null);
__decorate([
    (0, common_1.Get)('theaters/:theaterId/availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Check theater availability' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Theater availability status' }),
    (0, swagger_1.ApiQuery)({ name: 'startTime', required: true, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'endTime', required: true, type: Date }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.SURGEON, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ANESTHETIST),
    __param(0, (0, common_1.Param)('theaterId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('startTime')),
    __param(2, (0, common_1.Query)('endTime')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "checkTheaterAvailability", null);
__decorate([
    (0, common_1.Get)('surgeries/upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Get upcoming surgeries' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of upcoming surgeries' }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, type: Number, description: 'Number of days to look ahead (default: 7)' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.SURGEON, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ANESTHETIST),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "getUpcomingSurgeries", null);
__decorate([
    (0, common_1.Get)('surgeries/surgeon/:surgeonId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get surgeon\'s schedule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgeon\'s surgery schedule' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: Date }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.SURGEON, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ANESTHETIST),
    __param(0, (0, common_1.Param)('surgeonId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "getSurgeonSchedule", null);
__decorate([
    (0, common_1.Post)('surgeries/:surgeryId/notes'),
    (0, swagger_1.ApiOperation)({ summary: 'Add notes to a surgery' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Notes added successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.SURGEON, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ANESTHETIST),
    __param(0, (0, common_1.Param)('surgeryId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('notes')),
    __param(2, (0, common_1.Body)('addedById')),
    __param(3, (0, common_1.Body)('isCritical')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "addSurgeryNotes", null);
__decorate([
    (0, common_1.Post)('surgeries/:surgeryId/complications'),
    (0, swagger_1.ApiOperation)({ summary: 'Record surgery complications' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Complications recorded successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.SURGEON),
    __param(0, (0, common_1.Param)('surgeryId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('description')),
    __param(2, (0, common_1.Body)('severity')),
    __param(3, (0, common_1.Body)('actionTaken')),
    __param(4, (0, common_1.Body)('recordedById')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], OTController.prototype, "recordComplications", null);
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get OT dashboard statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OT dashboard statistics' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.SURGEON, user_role_enum_1.UserRole.OT_MANAGER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OTController.prototype, "getOTDashboardStats", null);
exports.OTController = OTController = __decorate([
    (0, common_1.Controller)('ipd/ot'),
    (0, swagger_1.ApiTags)('IPD - Operation Theater'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:paramtypes", [typeof (_a = typeof ot_service_1.OTService !== "undefined" && ot_service_1.OTService) === "function" ? _a : Object])
], OTController);
//# sourceMappingURL=ot.controller.js.map