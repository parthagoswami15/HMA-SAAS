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
exports.LabSampleStabilityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lab_sample_stability_service_1 = require("../services/lab-sample-stability.service");
const lab_auth_guard_1 = require("../guards/lab-auth.guard");
let LabSampleStabilityController = class LabSampleStabilityController {
    labSampleStabilityService;
    constructor(labSampleStabilityService) {
        this.labSampleStabilityService = labSampleStabilityService;
    }
    async checkSampleStability(sampleId) {
        return this.labSampleStabilityService.checkSampleStability(sampleId);
    }
    async reportSampleIssue(issueData) {
        return this.labSampleStabilityService.createSampleIssue(issueData);
    }
    async checkAddOnTest(sampleId, testId) {
        return this.labSampleStabilityService.handleAddOnTest(sampleId, testId);
    }
    async getExpiredSamples() {
        return this.labSampleStabilityService.getExpiredSamples();
    }
    async getSamplesRequiringRecollection() {
        return this.labSampleStabilityService.getSamplesRequiringRecollection();
    }
    async getSampleIssues(sampleId) {
        return this.labSampleStabilityService.getSampleIssues(sampleId);
    }
    async updateSampleCondition(sampleId, condition) {
        await this.labSampleStabilityService.updateSampleCondition(sampleId, condition);
        return { message: 'Sample condition updated successfully' };
    }
    async getStabilityRules() {
        return [];
    }
    async getQualityMetrics(tenantId) {
        const expiredSamples = await this.labSampleStabilityService.getExpiredSamples();
        const recollectionSamples = await this.labSampleStabilityService.getSamplesRequiringRecollection();
        return {
            expiredSamplesCount: expiredSamples.length,
            recollectionRequiredCount: recollectionSamples.length,
            qualityScore: this.calculateQualityScore(expiredSamples.length, recollectionSamples.length),
            commonIssues: this.analyzeCommonIssues(recollectionSamples),
        };
    }
    calculateQualityScore(expiredCount, recollectionCount) {
        const totalIssues = expiredCount + recollectionCount;
        return Math.max(0, 100 - (totalIssues * 5));
    }
    analyzeCommonIssues(samples) {
        const issueCounts = {};
        samples.forEach(sample => {
            if (sample.issues) {
                sample.issues.forEach((issue) => {
                    issueCounts[issue.issueType] = (issueCounts[issue.issueType] || 0) + 1;
                });
            }
        });
        return Object.entries(issueCounts)
            .map(([issueType, count]) => ({ issueType, count }))
            .sort((a, b) => b.count - a.count);
    }
};
exports.LabSampleStabilityController = LabSampleStabilityController;
__decorate([
    (0, common_1.Get)('check/:sampleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Check sample stability' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sample stability checked successfully' }),
    __param(0, (0, common_1.Param)('sampleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabSampleStabilityController.prototype, "checkSampleStability", null);
__decorate([
    (0, common_1.Post)('issues'),
    (0, swagger_1.ApiOperation)({ summary: 'Report a sample issue' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Sample issue reported successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LabSampleStabilityController.prototype, "reportSampleIssue", null);
__decorate([
    (0, common_1.Post)('addon-test/:sampleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if add-on test can be performed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Add-on test feasibility checked successfully' }),
    __param(0, (0, common_1.Param)('sampleId')),
    __param(1, (0, common_1.Body)('testId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LabSampleStabilityController.prototype, "checkAddOnTest", null);
__decorate([
    (0, common_1.Get)('expired'),
    (0, swagger_1.ApiOperation)({ summary: 'Get expired samples' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expired samples retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabSampleStabilityController.prototype, "getExpiredSamples", null);
__decorate([
    (0, common_1.Get)('recollection-required'),
    (0, swagger_1.ApiOperation)({ summary: 'Get samples requiring recollection' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Samples requiring recollection retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabSampleStabilityController.prototype, "getSamplesRequiringRecollection", null);
__decorate([
    (0, common_1.Get)('issues/:sampleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get issues for a sample' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sample issues retrieved successfully' }),
    __param(0, (0, common_1.Param)('sampleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabSampleStabilityController.prototype, "getSampleIssues", null);
__decorate([
    (0, common_1.Put)('condition/:sampleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update sample condition' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sample condition updated successfully' }),
    __param(0, (0, common_1.Param)('sampleId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LabSampleStabilityController.prototype, "updateSampleCondition", null);
__decorate([
    (0, common_1.Get)('stability-rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sample stability rules' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stability rules retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabSampleStabilityController.prototype, "getStabilityRules", null);
__decorate([
    (0, common_1.Get)('quality-metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sample quality metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Quality metrics retrieved successfully' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabSampleStabilityController.prototype, "getQualityMetrics", null);
exports.LabSampleStabilityController = LabSampleStabilityController = __decorate([
    (0, swagger_1.ApiTags)('Laboratory Sample Stability'),
    (0, common_1.Controller)('lab/sample-stability'),
    (0, common_1.UseGuards)(lab_auth_guard_1.LabAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [lab_sample_stability_service_1.LabSampleStabilityService])
], LabSampleStabilityController);
//# sourceMappingURL=lab-sample-stability.controller.js.map