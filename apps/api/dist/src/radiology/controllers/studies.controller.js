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
exports.StudiesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const studies_service_1 = require("../services/studies.service");
const studies_dto_1 = require("../dto/studies.dto");
let StudiesController = class StudiesController {
    studiesService;
    constructor(studiesService) {
        this.studiesService = studiesService;
    }
    async create(createDto) {
        return this.studiesService.create(createDto);
    }
    async findAll(filterDto, listDto) {
        return this.studiesService.findAll(filterDto, listDto);
    }
    async findOne(id) {
        return this.studiesService.findOne(id);
    }
    async update(id, updateDto) {
        return this.studiesService.update(id, updateDto);
    }
    async startStudy(id) {
        return this.studiesService.startStudy(id);
    }
    async completeStudy(id) {
        return this.studiesService.completeStudy(id);
    }
    async getStudyByUID(studyInstanceUID) {
        return this.studiesService.getStudyByUID(studyInstanceUID);
    }
    async getStudiesByOrder(orderId) {
        return this.studiesService.getStudiesByOrder(orderId);
    }
    async getStudyImages(studyId) {
        return this.studiesService.getStudyImages(studyId);
    }
    async updateDicomMetadata(id, dicomMetadata) {
        return this.studiesService.updateDicomMetadata(id, dicomMetadata);
    }
    async getStats(req) {
        return this.studiesService.getStats(req.user.tenantId);
    }
    async remove(id) {
        throw new Error('Delete functionality not implemented');
    }
};
exports.StudiesController = StudiesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new study' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Study created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [studies_dto_1.CreateStudyDto]),
    __metadata("design:returntype", Promise)
], StudiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all studies with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Studies retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [studies_dto_1.StudyFilterDto,
        studies_dto_1.StudyListDto]),
    __metadata("design:returntype", Promise)
], StudiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get study by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Study retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Study not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update study' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Study updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Study not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, studies_dto_1.UpdateStudyDto]),
    __metadata("design:returntype", Promise)
], StudiesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    (0, swagger_1.ApiOperation)({ summary: 'Start study acquisition' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Study started successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Study cannot be started' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Study not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudiesController.prototype, "startStudy", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete study acquisition' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Study completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Study cannot be completed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Study not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudiesController.prototype, "completeStudy", null);
__decorate([
    (0, common_1.Get)('uid/:studyInstanceUID'),
    (0, swagger_1.ApiOperation)({ summary: 'Get study by DICOM Study Instance UID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Study retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Study not found' }),
    __param(0, (0, common_1.Param)('studyInstanceUID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudiesController.prototype, "getStudyByUID", null);
__decorate([
    (0, common_1.Get)('order/:orderId/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all studies for an imaging order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Studies retrieved successfully' }),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudiesController.prototype, "getStudiesByOrder", null);
__decorate([
    (0, common_1.Get)(':id/images'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all images for a study' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Study images retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Study not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudiesController.prototype, "getStudyImages", null);
__decorate([
    (0, common_1.Put)(':id/dicom-metadata'),
    (0, swagger_1.ApiOperation)({ summary: 'Update DICOM metadata for study' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'DICOM metadata updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Study not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudiesController.prototype, "updateDicomMetadata", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get studies statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudiesController.prototype, "getStats", null);
__decorate([
    Delete(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete study' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Study deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Study not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudiesController.prototype, "remove", null);
exports.StudiesController = StudiesController = __decorate([
    (0, swagger_1.ApiTags)('Radiology - Studies'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('radiology/studies'),
    __metadata("design:paramtypes", [studies_service_1.StudiesService])
], StudiesController);
//# sourceMappingURL=studies.controller.js.map