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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
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
                    return request?.cookies?.accessToken;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_ACCESS_SECRET') || 'fallback-secret',
        };
        super(jwtConfig);
        this.configService = configService;
        this.prisma = prisma;
    }
    async validate(req, payload) {
        const tokenPayload = payload;
        const isBlacklisted = await this.prisma.tokenBlacklist.findUnique({
            where: { jti: tokenPayload.jti },
        });
        if (isBlacklisted) {
            throw new common_1.UnauthorizedException('Token has been revoked');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: tokenPayload.sub },
            select: {
                id: true,
                email: true,
                role: true,
                tenantId: true,
                isActive: true,
            },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        const tenantId = this.getTenantIdFromRequest(req) || tokenPayload.tenantId;
        if (tenantId && user.tenantId !== tenantId) {
            throw new common_1.UnauthorizedException('Invalid tenant access');
        }
        return {
            userId: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
            jti: tokenPayload.jti,
        };
    }
    getTenantIdFromRequest(req) {
        const tenantHeader = req.headers?.['x-tenant-id'];
        if (tenantHeader) {
            return Array.isArray(tenantHeader) ? tenantHeader[0] : tenantHeader;
        }
        const query = req.query;
        if (query?.tenantId) {
            return query.tenantId;
        }
        const body = req.body;
        if (body?.tenantId) {
            return body.tenantId;
        }
        return undefined;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map