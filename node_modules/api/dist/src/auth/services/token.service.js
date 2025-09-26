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
var TokenService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const custom_prisma_service_1 = require("../../prisma/custom-prisma.service");
let TokenService = TokenService_1 = class TokenService {
    jwtService;
    configService;
    prisma;
    constructor(jwtService, configService, prisma) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.prisma = prisma;
    }
    logger = new common_1.Logger(TokenService_1.name);
    async generateTokens(user, jti) {
        try {
            const [accessToken, refreshToken] = await Promise.all([
                this.generateAccessToken(user, jti),
                this.generateRefreshToken(user, jti),
            ]);
            return { accessToken, refreshToken };
        }
        catch (error) {
            this.logger.error(`Error generating tokens: ${error.message}`, error.stack);
            throw new Error('Failed to generate authentication tokens');
        }
    }
    async generateAccessToken(user, jti) {
        try {
            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
                jti,
                type: 'access',
            };
            const token = await this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION', '15m'),
            });
            return token;
        }
        catch (error) {
            this.logger.error(`Error generating access token: ${error.message}`, error.stack);
            throw new Error('Failed to generate access token');
        }
    }
    async generateRefreshToken(user, jti) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
            jti,
            type: 'refresh',
        };
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
        });
    }
    async verifyAccessToken(token) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
            });
            const tokenEntry = await this.prisma.findTokenByJti(payload.jti);
            if (tokenEntry && tokenEntry.revoked) {
                throw new common_1.UnauthorizedException('Token has been revoked');
            }
            return payload;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    async verifyRefreshToken(token) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            if (payload.type !== 'refresh') {
                throw new common_1.UnauthorizedException('Invalid token type');
            }
            const tokenEntry = await this.prisma.findTokenByJti(payload.jti);
            if (tokenEntry && tokenEntry.revoked) {
                throw new common_1.UnauthorizedException('Token has been revoked');
            }
            return payload;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async revokeToken(jti, userId, token, expiresAt) {
        await this.prisma.upsertTokenBlacklist({
            jti,
            userId,
            token: await this.hashToken(token),
            expiresAt,
            revoked: true,
            reason: 'Token was explicitly revoked',
        });
    }
    async revokeAllUserTokens(userId) {
        await this.prisma.revokeAllUserTokens(userId);
    }
    async hashToken(token) {
        return Buffer.from(token).toString('base64').substring(0, 255);
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = TokenService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        custom_prisma_service_1.CustomPrismaService])
], TokenService);
//# sourceMappingURL=token.service.js.map