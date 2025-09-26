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
exports.BedWardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../users/enums/user-role.enum");
const bed_ward_service_1 = require("../services/bed-ward.service");
const create_ward_dto_1 = require("../dto/create-ward.dto");
const update_ward_dto_1 = require("../dto/update-ward.dto");
const create_bed_dto_1 = require("../dto/create-bed.dto");
const update_bed_dto_1 = require("../dto/update-bed.dto");
const bed_status_enum_1 = require("../enums/bed-status.enum");
const bed_class_enum_1 = require("../enums/bed-class.enum");
let BedWardController = class BedWardController {
    bedWardService;
    constructor(bedWardService) {
        this.bedWardService = bedWardService;
    }
    async createWard(createWardDto) {
        return this.bedWardService.createWard(createWardDto);
    }
    async getWards(includeBeds = false) {
        return this.bedWardService.getWards(includeBeds);
    }
    async getWardById(wardId, includeBeds = true) {
        return this.bedWardService.getWardById(wardId, includeBeds);
    }
    async updateWard(wardId, updateWardDto) {
        return this.bedWardService.updateWard(wardId, updateWardDto);
    }
    async deleteWard(wardId) {
        return this.bedWardService.deleteWard(wardId);
    }
    async addBedToWard(wardId, createBedDto) {
        return this.bedWardService.addBedToWard(wardId, createBedDto);
    }
    async getAvailableBeds(wardId, bedClass) {
        return this.bedWardService.getAvailableBeds({ wardId, bedClass });
    }
    async getOccupiedBeds(wardId) {
        return this.bedWardService.getOccupiedBeds(wardId);
    }
    async getBedById(bedId) {
        return this.bedWardService.getBedById(bedId);
    }
    async updateBed(bedId, updateBedDto) {
        return this.bedWardService.updateBed(bedId, updateBedDto);
    }
    async removeBed(bedId) {
        return this.bedWardService.removeBed(bedId);
    }
    async updateBedStatus(bedId, status, updatedById, notes) {
        if (!Object.values(bed_status_enum_1.BedStatus).includes(status)) {
            throw new common_1.BadRequestException('Invalid bed status');
        }
        return this.bedWardService.updateBedStatus(bedId, status, updatedById, notes);
    }
    async getBedStatistics() {
        return this.bedWardService.getBedStatistics();
    }
    async getBedOccupancyReport(wardId, startDate, endDate) {
        return this.bedWardService.getBedOccupancyReport({
            wardId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
    }
};
exports.BedWardController = BedWardController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new ward' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Ward created successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.HOSPITAL_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ward_dto_1.CreateWardDto]),
    __metadata("design:returntype", Promise)
], BedWardController.prototype, "createWard", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all wards' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of wards' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Query)('includeBeds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], BedWardController.prototype, "getWards", null);
__decorate([
    (0, common_1.Get)(':wardId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ward by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ward details' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('wardId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('includeBeds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], BedWardController.prototype, "getWardById", null);
__decorate([
    (0, common_1.Put)(':wardId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update ward details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ward updated successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.HOSPITAL_ADMIN),
    __param(0, (0, common_1.Param)('wardId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ward_dto_1.UpdateWardDto]),
    __metadata("design:returntype", Promise)
], BedWardController.prototype, "updateWard", null);
__decorate([
    (0, common_1.Delete)(':wardId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a ward' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ward deleted successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.HOSPITAL_ADMIN),
    __param(0, (0, common_1.Param)('wardId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BedWardController.prototype, "deleteWard", null);
__decorate([
    (0, common_1.Post)(':wardId/beds'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new bed to a ward' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Bed added successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.HOSPITAL_ADMIN, user_role_enum_1.UserRole.NURSE_IN_CHARGE),
    __param(0, (0, common_1.Param)('wardId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_bed_dto_1.CreateBedDto]),
    __metadata("design:returntype", Promise)
], BedWardController.prototype, "addBedToWard", null);
__decorate([
    (0, common_1.Get)('beds/available'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available beds' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of available beds' }),
    (0, swagger_1.ApiQuery)({ name: 'wardId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'bedClass', required: false, enum: bed_class_enum_1.BedClass }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Query)('wardId')),
    __param(1, (0, common_1.Query)('bedClass')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BedWardController.prototype, "getAvailableBeds", null);
__decorate([
    (0, common_1.Get)('beds/occupied'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all occupied beds' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of occupied beds' }),
    (0, swagger_1.ApiQuery)({ name: 'wardId', required: false, type: String }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Query)('wardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BedWardController.prototype, "getOccupiedBeds", null);
__decorate([
    (0, common_1.Get)('beds/:bedId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bed by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bed details' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('bedId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BedWardController.prototype, "getBedById", null);
__decorate([
    (0, common_1.Put)('beds/:bedId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update bed details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bed updated successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.HOSPITAL_ADMIN, user_role_enum_1.UserRole.NURSE_IN_CHARGE),
    __param(0, (0, common_1.Param)('bedId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_bed_dto_1.UpdateBedDto]),
    __metadata("design:returntype", Promise)
], BedWardController.prototype, "updateBed", null);
__decorate([
    (0, common_1.Delete)('beds/:bedId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a bed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bed removed successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.HOSPITAL_ADMIN),
    __param(0, (0, common_1.Param)('bedId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BedWardController.prototype, "removeBed", null);
__decorate([
    (0, common_1.Put)('beds/:bedId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update bed status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bed status updated' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.HOUSEKEEPING),
    __param(0, (0, common_1.Param)('bedId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('updatedById')),
    __param(3, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], BedWardController.prototype, "updateBedStatus", null);
__decorate([
    (0, common_1.Get)('beds/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bed statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bed statistics' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.RECEPTIONIST),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BedWardController.prototype, "getBedStatistics", null);
__decorate([
    (0, common_1.Get)('beds/occupancy'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bed occupancy report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bed occupancy report' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Query)('wardId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], BedWardController.prototype, "getBedOccupancyReport", null);
exports.BedWardController = BedWardController = __decorate([
    (0, common_1.Controller)('ipd/wards'),
    (0, swagger_1.ApiTags)('IPD - Bed & Ward Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:paramtypes", [bed_ward_service_1.BedWardService])
], BedWardController);
//# sourceMappingURL=bed-ward.controller.js.map