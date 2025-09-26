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
exports.LabQcController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lab_qc_service_1 = require("../services/lab-qc.service");
const lab_analyzer_dto_1 = require("../dto/lab-analyzer.dto");
const lab_auth_guard_1 = require("../guards/lab-auth.guard");
let LabQcController = class LabQcController {
    labQcService;
    constructor(labQcService) {
        this.labQcService = labQcService;
    }
    async createQcRun(createQcRunDto) {
        return this.labQcService.createQcRun(createQcRunDto);
    }
    async getAllQcRuns(analyzerId, isPassed, operator, dateFrom, dateTo) {
        return this.labQcService.getAllQcRuns({
            analyzerId,
            isPassed: isPassed !== undefined ? isPassed : undefined,
            operator,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined,
        });
    }
    async getQcRunById(id) {
        return this.labQcService.getQcRunById(id);
    }
    async updateQcRun(id, updateData) {
        return this.labQcService.updateQcRun(id, updateData);
    }
    async deleteQcRun(id) {
        return this.labQcService.deleteQcRun(id);
    }
    async evaluateQcRun(id) {
        return this.labQcService.evaluateQcRun(id);
    }
    async getQcRunsByAnalyzer(analyzerId) {
        return this.labQcService.getQcRunsByAnalyzer(analyzerId);
    }
    async getQcRunsByDateRange(dateFrom, dateTo) {
        return this.labQcService.getQcRunsByDateRange(new Date(dateFrom), new Date(dateTo));
    }
    async getFailedQcRuns() {
        return this.labQcService.getFailedQcRuns();
    }
    async getRecentQcRuns(days) {
        return this.labQcService.getRecentQcRuns(days);
    }
};
exports.LabQcController = LabQcController;
__decorate([
    (0, common_1.Post)('runs'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new QC run' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'QC run created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lab_analyzer_dto_1.CreateQcRunDto]),
    __metadata("design:returntype", Promise)
], LabQcController.prototype, "createQcRun", null);
__decorate([
    (0, common_1.Get)('runs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all QC runs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QC runs retrieved successfully' }),
    __param(0, (0, common_1.Query)('analyzerId')),
    __param(1, (0, common_1.Query)('isPassed')),
    __param(2, (0, common_1.Query)('operator')),
    __param(3, (0, common_1.Query)('dateFrom')),
    __param(4, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, String, String, String]),
    __metadata("design:returntype", Promise)
], LabQcController.prototype, "getAllQcRuns", null);
__decorate([
    (0, common_1.Get)('runs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get QC run by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QC run retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabQcController.prototype, "getQcRunById", null);
__decorate([
    (0, common_1.Put)('runs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update QC run' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QC run updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LabQcController.prototype, "updateQcRun", null);
__decorate([
    (0, common_1.Delete)('runs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete QC run' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QC run deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabQcController.prototype, "deleteQcRun", null);
__decorate([
    (0, common_1.Post)('runs/:id/evaluate'),
    (0, swagger_1.ApiOperation)({ summary: 'Evaluate QC run results' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QC run evaluated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabQcController.prototype, "evaluateQcRun", null);
__decorate([
    (0, common_1.Get)('runs/analyzer/:analyzerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get QC runs by analyzer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QC runs retrieved successfully' }),
    __param(0, (0, common_1.Param)('analyzerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabQcController.prototype, "getQcRunsByAnalyzer", null);
__decorate([
    (0, common_1.Get)('runs/date-range'),
    (0, swagger_1.ApiOperation)({ summary: 'Get QC runs by date range' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QC runs retrieved successfully' }),
    __param(0, (0, common_1.Query)('dateFrom')),
    __param(1, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LabQcController.prototype, "getQcRunsByDateRange", null);
__decorate([
    (0, common_1.Get)('runs/failed/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all failed QC runs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Failed QC runs retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabQcController.prototype, "getFailedQcRuns", null);
__decorate([
    (0, common_1.Get)('runs/recent/:days'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent QC runs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recent QC runs retrieved successfully' }),
    __param(0, (0, common_1.Param)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LabQcController.prototype, "getRecentQcRuns", null);
exports.LabQcController = LabQcController = __decorate([
    (0, swagger_1.ApiTags)('Laboratory Quality Control'),
    (0, common_1.Controller)('lab/qc'),
    (0, common_1.UseGuards)(lab_auth_guard_1.LabAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [lab_qc_service_1.LabQcService])
], LabQcController);
//# sourceMappingURL=lab-qc.controller.js.map