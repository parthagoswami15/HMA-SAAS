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
exports.TestDataController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const test_data_service_1 = require("./test-data.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const client_1 = require("@prisma/client");
let TestDataController = class TestDataController {
    testDataService;
    constructor(testDataService) {
        this.testDataService = testDataService;
    }
    async createTestData(user) {
        try {
            return await this.testDataService.createTestData(user.tenantId);
        }
        catch (error) {
            throw error;
        }
    }
    async clearTestData(user) {
        try {
            return await this.testDataService.clearTestData(user.tenantId);
        }
        catch (error) {
            throw error;
        }
    }
};
exports.TestDataController = TestDataController;
__decorate([
    (0, common_1.Post)('seed'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Seed test data for development' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Test data seeded successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestDataController.prototype, "createTestData", null);
__decorate([
    (0, common_1.Delete)('clear'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Clear all test data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test data cleared successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestDataController.prototype, "clearTestData", null);
exports.TestDataController = TestDataController = __decorate([
    (0, swagger_1.ApiTags)('Testing'),
    (0, common_1.Controller)('testing'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [test_data_service_1.TestDataService])
], TestDataController);
//# sourceMappingURL=test-data.controller.js.map