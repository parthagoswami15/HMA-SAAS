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
exports.LabTestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lab_tests_service_1 = require("../services/lab-tests.service");
const lab_test_dto_1 = require("../dto/lab-test.dto");
const lab_auth_guard_1 = require("../guards/lab-auth.guard");
let LabTestsController = class LabTestsController {
    labTestsService;
    constructor(labTestsService) {
        this.labTestsService = labTestsService;
    }
    async createTest(createTestDto) {
        return this.labTestsService.createTest(createTestDto);
    }
    async getAllTests(category, active) {
        return this.labTestsService.getAllTests(category, active);
    }
    async getTestById(id) {
        return this.labTestsService.getTestById(id);
    }
    async updateTest(id, updateTestDto) {
        return this.labTestsService.updateTest(id, updateTestDto);
    }
    async deleteTest(id) {
        return this.labTestsService.deleteTest(id);
    }
    async getTestsByPanel(panelId) {
        return this.labTestsService.getTestsByPanel(panelId);
    }
};
exports.LabTestsController = LabTestsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new lab test' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Test created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lab_test_dto_1.CreateLabTestDto]),
    __metadata("design:returntype", Promise)
], LabTestsController.prototype, "createTest", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all lab tests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tests retrieved successfully' }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], LabTestsController.prototype, "getAllTests", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lab test by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabTestsController.prototype, "getTestById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update lab test' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lab_test_dto_1.UpdateLabTestDto]),
    __metadata("design:returntype", Promise)
], LabTestsController.prototype, "updateTest", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete lab test' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabTestsController.prototype, "deleteTest", null);
__decorate([
    (0, common_1.Get)('panels/:panelId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tests by panel' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tests retrieved successfully' }),
    __param(0, (0, common_1.Param)('panelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabTestsController.prototype, "getTestsByPanel", null);
exports.LabTestsController = LabTestsController = __decorate([
    (0, swagger_1.ApiTags)('Laboratory Tests'),
    (0, common_1.Controller)('lab/tests'),
    (0, common_1.UseGuards)(lab_auth_guard_1.LabAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [lab_tests_service_1.LabTestsService])
], LabTestsController);
//# sourceMappingURL=lab-tests.controller.js.map