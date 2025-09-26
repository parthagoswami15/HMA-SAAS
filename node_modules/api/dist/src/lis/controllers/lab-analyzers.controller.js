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
exports.LabAnalyzersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lab_analyzers_service_1 = require("../services/lab-analyzers.service");
const lab_analyzer_dto_1 = require("../dto/lab-analyzer.dto");
const lab_auth_guard_1 = require("../guards/lab-auth.guard");
let LabAnalyzersController = class LabAnalyzersController {
    labAnalyzersService;
    constructor(labAnalyzersService) {
        this.labAnalyzersService = labAnalyzersService;
    }
    async createAnalyzer(createAnalyzerDto) {
        return this.labAnalyzersService.createAnalyzer(createAnalyzerDto);
    }
    async getAllAnalyzers(type, status, isActive, location) {
        return this.labAnalyzersService.getAllAnalyzers({
            type,
            status,
            isActive: isActive !== undefined ? isActive : undefined,
            location,
        });
    }
    async getAnalyzerById(id) {
        return this.labAnalyzersService.getAnalyzerById(id);
    }
    async updateAnalyzer(id, updateAnalyzerDto) {
        return this.labAnalyzersService.updateAnalyzer(id, updateAnalyzerDto);
    }
    async deleteAnalyzer(id) {
        return this.labAnalyzersService.deleteAnalyzer(id);
    }
    async updateAnalyzerStatus(id, status) {
        return this.labAnalyzersService.updateAnalyzerStatus(id, status);
    }
    async updateAnalyzerCommunication(id) {
        return this.labAnalyzersService.updateAnalyzerCommunication(id);
    }
    async getAnalyzersByType(type) {
        return this.labAnalyzersService.getAnalyzersByType(type);
    }
    async getActiveAnalyzers() {
        return this.labAnalyzersService.getActiveAnalyzers();
    }
    async getOnlineAnalyzers() {
        return this.labAnalyzersService.getOnlineAnalyzers();
    }
};
exports.LabAnalyzersController = LabAnalyzersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new analyzer' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Analyzer created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lab_analyzer_dto_1.CreateAnalyzerDto]),
    __metadata("design:returntype", Promise)
], LabAnalyzersController.prototype, "createAnalyzer", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all analyzers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analyzers retrieved successfully' }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('isActive')),
    __param(3, (0, common_1.Query)('location')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean, String]),
    __metadata("design:returntype", Promise)
], LabAnalyzersController.prototype, "getAllAnalyzers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get analyzer by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analyzer retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabAnalyzersController.prototype, "getAnalyzerById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update analyzer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analyzer updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lab_analyzer_dto_1.UpdateAnalyzerDto]),
    __metadata("design:returntype", Promise)
], LabAnalyzersController.prototype, "updateAnalyzer", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete analyzer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analyzer deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabAnalyzersController.prototype, "deleteAnalyzer", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update analyzer status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analyzer status updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LabAnalyzersController.prototype, "updateAnalyzerStatus", null);
__decorate([
    (0, common_1.Put)(':id/communication'),
    (0, swagger_1.ApiOperation)({ summary: 'Update analyzer communication timestamp' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analyzer communication updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabAnalyzersController.prototype, "updateAnalyzerCommunication", null);
__decorate([
    (0, common_1.Get)('type/:type'),
    (0, swagger_1.ApiOperation)({ summary: 'Get analyzers by type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analyzers retrieved successfully' }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabAnalyzersController.prototype, "getAnalyzersByType", null);
__decorate([
    (0, common_1.Get)('active/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active analyzers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active analyzers retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabAnalyzersController.prototype, "getActiveAnalyzers", null);
__decorate([
    (0, common_1.Get)('online/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all online analyzers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Online analyzers retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabAnalyzersController.prototype, "getOnlineAnalyzers", null);
exports.LabAnalyzersController = LabAnalyzersController = __decorate([
    (0, swagger_1.ApiTags)('Laboratory Analyzers'),
    (0, common_1.Controller)('lab/analyzers'),
    (0, common_1.UseGuards)(lab_auth_guard_1.LabAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [lab_analyzers_service_1.LabAnalyzersService])
], LabAnalyzersController);
//# sourceMappingURL=lab-analyzers.controller.js.map