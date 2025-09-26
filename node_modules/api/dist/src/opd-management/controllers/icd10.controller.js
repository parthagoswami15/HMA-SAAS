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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icd10Controller = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../users/enums/user-role.enum");
const icd10_service_1 = require("../services/icd10.service");
const pagination_params_dto_1 = require("../../common/dto/pagination-params.dto");
const icd10_code_entity_1 = require("../entities/icd10-code.entity");
let Icd10Controller = class Icd10Controller {
    icd10Service;
    constructor(icd10Service) {
        this.icd10Service = icd10Service;
    }
    search(query, pagination, exactMatch, includeChapters, includeBlocks, category, sex, age) {
        return this.icd10Service.search(query, pagination, {
            exactMatch: exactMatch === true,
            includeChapters: includeChapters !== false,
            includeBlocks: includeBlocks !== false,
            category,
            sex,
            age: age ? Number(age) : undefined,
        });
    }
    autocomplete(query, limit = 10) {
        if (!query || query.length < 2) {
            throw new common_1.BadRequestException('Query must be at least 2 characters long');
        }
        return this.icd10Service.autocomplete(query, Math.min(Number(limit) || 10, 25));
    }
    findOne(code) {
        return this.icd10Service.findByCode(code);
    }
    getChapters() {
        return this.icd10Service.getChapters();
    }
    getChapter(chapterCode) {
        return this.icd10Service.getChapterByCode(chapterCode);
    }
    getChapterBlocks(chapterCode) {
        return this.icd10Service.getBlocksByChapter(chapterCode);
    }
    getBlock(blockCode) {
        return this.icd10Service.getBlockByCode(blockCode);
    }
    getBlockCodes(blockCode) {
        return this.icd10Service.getCodesByBlock(blockCode);
    }
    getCodeHierarchy(code) {
        return this.icd10Service.getCodeHierarchy(code);
    }
    getCategories() {
        return this.icd10Service.getCategories();
    }
    async validateCode(code, sex, age) {
        try {
            const result = await this.icd10Service.validateCode(code, {
                sex,
                age: age ? Number(age) : undefined,
            });
            return result;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return { valid: false, message: 'Invalid ICD-10 code' };
            }
            throw error;
        }
    }
};
exports.Icd10Controller = Icd10Controller;
__decorate([
    (0, common_1.Get)('search'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Search ICD-10 codes' }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'exactMatch', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'includeChapters', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'includeBlocks', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'sex', required: false, enum: ['male', 'female'] }),
    (0, swagger_1.ApiQuery)({ name: 'age', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of matching ICD-10 codes' }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)('exactMatch')),
    __param(3, (0, common_1.Query)('includeChapters')),
    __param(4, (0, common_1.Query)('includeBlocks')),
    __param(5, (0, common_1.Query)('category')),
    __param(6, (0, common_1.Query)('sex')),
    __param(7, (0, common_1.Query)('age')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof pagination_params_dto_1.PaginationParams !== "undefined" && pagination_params_dto_1.PaginationParams) === "function" ? _a : Object, Boolean, Boolean, Boolean, String, String, Number]),
    __metadata("design:returntype", Promise)
], Icd10Controller.prototype, "search", null);
__decorate([
    (0, common_1.Get)('autocomplete'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Autocomplete ICD-10 codes' }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of matching ICD-10 codes for autocomplete' }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], Icd10Controller.prototype, "autocomplete", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get ICD-10 code details' }),
    (0, swagger_1.ApiParam)({ name: 'code', description: 'ICD-10 code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ICD-10 code details', type: icd10_code_entity_1.Icd10Code }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'ICD-10 code not found' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Icd10Controller.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('chapters'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all ICD-10 chapters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of ICD-10 chapters', type: [icd10_code_entity_1.Icd10Code] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Icd10Controller.prototype, "getChapters", null);
__decorate([
    (0, common_1.Get)('chapters/:chapterCode'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get ICD-10 chapter details' }),
    (0, swagger_1.ApiParam)({ name: 'chapterCode', description: 'ICD-10 chapter code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ICD-10 chapter details', type: icd10_code_entity_1.Icd10Code }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chapter not found' }),
    __param(0, (0, common_1.Param)('chapterCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Icd10Controller.prototype, "getChapter", null);
__decorate([
    (0, common_1.Get)('chapters/:chapterCode/blocks'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all blocks in an ICD-10 chapter' }),
    (0, swagger_1.ApiParam)({ name: 'chapterCode', description: 'ICD-10 chapter code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of blocks in the chapter', type: [icd10_code_entity_1.Icd10Code] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chapter not found' }),
    __param(0, (0, common_1.Param)('chapterCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Icd10Controller.prototype, "getChapterBlocks", null);
__decorate([
    (0, common_1.Get)('blocks/:blockCode'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get ICD-10 block details' }),
    (0, swagger_1.ApiParam)({ name: 'blockCode', description: 'ICD-10 block code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ICD-10 block details', type: icd10_code_entity_1.Icd10Code }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Block not found' }),
    __param(0, (0, common_1.Param)('blockCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Icd10Controller.prototype, "getBlock", null);
__decorate([
    (0, common_1.Get)('blocks/:blockCode/codes'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all codes in an ICD-10 block' }),
    (0, swagger_1.ApiParam)({ name: 'blockCode', description: 'ICD-10 block code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of codes in the block', type: [icd10_code_entity_1.Icd10Code] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Block not found' }),
    __param(0, (0, common_1.Param)('blockCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Icd10Controller.prototype, "getBlockCodes", null);
__decorate([
    (0, common_1.Get)('code/:code/hierarchy'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get hierarchy for an ICD-10 code' }),
    (0, swagger_1.ApiParam)({ name: 'code', description: 'ICD-10 code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hierarchy information for the code' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Icd10Controller.prototype, "getCodeHierarchy", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all ICD-10 categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of ICD-10 categories', type: [String] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Icd10Controller.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('validate/:code'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Validate an ICD-10 code' }),
    (0, swagger_1.ApiParam)({ name: 'code', description: 'ICD-10 code to validate' }),
    (0, swagger_1.ApiQuery)({ name: 'sex', required: false, enum: ['male', 'female'] }),
    (0, swagger_1.ApiQuery)({ name: 'age', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Validation result' }),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Query)('sex')),
    __param(2, (0, common_1.Query)('age')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], Icd10Controller.prototype, "validateCode", null);
exports.Icd10Controller = Icd10Controller = __decorate([
    (0, swagger_1.ApiTags)('OPD - ICD-10'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('opd/icd10'),
    __metadata("design:paramtypes", [icd10_service_1.Icd10Service])
], Icd10Controller);
//# sourceMappingURL=icd10.controller.js.map