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
exports.LabResultsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lab_results_service_1 = require("../services/lab-results.service");
const lab_result_dto_1 = require("../dto/lab-result.dto");
const lab_auth_guard_1 = require("../guards/lab-auth.guard");
let LabResultsController = class LabResultsController {
    labResultsService;
    constructor(labResultsService) {
        this.labResultsService = labResultsService;
    }
    async createResult(createResultDto) {
        return this.labResultsService.createResult(createResultDto);
    }
    async getAllResults(orderId, testId, validationStatus, flag, dateFrom, dateTo) {
        return this.labResultsService.getAllResults({
            orderId,
            testId,
            validationStatus,
            flag,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined,
        });
    }
    async getResultById(id) {
        return this.labResultsService.getResultById(id);
    }
    async updateResult(id, updateResultDto) {
        return this.labResultsService.updateResult(id, updateResultDto);
    }
    async deleteResult(id) {
        return this.labResultsService.deleteResult(id);
    }
    async getResultsByOrder(orderId) {
        return this.labResultsService.getResultsByOrder(orderId);
    }
    async getResultsByTest(testId, dateFrom, dateTo) {
        return this.labResultsService.getResultsByTest(testId, dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined);
    }
    async validateResult(id, validatedBy) {
        return this.labResultsService.validateResult(id, validatedBy);
    }
    async reviewResult(id, reviewedBy) {
        return this.labResultsService.reviewResult(id, reviewedBy);
    }
    async finalizeResult(id, finalizedBy) {
        return this.labResultsService.finalizeResult(id, finalizedBy);
    }
    async getCriticalResults() {
        return this.labResultsService.getCriticalResults();
    }
};
exports.LabResultsController = LabResultsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new lab result' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Result created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lab_result_dto_1.CreateLabResultDto]),
    __metadata("design:returntype", Promise)
], LabResultsController.prototype, "createResult", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all lab results' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Results retrieved successfully' }),
    __param(0, (0, common_1.Query)('orderId')),
    __param(1, (0, common_1.Query)('testId')),
    __param(2, (0, common_1.Query)('validationStatus')),
    __param(3, (0, common_1.Query)('flag')),
    __param(4, (0, common_1.Query)('dateFrom')),
    __param(5, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LabResultsController.prototype, "getAllResults", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lab result by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Result retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabResultsController.prototype, "getResultById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update lab result' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Result updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lab_result_dto_1.UpdateLabResultDto]),
    __metadata("design:returntype", Promise)
], LabResultsController.prototype, "updateResult", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete lab result' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Result deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabResultsController.prototype, "deleteResult", null);
__decorate([
    (0, common_1.Get)('order/:orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get results by order ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Results retrieved successfully' }),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabResultsController.prototype, "getResultsByOrder", null);
__decorate([
    (0, common_1.Get)('test/:testId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get results by test ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Results retrieved successfully' }),
    __param(0, (0, common_1.Param)('testId')),
    __param(1, (0, common_1.Query)('dateFrom')),
    __param(2, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LabResultsController.prototype, "getResultsByTest", null);
__decorate([
    (0, common_1.Post)(':id/validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate lab result' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Result validated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('validatedBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LabResultsController.prototype, "validateResult", null);
__decorate([
    (0, common_1.Post)(':id/review'),
    (0, swagger_1.ApiOperation)({ summary: 'Review lab result' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Result reviewed successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reviewedBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LabResultsController.prototype, "reviewResult", null);
__decorate([
    (0, common_1.Post)(':id/finalize'),
    (0, swagger_1.ApiOperation)({ summary: 'Finalize lab result' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Result finalized successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('finalizedBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LabResultsController.prototype, "finalizeResult", null);
__decorate([
    (0, common_1.Get)('critical/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all critical results' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Critical results retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabResultsController.prototype, "getCriticalResults", null);
exports.LabResultsController = LabResultsController = __decorate([
    (0, swagger_1.ApiTags)('Laboratory Results'),
    (0, common_1.Controller)('lab/results'),
    (0, common_1.UseGuards)(lab_auth_guard_1.LabAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [lab_results_service_1.LabResultsService])
], LabResultsController);
//# sourceMappingURL=lab-results.controller.js.map