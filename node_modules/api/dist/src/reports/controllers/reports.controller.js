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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const reports_service_1 = require("../services/reports.service");
const analytics_service_1 = require("../services/analytics.service");
const export_service_1 = require("../services/export.service");
const dashboard_service_1 = require("../services/dashboard.service");
const reports_dto_1 = require("../dto/reports.dto");
let ReportsController = class ReportsController {
    reportsService;
    analyticsService;
    exportService;
    dashboardService;
    constructor(reportsService, analyticsService, exportService, dashboardService) {
        this.reportsService = reportsService;
        this.analyticsService = analyticsService;
        this.exportService = exportService;
        this.dashboardService = dashboardService;
    }
    async createReport(createReportDto, req) {
        const tenantId = req.user.tenantId;
        const userId = req.user.id;
        return this.reportsService.createReport(tenantId, userId, createReportDto);
    }
    async getReports(query, req) {
        const tenantId = req.user.tenantId;
        const { category, type, search, page = 1, limit = 10 } = query;
        return this.reportsService.getReports(tenantId, {
            category,
            type,
            search,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    }
    async getReport(id, req) {
        const tenantId = req.user.tenantId;
        return this.reportsService.getReportById(tenantId, id);
    }
    async updateReport(id, updateReportDto, req) {
        const tenantId = req.user.tenantId;
        const userId = req.user.id;
        return this.reportsService.updateReport(tenantId, id, userId, updateReportDto);
    }
    async deleteReport(id, req) {
        const tenantId = req.user.tenantId;
        await this.reportsService.deleteReport(tenantId, id);
    }
    async executeReport(id, filters, req) {
        const tenantId = req.user.tenantId;
        return this.reportsService.executeReport(tenantId, id, filters);
    }
    async scheduleReport(id, scheduleDto, req) {
        const tenantId = req.user.tenantId;
        const userId = req.user.id;
        return this.reportsService.scheduleReport(tenantId, id, userId, scheduleDto);
    }
    async getReportSchedules(id, req) {
        const tenantId = req.user.tenantId;
        return this.reportsService.getReportSchedules(tenantId, id);
    }
    async deleteSchedule(scheduleId, req) {
        const tenantId = req.user.tenantId;
        await this.reportsService.deleteSchedule(tenantId, scheduleId);
    }
    async getDailyCollections(query, req) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getDailyCollections(tenantId, query);
    }
    async getRevenueAnalysis(query, req) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getRevenueAnalysis(tenantId, query);
    }
    async getGSTReport(query, req) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getGSTReport(tenantId, query);
    }
    async getAgingAnalysis(query, req) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getAgingAnalysis(tenantId, query);
    }
    async getCaseMix(query, req) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getCaseMixAnalysis(tenantId, query);
    }
    async getInfectionRates(query, req) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getInfectionRates(tenantId, query);
    }
    async getReadmissions(query, req) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getReadmissionsAnalysis(tenantId, query);
    }
    async getTurnaroundTimes(query, req) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getTurnaroundTimes(tenantId, query);
    }
    async getOccupancy(query, req) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getOccupancyReport(tenantId, query);
    }
    async getLengthOfStay(query, req) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getLengthOfStayAnalysis(tenantId, query);
    }
    async getBedTurnover(query, req) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getBedTurnoverAnalysis(tenantId, query);
    }
    async getPharmacyExpiry(query, req) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getPharmacyExpiryReport(tenantId, query);
    }
    async getPatientAcquisition(query, req) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getPatientAcquisition(tenantId, query);
    }
    async getPatientRetention(query, req) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getPatientRetention(tenantId, query);
    }
    async getNPS(query, req) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getNPSAnalysis(tenantId, query);
    }
    async getReferralSources(query, req) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getReferralSourcesAnalysis(tenantId, query);
    }
    async createDashboard(createDashboardDto, req) {
        const tenantId = req.user.tenantId;
        const userId = req.user.id;
        return this.dashboardService.createDashboard(tenantId, userId, createDashboardDto);
    }
    async getDashboards(query, req) {
        const tenantId = req.user.tenantId;
        const { search, page = 1, limit = 10 } = query;
        return this.dashboardService.getDashboards(tenantId, {
            search,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    }
    async getDashboard(id, req) {
        const tenantId = req.user.tenantId;
        return this.dashboardService.getDashboard(tenantId, id);
    }
    async updateDashboard(id, updateDashboardDto, req) {
        const tenantId = req.user.tenantId;
        const userId = req.user.id;
        return this.dashboardService.updateDashboard(tenantId, id, userId, updateDashboardDto);
    }
    async deleteDashboard(id, req) {
        const tenantId = req.user.tenantId;
        await this.dashboardService.deleteDashboard(tenantId, id);
    }
    async exportReport(exportRequest, req) {
        const tenantId = req.user.tenantId;
        const userId = req.user.id;
        return this.exportService.exportReport(tenantId, userId, exportRequest);
    }
    async downloadExport(exportId, req) {
        const tenantId = req.user.tenantId;
        const file = await this.exportService.downloadExport(tenantId, exportId);
        return new common_1.StreamableFile(file.buffer, {
            disposition: `attachment; filename="${file.fileName}"`,
            type: file.mimeType,
        });
    }
    async getExportStatus(exportId, req) {
        const tenantId = req.user.tenantId;
        return this.exportService.getExportStatus(tenantId, exportId);
    }
    async getAnalyticsSummary(query, req) {
        const tenantId = req.user.tenantId;
        const { dateRange, metrics } = query;
        return this.analyticsService.getAnalyticsSummary(tenantId, {
            dateRange,
            metrics: metrics ? metrics.split(',') : undefined,
        });
    }
    async getTrendAnalysis(query, req) {
        const tenantId = req.user.tenantId;
        const { metric, period, groupBy } = query;
        return this.analyticsService.getTrendAnalysis(tenantId, metric, period, groupBy);
    }
    async getKPIDashboard(query, req) {
        const tenantId = req.user.tenantId;
        const { category } = query;
        return this.analyticsService.getKPIDashboard(tenantId, category);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER', 'DOCTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new report configuration' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Report created successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.CreateReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "createReport", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reports for tenant' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, enum: ['FINANCIAL', 'CLINICAL', 'OPERATIONAL', 'PATIENT', 'CUSTOM'] }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: ['TABULAR', 'CHART', 'DASHBOARD', 'KPI', 'TREND'] }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReports", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get report by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report retrieved successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReport", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    (0, swagger_1.ApiOperation)({ summary: 'Update report configuration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report updated successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reports_dto_1.UpdateReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "updateReport", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete report configuration' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Report deleted successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "deleteReport", null);
__decorate([
    (0, common_1.Post)(':id/execute'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute report and get data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report executed successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "executeReport", null);
__decorate([
    (0, common_1.Post)(':id/schedule'),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    (0, swagger_1.ApiOperation)({ summary: 'Schedule report for email delivery' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Report scheduled successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reports_dto_1.ReportScheduleDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "scheduleReport", null);
__decorate([
    (0, common_1.Get)(':id/schedules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get report schedules' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReportSchedules", null);
__decorate([
    (0, common_1.Delete)('schedule/:scheduleId'),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete report schedule' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('scheduleId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "deleteSchedule", null);
__decorate([
    (0, common_1.Get)('financial/daily-collections'),
    (0, swagger_1.ApiOperation)({ summary: 'Get daily collections report' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.FinancialReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDailyCollections", null);
__decorate([
    (0, common_1.Get)('financial/revenue-analysis'),
    (0, swagger_1.ApiOperation)({ summary: 'Get revenue analysis report' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.FinancialReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getRevenueAnalysis", null);
__decorate([
    (0, common_1.Get)('financial/gst-report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get GST report' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.FinancialReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getGSTReport", null);
__decorate([
    (0, common_1.Get)('financial/aging-analysis'),
    (0, swagger_1.ApiOperation)({ summary: 'Get aging analysis report' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.FinancialReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAgingAnalysis", null);
__decorate([
    (0, common_1.Get)('clinical/case-mix'),
    (0, swagger_1.ApiOperation)({ summary: 'Get case mix analysis' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.ClinicalReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getCaseMix", null);
__decorate([
    (0, common_1.Get)('clinical/infection-rates'),
    (0, swagger_1.ApiOperation)({ summary: 'Get infection rates report' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.ClinicalReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getInfectionRates", null);
__decorate([
    (0, common_1.Get)('clinical/readmissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get readmissions report' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.ClinicalReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReadmissions", null);
__decorate([
    (0, common_1.Get)('clinical/turnaround-times'),
    (0, swagger_1.ApiOperation)({ summary: 'Get turnaround times report' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.ClinicalReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getTurnaroundTimes", null);
__decorate([
    (0, common_1.Get)('operational/occupancy'),
    (0, swagger_1.ApiOperation)({ summary: 'Get occupancy report' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.OperationalReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getOccupancy", null);
__decorate([
    (0, common_1.Get)('operational/length-of-stay'),
    (0, swagger_1.ApiOperation)({ summary: 'Get length of stay report' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.OperationalReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getLengthOfStay", null);
__decorate([
    (0, common_1.Get)('operational/bed-turnover'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bed turnover report' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.OperationalReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getBedTurnover", null);
__decorate([
    (0, common_1.Get)('operational/pharmacy-expiry'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pharmacy expiry report' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.OperationalReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getPharmacyExpiry", null);
__decorate([
    (0, common_1.Get)('patient/acquisition'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient acquisition report' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.PatientReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getPatientAcquisition", null);
__decorate([
    (0, common_1.Get)('patient/retention'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient retention report' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.PatientReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getPatientRetention", null);
__decorate([
    (0, common_1.Get)('patient/nps'),
    (0, swagger_1.ApiOperation)({ summary: 'Get NPS report' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.PatientReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getNPS", null);
__decorate([
    (0, common_1.Get)('patient/referrals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get referral sources report' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.PatientReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReferralSources", null);
__decorate([
    (0, common_1.Post)('dashboards'),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    (0, swagger_1.ApiOperation)({ summary: 'Create dashboard' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.CreateDashboardDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "createDashboard", null);
__decorate([
    (0, common_1.Get)('dashboards'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all dashboards' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDashboards", null);
__decorate([
    (0, common_1.Get)('dashboards/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Put)('dashboards/:id'),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    (0, swagger_1.ApiOperation)({ summary: 'Update dashboard' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reports_dto_1.UpdateDashboardDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "updateDashboard", null);
__decorate([
    (0, common_1.Delete)('dashboards/:id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete dashboard' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "deleteDashboard", null);
__decorate([
    (0, common_1.Post)('export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export report data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Export initiated successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.ExportRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportReport", null);
__decorate([
    (0, common_1.Get)('export/:exportId'),
    (0, swagger_1.ApiOperation)({ summary: 'Download exported file' }),
    __param(0, (0, common_1.Param)('exportId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "downloadExport", null);
__decorate([
    (0, common_1.Get)('export/:exportId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get export status' }),
    __param(0, (0, common_1.Param)('exportId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getExportStatus", null);
__decorate([
    (0, common_1.Get)('analytics/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get analytics summary' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAnalyticsSummary", null);
__decorate([
    (0, common_1.Get)('analytics/trends'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trend analysis' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getTrendAnalysis", null);
__decorate([
    (0, common_1.Get)('analytics/kpi'),
    (0, swagger_1.ApiOperation)({ summary: 'Get KPI dashboard' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getKPIDashboard", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports & Analytics'),
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService,
        analytics_service_1.AnalyticsService,
        export_service_1.ExportService,
        dashboard_service_1.DashboardService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map