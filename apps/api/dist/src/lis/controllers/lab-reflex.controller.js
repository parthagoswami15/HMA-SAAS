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
exports.LabReflexController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lab_reflex_service_1 = require("../services/lab-reflex.service");
const lab_reflex_dto_1 = require("../dto/lab-reflex.dto");
const lab_auth_guard_1 = require("../guards/lab-auth.guard");
let LabReflexController = class LabReflexController {
    labReflexService;
    constructor(labReflexService) {
        this.labReflexService = labReflexService;
    }
    async createReflexRule(createReflexRuleDto, tenantId) {
        const ruleData = {
            ...createReflexRuleDto,
            tenantId,
            condition: JSON.stringify(createReflexRuleDto.condition),
            actions: createReflexRuleDto.actions,
        };
        return this.labReflexService.createReflexRule(ruleData);
    }
    async getAllReflexRules(tenantId) {
        return this.labReflexService.getAllReflexRules(tenantId);
    }
    async getReflexRuleById(id) {
        return this.labReflexService.getReflexRuleById(id);
    }
    async updateReflexRule(id, updateReflexRuleDto) {
        const updateData = {
            ...updateReflexRuleDto,
            ...(updateReflexRuleDto.condition && { condition: JSON.stringify(updateReflexRuleDto.condition) }),
        };
        return this.labReflexService.updateReflexRule(id, updateData);
    }
    async deleteReflexRule(id) {
        return this.labReflexService.deleteReflexRule(id);
    }
    async evaluateReflexRules(orderId, results) {
        const actions = await this.labReflexService.evaluateReflexRules(orderId, results);
        return {
            orderId,
            triggeredRules: [],
            actions,
            evaluatedAt: new Date(),
        };
    }
    async executeReflexActions(orderId, actions) {
        await this.labReflexService.executeReflexActions(orderId, actions);
        return { message: 'Reflex actions executed successfully' };
    }
};
exports.LabReflexController = LabReflexController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new reflex rule' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Reflex rule created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lab_reflex_dto_1.CreateReflexRuleDto, String]),
    __metadata("design:returntype", Promise)
], LabReflexController.prototype, "createReflexRule", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reflex rules' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reflex rules retrieved successfully' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabReflexController.prototype, "getAllReflexRules", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reflex rule by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reflex rule retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabReflexController.prototype, "getReflexRuleById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update reflex rule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reflex rule updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lab_reflex_dto_1.UpdateReflexRuleDto]),
    __metadata("design:returntype", Promise)
], LabReflexController.prototype, "updateReflexRule", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete reflex rule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reflex rule deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabReflexController.prototype, "deleteReflexRule", null);
__decorate([
    (0, common_1.Post)('evaluate/:orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Evaluate reflex rules for an order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reflex rules evaluated successfully' }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)('results')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], LabReflexController.prototype, "evaluateReflexRules", null);
__decorate([
    (0, common_1.Post)('execute/:orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute reflex actions for an order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reflex actions executed successfully' }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)('actions')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], LabReflexController.prototype, "executeReflexActions", null);
exports.LabReflexController = LabReflexController = __decorate([
    (0, swagger_1.ApiTags)('Laboratory Reflex Rules'),
    (0, common_1.Controller)('lab/reflex-rules'),
    (0, common_1.UseGuards)(lab_auth_guard_1.LabAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [lab_reflex_service_1.LabReflexService])
], LabReflexController);
//# sourceMappingURL=lab-reflex.controller.js.map