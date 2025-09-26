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
exports.LabPanelsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lab_panels_service_1 = require("../services/lab-panels.service");
const lab_panel_dto_1 = require("../dto/lab-panel.dto");
const lab_auth_guard_1 = require("../guards/lab-auth.guard");
let LabPanelsController = class LabPanelsController {
    labPanelsService;
    constructor(labPanelsService) {
        this.labPanelsService = labPanelsService;
    }
    async createPanel(createPanelDto) {
        return this.labPanelsService.createPanel(createPanelDto);
    }
    async getAllPanels(category, isActive, search) {
        return this.labPanelsService.getAllPanels({
            category,
            isActive: isActive !== undefined ? isActive : undefined,
            search,
        });
    }
    async getPanelById(id) {
        return this.labPanelsService.getPanelById(id);
    }
    async updatePanel(id, updatePanelDto) {
        return this.labPanelsService.updatePanel(id, updatePanelDto);
    }
    async deletePanel(id) {
        return this.labPanelsService.deletePanel(id);
    }
    async addTestToPanel(panelId, testId) {
        return this.labPanelsService.addTestToPanel(panelId, testId);
    }
    async removeTestFromPanel(panelId, testId) {
        return this.labPanelsService.removeTestFromPanel(panelId, testId);
    }
    async getPanelsByCategory(category) {
        return this.labPanelsService.getPanelsByCategory(category);
    }
    async getActivePanels() {
        return this.labPanelsService.getActivePanels();
    }
};
exports.LabPanelsController = LabPanelsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new lab panel' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Panel created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lab_panel_dto_1.CreateLabPanelDto]),
    __metadata("design:returntype", Promise)
], LabPanelsController.prototype, "createPanel", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all lab panels' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Panels retrieved successfully' }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('isActive')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, String]),
    __metadata("design:returntype", Promise)
], LabPanelsController.prototype, "getAllPanels", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lab panel by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Panel retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabPanelsController.prototype, "getPanelById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update lab panel' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Panel updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lab_panel_dto_1.UpdateLabPanelDto]),
    __metadata("design:returntype", Promise)
], LabPanelsController.prototype, "updatePanel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete lab panel' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Panel deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabPanelsController.prototype, "deletePanel", null);
__decorate([
    (0, common_1.Post)(':id/tests/:testId'),
    (0, swagger_1.ApiOperation)({ summary: 'Add test to panel' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test added to panel successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('testId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LabPanelsController.prototype, "addTestToPanel", null);
__decorate([
    (0, common_1.Delete)(':id/tests/:testId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove test from panel' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test removed from panel successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('testId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LabPanelsController.prototype, "removeTestFromPanel", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get panels by category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Panels retrieved successfully' }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabPanelsController.prototype, "getPanelsByCategory", null);
__decorate([
    (0, common_1.Get)('active/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active panels' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active panels retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabPanelsController.prototype, "getActivePanels", null);
exports.LabPanelsController = LabPanelsController = __decorate([
    (0, swagger_1.ApiTags)('Laboratory Panels'),
    (0, common_1.Controller)('lab/panels'),
    (0, common_1.UseGuards)(lab_auth_guard_1.LabAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [lab_panels_service_1.LabPanelsService])
], LabPanelsController);
//# sourceMappingURL=lab-panels.controller.js.map