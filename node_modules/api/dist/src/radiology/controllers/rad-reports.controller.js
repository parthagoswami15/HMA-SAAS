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
exports.RadReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const rad_reports_service_1 = require("../services/rad-reports.service");
const rad_reports_dto_1 = require("../dto/rad-reports.dto");
let RadReportsController = class RadReportsController {
    radReportsService;
    constructor(radReportsService) {
        this.radReportsService = radReportsService;
    }
    async create(createDto, req) {
        return this.radReportsService.create(createDto, req.user.id);
    }
    async findAll(filterDto, listDto) {
        return this.radReportsService.findAll(filterDto, listDto);
    }
    async findOne(id) {
        return this.radReportsService.findOne(id);
    }
    async update(id, updateDto) {
        return this.radReportsService.update(id, updateDto);
    }
    async signReport(id, signDto, req) {
        return this.radReportsService.signReport(id, signDto, req.user.id);
    }
    async getReportsByStudy(studyId) {
        return this.radReportsService.getReportsByStudy(studyId);
    }
    async getReportsByPatient(patientId) {
        return this.radReportsService.getReportsByPatient(patientId);
    }
    async getStructuredReportData(reportId) {
        return this.radReportsService.getStructuredReportData(reportId);
    }
    async updateStructuredFindings(id, findings) {
        return this.radReportsService.updateStructuredFindings(id, findings);
    }
    async getStats(req) {
        return this.radReportsService.getStats(req.user.tenantId);
    }
    async remove(id) {
        throw new Error('Delete functionality not implemented');
    }
};
exports.RadReportsController = RadReportsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new radiology report' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Report created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Study not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rad_reports_dto_1.CreateRadReportDto, Object]),
    __metadata("design:returntype", Promise)
], RadReportsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all radiology reports with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reports retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rad_reports_dto_1.RadReportFilterDto,
        rad_reports_dto_1.RadReportListDto]),
    __metadata("design:returntype", Promise)
], RadReportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get radiology report by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RadReportsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update radiology report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, rad_reports_dto_1.UpdateRadReportDto]),
    __metadata("design:returntype", Promise)
], RadReportsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/sign'),
    (0, swagger_1.ApiOperation)({ summary: 'Sign radiology report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report signed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Report cannot be signed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, rad_reports_dto_1.SignRadReportDto, Object]),
    __metadata("design:returntype", Promise)
], RadReportsController.prototype, "signReport", null);
__decorate([
    (0, common_1.Get)('study/:studyId/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reports for a study' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reports retrieved successfully' }),
    __param(0, (0, common_1.Param)('studyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RadReportsController.prototype, "getReportsByStudy", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reports for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reports retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RadReportsController.prototype, "getReportsByPatient", null);
__decorate([
    (0, common_1.Get)(':id/structured-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Get structured report data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Structured data retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RadReportsController.prototype, "getStructuredReportData", null);
__decorate([
    (0, common_1.Put)(':id/structured-findings'),
    (0, swagger_1.ApiOperation)({ summary: 'Update structured findings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Structured findings updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RadReportsController.prototype, "updateStructuredFindings", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reports statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RadReportsController.prototype, "getStats", null);
__decorate([
    Delete(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete radiology report' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Report deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RadReportsController.prototype, "remove", null);
exports.RadReportsController = RadReportsController = __decorate([
    (0, swagger_1.ApiTags)('Radiology - Reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('radiology/reports'),
    __metadata("design:paramtypes", [rad_reports_service_1.RadReportsService])
], RadReportsController);
//# sourceMappingURL=rad-reports.controller.js.map