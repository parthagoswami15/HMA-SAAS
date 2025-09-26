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
exports.PACSController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const pacs_service_1 = require("../services/pacs.service");
const pacs_dto_1 = require("../dto/pacs.dto");
let PACSController = class PACSController {
    pacsService;
    constructor(pacsService) {
        this.pacsService = pacsService;
    }
    async storeDicom(storeDto) {
        return this.pacsService.storeDicom(storeDto);
    }
    async queryDicom(queryDto) {
        return this.pacsService.queryDicom(queryDto);
    }
    async retrieveDicom(retrieveDto) {
        return this.pacsService.retrieveDicom(retrieveDto);
    }
    async getStudyHierarchy(studyInstanceUID) {
        return this.pacsService.getStudyHierarchy(studyInstanceUID);
    }
    async getPatientStudies(patientId) {
        return this.pacsService.getPatientStudies(patientId);
    }
    async searchStudies(searchTerm) {
        return this.pacsService.searchStudies(searchTerm);
    }
    async getStorageStats(req) {
        return this.pacsService.getStorageStats(req.user.tenantId);
    }
    async cleanupOrphanedData() {
        return this.pacsService.cleanupOrphanedData();
    }
    async getStudyForViewer(studyInstanceUID) {
        return this.pacsService.getStudyHierarchy(studyInstanceUID);
    }
    async getSeriesImages(seriesInstanceUID) {
        return { seriesInstanceUID, images: [] };
    }
};
exports.PACSController = PACSController;
__decorate([
    (0, common_1.Post)('store'),
    (0, swagger_1.ApiOperation)({ summary: 'Store DICOM object' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'DICOM object stored successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid DICOM data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pacs_dto_1.StoreDicomDto]),
    __metadata("design:returntype", Promise)
], PACSController.prototype, "storeDicom", null);
__decorate([
    (0, common_1.Post)('query'),
    (0, swagger_1.ApiOperation)({ summary: 'Query DICOM objects' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Query results retrieved successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pacs_dto_1.QueryDicomDto]),
    __metadata("design:returntype", Promise)
], PACSController.prototype, "queryDicom", null);
__decorate([
    (0, common_1.Post)('retrieve'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve DICOM object' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'DICOM object retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'DICOM object not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pacs_dto_1.RetrieveDicomDto]),
    __metadata("design:returntype", Promise)
], PACSController.prototype, "retrieveDicom", null);
__decorate([
    (0, common_1.Get)('study/:studyInstanceUID/hierarchy'),
    (0, swagger_1.ApiOperation)({ summary: 'Get study hierarchy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Study hierarchy retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Study not found' }),
    __param(0, (0, common_1.Param)('studyInstanceUID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PACSController.prototype, "getStudyHierarchy", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/studies'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient studies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient studies retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PACSController.prototype, "getPatientStudies", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search studies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Search results retrieved successfully' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PACSController.prototype, "searchStudies", null);
__decorate([
    (0, common_1.Get)('stats/storage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get storage statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Storage statistics retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PACSController.prototype, "getStorageStats", null);
__decorate([
    (0, common_1.Post)('cleanup/orphaned'),
    (0, swagger_1.ApiOperation)({ summary: 'Clean up orphaned DICOM data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cleanup completed successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PACSController.prototype, "cleanupOrphanedData", null);
__decorate([
    (0, common_1.Get)('viewer/study/:studyInstanceUID'),
    (0, swagger_1.ApiOperation)({ summary: 'Get study for viewer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Study data for viewer retrieved successfully' }),
    __param(0, (0, common_1.Param)('studyInstanceUID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PACSController.prototype, "getStudyForViewer", null);
__decorate([
    (0, common_1.Get)('viewer/series/:seriesInstanceUID/images'),
    (0, swagger_1.ApiOperation)({ summary: 'Get series images for viewer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Series images retrieved successfully' }),
    __param(0, (0, common_1.Param)('seriesInstanceUID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PACSController.prototype, "getSeriesImages", null);
exports.PACSController = PACSController = __decorate([
    (0, swagger_1.ApiTags)('Radiology - PACS'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('radiology/pacs'),
    __metadata("design:paramtypes", [pacs_service_1.PACSService])
], PACSController);
//# sourceMappingURL=pacs.controller.js.map