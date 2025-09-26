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
exports.SupabaseAuthController = void 0;
const common_1 = require("@nestjs/common");
const supabase_auth_service_1 = require("../services/supabase-auth.service");
const supabase_auth_guard_1 = require("../guards/supabase-auth.guard");
const public_decorator_1 = require("../decorators/public.decorator");
let SupabaseAuthController = class SupabaseAuthController {
    supabaseAuthService;
    constructor(supabaseAuthService) {
        this.supabaseAuthService = supabaseAuthService;
    }
    async signIn(credentials) {
        return this.supabaseAuthService.signInWithEmail(credentials);
    }
    async signUp(credentials) {
        return this.supabaseAuthService.signUp(credentials);
    }
    async signOut(req, res) {
        await this.supabaseAuthService.signOut();
        return res.send({ success: true });
    }
    async refreshToken(refreshToken) {
        return this.supabaseAuthService.refreshSession(refreshToken);
    }
    getProfile(req) {
        return req.user;
    }
};
exports.SupabaseAuthController = SupabaseAuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('signin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupabaseAuthController.prototype, "signIn", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('signup'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupabaseAuthController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('signout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SupabaseAuthController.prototype, "signOut", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupabaseAuthController.prototype, "refreshToken", null);
__decorate([
    Get('me'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SupabaseAuthController.prototype, "getProfile", null);
exports.SupabaseAuthController = SupabaseAuthController = __decorate([
    (0, common_1.Controller)('auth/supabase'),
    __metadata("design:paramtypes", [supabase_auth_service_1.SupabaseAuthService])
], SupabaseAuthController);
//# sourceMappingURL=supabase-auth.controller.js.map