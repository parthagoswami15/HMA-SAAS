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
exports.SupabaseJwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_module_1 = require("../../supabase/supabase.module");
let SupabaseJwtStrategy = class SupabaseJwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'supabase-jwt') {
    supabase;
    configService;
    constructor(supabase, configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
            algorithms: ['HS256'],
            passReqToCallback: true,
        });
        this.supabase = supabase;
        this.configService = configService;
    }
    async validate(req, payload) {
        try {
            const token = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()(req);
            if (!token) {
                throw new common_1.UnauthorizedException('No token provided');
            }
            const { data: { user }, error } = await this.supabase.auth.getUser(token);
            if (error || !user) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp < now) {
                throw new common_1.UnauthorizedException('Token expired');
            }
            return {
                id: user.id,
                email: user.email,
                role: user.role,
                app_metadata: user.app_metadata,
                user_metadata: user.user_metadata,
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.SupabaseJwtStrategy = SupabaseJwtStrategy;
exports.SupabaseJwtStrategy = SupabaseJwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_module_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient,
        config_1.ConfigService])
], SupabaseJwtStrategy);
//# sourceMappingURL=supabase-jwt.strategy.js.map