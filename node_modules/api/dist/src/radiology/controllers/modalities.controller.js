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
exports.ModalitiesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const modalities_service_1 = require("../services/modalities.service");
const modalities_dto_1 = require("../dto/modalities.dto");
let ModalitiesController = class ModalitiesController {
    modalitiesService;
    constructor(modalitiesService) {
        this.modalitiesService = modalitiesService;
    }
    async create(createDto, req) {
        return this.modalitiesService.create(createDto, req.user.tenantId);
    }
    async findAll(modalityType, isActive, page, limit) {
        const filterDto = { modalityType, isActive: isActive === 'true' };
        const listDto = { page: page || 1, limit: limit || 10 };
        return this.modalitiesService.findAll(filterDto, listDto);
    }
    async findOne(id) {
        return this.modalitiesService.findOne(id);
    }
    async update(id, updateDto) {
        return this.modalitiesService.update(id, updateDto);
    }
    async getWorklist(modalityId) {
        return this.modalitiesService.getWorklist(modalityId);
    }
    async sendToWorklist(modalityId, worklistDto) {
        return this.modalitiesService.sendToWorklist(modalityId, worklistDto);
    }
    async testConnection(modalityId, testDto) {
        return this.modalitiesService.testConnection(modalityId, testDto);
    }
    async getStats(req) {
        return this.modalitiesService.getStats(req.user.tenantId);
    }
    async activate(id) {
        return this.modalitiesService.updateStatus(id, true);
    }
    async deactivate(id) {
        return this.modalitiesService.updateStatus(id, false);
    }
    async remove(id) {
        await this.modalitiesService.remove(id);
    }
};
exports.ModalitiesController = ModalitiesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new modality' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Modality created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Modality with this AE Title already exists' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [modalities_dto_1.CreateModalityDto, Object]),
    __metadata("design:returntype", Promise)
], ModalitiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all modalities with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Modalities retrieved successfully' }),
    __param(0, (0, common_1.Query)('modalityType')),
    __param(1, (0, common_1.Query)('isActive')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ModalitiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get modality by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Modality retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Modality not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModalitiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update modality' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Modality updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Modality not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'AE Title already exists' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, modalities_dto_1.UpdateModalityDto]),
    __metadata("design:returntype", Promise)
], ModalitiesController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id/worklist'),
    (0, swagger_1.ApiOperation)({ summary: 'Get modality worklist' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Worklist retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModalitiesController.prototype, "getWorklist", null);
__decorate([
    (0, common_1.Post)(':id/worklist'),
    (0, swagger_1.ApiOperation)({ summary: 'Send study to modality worklist' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Study sent to worklist successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Modality or study not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, modalities_dto_1.ModalityWorklistDto]),
    __metadata("design:returntype", Promise)
], ModalitiesController.prototype, "sendToWorklist", null);
__decorate([
    (0, common_1.Post)(':id/test-connection'),
    (0, swagger_1.ApiOperation)({ summary: 'Test connection to modality' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Connection test successful' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Test failed' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, modalities_dto_1.TestModalityConnectionDto]),
    __metadata("design:returntype", Promise)
], ModalitiesController.prototype, "testConnection", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get modalities statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ModalitiesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)(':id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate modality' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Modality activated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Modality not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModalitiesController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate modality' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Modality deactivated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Modality not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModalitiesController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete modality' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Modality deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Modality not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Cannot delete modality with active studies' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModalitiesController.prototype, "remove", null);
exports.ModalitiesController = ModalitiesController = __decorate([
    (0, swagger_1.ApiTags)('Radiology - Modalities'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('radiology/modalities'),
    __metadata("design:paramtypes", [modalities_service_1.ModalitiesService])
], ModalitiesController);
//# sourceMappingURL=modalities.controller.js.map