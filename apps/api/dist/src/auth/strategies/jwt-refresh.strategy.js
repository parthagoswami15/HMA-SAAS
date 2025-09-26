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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtRefreshStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
let JwtRefreshStrategy = class JwtRefreshStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-refresh') {
    configService;
    prisma;
    constructor(configService, prisma) {
        const jwtConfig = {
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (request) => {
                    const authHeader = request?.headers?.['authorization'];
                    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
                        return authHeader.substring(7);
                    }
                    return request?.cookies?.refreshToken;
                },
            ]),
            secretOrKey: configService.get('JWT_REFRESH_SECRET') || 'fallback-refresh-secret',
            ignoreExpiration: false,
        };
        super(jwtConfig);
        this.configService = configService;
        this.prisma = prisma;
    }
    async validate(req, payload) {
        if (payload.type !== 'refresh') {
            throw new common_1.UnauthorizedException('Invalid token type');
        }
        const isBlacklisted = await this.prisma.tokenBlacklist.findUnique({
            where: { jti: payload.jti },
        });
        if (isBlacklisted) {
            throw new common_1.UnauthorizedException('Token has been revoked');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                isActive: true,
            },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        let refreshToken;
        const authHeader = req.headers?.['authorization'];
        if (authHeader && typeof authHeader === 'string') {
            refreshToken = authHeader.replace('Bearer', '').trim();
        }
        else if (req.cookies?.refreshToken) {
            refreshToken = req.cookies.refreshToken;
        }
        else {
            throw new common_1.UnauthorizedException('Refresh token not found');
        }
        return {
            ...payload,
            refreshToken,
        };
    }
};
exports.JwtRefreshStrategy = JwtRefreshStrategy;
exports.JwtRefreshStrategy = JwtRefreshStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], JwtRefreshStrategy);
//# sourceMappingURL=jwt-refresh.strategy.js.map