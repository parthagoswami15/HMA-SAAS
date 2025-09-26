"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const cache_manager_1 = require("@nestjs/cache-manager");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const jwt_refresh_strategy_1 = require("./strategies/jwt-refresh.strategy");
const supabase_jwt_strategy_1 = require("./strategies/supabase-jwt.strategy");
const supabase_auth_service_1 = require("./services/supabase-auth.service");
const supabase_auth_controller_1 = require("./controllers/supabase-auth.controller");
const test_auth_controller_1 = require("./controllers/test-auth.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const token_module_1 = require("./services/token.module");
const ip_rate_limit_guard_1 = require("./guards/ip-rate-limit.guard");
const public_route_guard_1 = require("./guards/public-route.guard");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            prisma_module_1.PrismaModule,
            token_module_1.TokenModule,
            cache_manager_1.CacheModule.register(),
            passport_1.PassportModule.register({
                defaultStrategy: 'jwt',
                session: false,
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    throttlers: [
                        {
                            ttl: 1000,
                            limit: 10,
                        },
                        {
                            name: 'login',
                            ttl: 60000,
                            limit: 5,
                        },
                    ],
                }),
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_ACCESS_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_ACCESS_EXPIRATION', '15m'),
                    },
                }),
            }),
        ],
        controllers: [auth_controller_1.AuthController, supabase_auth_controller_1.SupabaseAuthController, test_auth_controller_1.TestAuthController],
        providers: [
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            jwt_refresh_strategy_1.JwtRefreshStrategy,
            supabase_jwt_strategy_1.SupabaseJwtStrategy,
            supabase_auth_service_1.SupabaseAuthService,
            jwt_refresh_strategy_1.JwtRefreshStrategy,
            {
                provide: core_1.APP_GUARD,
                useClass: public_route_guard_1.PublicRouteGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: ip_rate_limit_guard_1.IpRateLimitGuard,
            },
        ],
        exports: [
            auth_service_1.AuthService,
            jwt_1.JwtModule,
            passport_1.PassportModule,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map