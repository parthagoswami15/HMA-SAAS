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
exports.TestAuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const supabase_auth_guard_1 = require("../guards/supabase-auth.guard");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
let TestAuthController = class TestAuthController {
    publicEndpoint() {
        return { message: 'This is a public endpoint' };
    }
    protectedEndpoint(user) {
        return {
            message: 'This is a protected endpoint',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            }
        };
    }
    async adminEndpoint(user) {
        const isAdmin = user.role === 'admin' || user.role === 'super_admin';
        if (!isAdmin) {
            return {
                statusCode: 403,
                message: 'Forbidden - Admin access required',
            };
        }
        return {
            message: 'This is an admin-only endpoint',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            }
        };
    }
};
exports.TestAuthController = TestAuthController;
__decorate([
    (0, common_1.Get)('public'),
    (0, swagger_1.ApiOperation)({ summary: 'Public test endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Public endpoint works' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestAuthController.prototype, "publicEndpoint", null);
__decorate([
    (0, common_1.Get)('protected'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Protected test endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Protected endpoint works' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TestAuthController.prototype, "protectedEndpoint", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Admin test endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin endpoint works' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin role required' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestAuthController.prototype, "adminEndpoint", null);
exports.TestAuthController = TestAuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth/test')
], TestAuthController);
//# sourceMappingURL=test-auth.controller.js.map