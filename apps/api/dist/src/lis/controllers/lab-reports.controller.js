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
exports.LabReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lab_reports_service_1 = require("../services/lab-reports.service");
const lab_reports_dto_1 = require("../dto/lab-reports.dto");
const lab_auth_guard_1 = require("../guards/lab-auth.guard");
let LabReportsController = class LabReportsController {
    labReportsService;
    constructor(labReportsService) {
        this.labReportsService = labReportsService;
    }
    async generatePatientReport(dto) {
        const report = await this.labReportsService.generatePatientReport(dto.orderId);
        return {
            ...report,
            generatedAt: new Date(),
        };
    }
    async generateCumulativeReport(dto) {
        const report = await this.labReportsService.generateCumulativeReport(dto.patientId, dto.startDate, dto.endDate);
        return {
            ...report,
            generatedAt: new Date(),
        };
    }
    async generateWorkloadReport(dto) {
        return this.labReportsService.generateWorkloadReport(dto.tenantId, dto.startDate, dto.endDate);
    }
    async generateQCReport(dto) {
        return this.labReportsService.generateQCReport(dto.analyzerId, dto.startDate, dto.endDate);
    }
    async exportReport(format, dto, res) {
        const buffer = await this.labReportsService.exportReportToPDF(dto.reportId, format);
        res.set({
            'Content-Type': this.getContentType(format),
            'Content-Disposition': `attachment; filename="lab-report-${dto.reportId}.${format.toLowerCase()}"`,
        });
        res.send(buffer);
    }
    async getPatientReport(orderId) {
        const report = await this.labReportsService.generatePatientReport(orderId);
        return {
            ...report,
            generatedAt: new Date(),
        };
    }
    async getCumulativeReport(patientId, startDate, endDate) {
        const report = await this.labReportsService.generateCumulativeReport(patientId, new Date(startDate), new Date(endDate));
        return {
            ...report,
            generatedAt: new Date(),
        };
    }
    async getWorkloadReport(tenantId, startDate, endDate) {
        return this.labReportsService.generateWorkloadReport(tenantId, new Date(startDate), new Date(endDate));
    }
    async getQCReport(analyzerId, startDate, endDate) {
        return this.labReportsService.generateQCReport(analyzerId, new Date(startDate), new Date(endDate));
    }
    async getReportTypes() {
        return {
            types: [
                'Patient Report',
                'Cumulative Report',
                'Workload Report',
                'QC Report',
                'TAT Report',
                'Panic Alert Report',
            ],
        };
    }
    getContentType(format) {
        switch (format) {
            case 'PDF':
                return 'application/pdf';
            case 'CSV':
                return 'text/csv';
            case 'EXCEL':
                return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            default:
                return 'application/pdf';
        }
    }
};
exports.LabReportsController = LabReportsController;
__decorate([
    (0, common_1.Post)('patient'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate patient lab report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient report generated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lab_reports_dto_1.GeneratePatientReportDto]),
    __metadata("design:returntype", Promise)
], LabReportsController.prototype, "generatePatientReport", null);
__decorate([
    (0, common_1.Post)('cumulative'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate cumulative lab report for patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cumulative report generated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lab_reports_dto_1.GenerateCumulativeReportDto]),
    __metadata("design:returntype", Promise)
], LabReportsController.prototype, "generateCumulativeReport", null);
__decorate([
    (0, common_1.Post)('workload'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate workload report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workload report generated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lab_reports_dto_1.GenerateWorkloadReportDto]),
    __metadata("design:returntype", Promise)
], LabReportsController.prototype, "generateWorkloadReport", null);
__decorate([
    (0, common_1.Post)('qc'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate QC report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QC report generated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lab_reports_dto_1.GenerateQCReportDto]),
    __metadata("design:returntype", Promise)
], LabReportsController.prototype, "generateQCReport", null);
__decorate([
    (0, common_1.Post)('export/:format'),
    (0, swagger_1.ApiOperation)({ summary: 'Export report to specified format' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report exported successfully' }),
    __param(0, (0, common_1.Param)('format')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lab_reports_dto_1.ExportReportDto, Object]),
    __metadata("design:returntype", Promise)
], LabReportsController.prototype, "exportReport", null);
__decorate([
    (0, common_1.Get)('patient/:orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient report by order ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient report retrieved successfully' }),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabReportsController.prototype, "getPatientReport", null);
__decorate([
    (0, common_1.Get)('cumulative/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cumulative report for patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cumulative report retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LabReportsController.prototype, "getCumulativeReport", null);
__decorate([
    (0, common_1.Get)('workload/:tenantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get workload report for tenant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workload report retrieved successfully' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LabReportsController.prototype, "getWorkloadReport", null);
__decorate([
    (0, common_1.Get)('qc/:analyzerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get QC report for analyzer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QC report retrieved successfully' }),
    __param(0, (0, common_1.Param)('analyzerId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LabReportsController.prototype, "getQCReport", null);
__decorate([
    (0, common_1.Get)('types'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available report types' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report types retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabReportsController.prototype, "getReportTypes", null);
exports.LabReportsController = LabReportsController = __decorate([
    (0, swagger_1.ApiTags)('Laboratory Reports'),
    (0, common_1.Controller)('lab/reports'),
    (0, common_1.UseGuards)(lab_auth_guard_1.LabAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [lab_reports_service_1.LabReportsService])
], LabReportsController);
//# sourceMappingURL=lab-reports.controller.js.map