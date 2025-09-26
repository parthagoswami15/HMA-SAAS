"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const token_service_1 = require("./services/token.service");
const uuid_1 = require("uuid");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    configService;
    tokenService;
    SALT_ROUNDS = 10;
    constructor(prisma, jwtService, configService, tokenService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.tokenService = tokenService;
    }
    logger = new common_1.Logger(AuthService_1.name);
    getDeviceInfo(userAgent) {
        const deviceInfo = {
            browser: this.parseUserAgent(userAgent),
            os: this.detectOS(userAgent),
            deviceType: this.detectDeviceType(userAgent),
        };
        return deviceInfo;
    }
    parseUserAgent(userAgent) {
        if (userAgent.includes('Chrome'))
            return 'Chrome';
        if (userAgent.includes('Firefox'))
            return 'Firefox';
        if (userAgent.includes('Safari'))
            return 'Safari';
        if (userAgent.includes('Edge'))
            return 'Edge';
        if (userAgent.includes('Opera'))
            return 'Opera';
        return 'Unknown';
    }
    detectOS(userAgent) {
        if (userAgent.includes('Windows'))
            return 'Windows';
        if (userAgent.includes('Mac OS'))
            return 'macOS';
        if (userAgent.includes('Linux'))
            return 'Linux';
        if (userAgent.includes('Android'))
            return 'Android';
        if (userAgent.includes('iOS') || /iPad|iPhone|iPod/.test(userAgent))
            return 'iOS';
        return 'Unknown';
    }
    detectDeviceType(userAgent) {
        if (/Mobile|Android|iP(ad|hone|od)/i.test(userAgent)) {
            return 'Mobile';
        }
        if (/Tablet|iPad/i.test(userAgent)) {
            return 'Tablet';
        }
        return 'Desktop';
    }
    async validateUser(email, password) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
                include: { tenant: true }
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            if (!user.passwordHash) {
                throw new common_1.UnauthorizedException('Invalid authentication method');
            }
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            if (!user.isActive) {
                throw new common_1.ForbiddenException('Account is deactivated');
            }
            if (!user.id || !user.tenantId || !user.role) {
                throw new Error('User data is incomplete');
            }
            return {
                id: user.id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
                firstName: user.firstName,
                lastName: user.lastName,
                isActive: user.isActive,
                tenant: user.tenant
            };
        }
        catch (error) {
            this.logger.error(`Error validating user ${email}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async register(registerDto) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: registerDto.email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email already in use');
            }
            const baseSlug = registerDto.firstName
                ? `${registerDto.firstName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`
                : `user-${Date.now()}`;
            const tenant = await this.prisma.tenant.create({
                data: {
                    name: registerDto.firstName
                        ? `${registerDto.firstName}'s Organization`
                        : 'New Organization',
                    slug: baseSlug,
                    isActive: true,
                    email: registerDto.email,
                    settings: {},
                },
            });
            const hashedPassword = await bcrypt.hash(registerDto.password, this.SALT_ROUNDS);
            const user = await this.prisma.user.create({
                data: {
                    email: registerDto.email.toLowerCase().trim(),
                    passwordHash: hashedPassword,
                    firstName: registerDto.firstName || '',
                    lastName: registerDto.lastName || '',
                    role: client_1.Role.PATIENT,
                    isActive: true,
                    tenantId: tenant.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                include: {
                    tenant: true
                }
            });
            const userWithTenant = {
                id: user.id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
                firstName: user.firstName,
                lastName: user.lastName,
                isActive: user.isActive,
                tenant: user.tenant || undefined
            };
            return userWithTenant;
        }
        catch (error) {
            this.logger.error(`Error registering user ${registerDto.email}: ${error.message}`, error.stack);
            throw error instanceof common_1.ConflictException
                ? error
                : new common_1.BadRequestException('Registration failed. Please try again.');
        }
    }
    async login(loginDto) {
        const requestId = (0, uuid_1.v4)();
        const startTime = Date.now();
        this.logger.log({
            message: 'Login attempt',
            requestId,
            email: loginDto.email,
            ip: loginDto.ipAddress,
            userAgent: loginDto.userAgent,
        });
        try {
            if (!loginDto.email || !loginDto.password) {
                throw new common_1.BadRequestException('Email and password are required');
            }
            const user = await this.prisma.user.findUnique({
                where: { email: loginDto.email },
                include: { tenant: true },
            });
            if (!user) {
                this.logger.warn({
                    message: 'Login failed: User not found',
                    requestId,
                    email: loginDto.email,
                    ip: loginDto.ipAddress,
                });
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
            if (!isPasswordValid) {
                this.logger.warn({
                    message: 'Login failed: Invalid password',
                    requestId,
                    userId: user.id,
                    email: loginDto.email,
                    ip: loginDto.ipAddress,
                });
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            if (!user.isActive) {
                this.logger.warn({
                    message: 'Login failed: Account deactivated',
                    requestId,
                    userId: user.id,
                    email: loginDto.email,
                    ip: loginDto.ipAddress,
                });
                throw new common_1.ForbiddenException('Account is deactivated');
            }
            const jti = this.generateJti();
            try {
                const { accessToken, refreshToken } = await this.tokenService.generateTokens({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    tenantId: user.tenantId,
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    isActive: user.isActive,
                }, jti);
                const deviceInfo = loginDto.userAgent ? this.getDeviceInfo(loginDto.userAgent) : null;
                await this.prisma.refreshToken.create({
                    data: {
                        jti,
                        userId: user.id,
                        token: await bcrypt.hash(refreshToken, this.SALT_ROUNDS),
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        revoked: false,
                        tenantId: user.tenantId,
                        ipAddress: loginDto.ipAddress || null,
                        userAgent: loginDto.userAgent || null,
                    },
                });
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        lastLoginAt: new Date(),
                        updatedAt: new Date()
                    },
                });
                this.logger.log({
                    message: 'Login successful',
                    requestId,
                    userId: user.id,
                    email: user.email,
                    role: user.role,
                    tenantId: user.tenantId,
                    ip: loginDto.ipAddress,
                    deviceType: deviceInfo?.deviceType,
                    duration: Date.now() - startTime,
                });
                return {
                    accessToken,
                    refreshToken,
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        tenantId: user.tenantId,
                        isActive: user.isActive,
                    }
                };
            }
            catch (error) {
                this.logger.error({
                    message: 'Error during token generation',
                    requestId,
                    userId: user.id,
                    error: error.message,
                    stack: error.stack,
                    duration: Date.now() - startTime,
                });
                throw new common_1.BadRequestException('Login failed. Please try again.');
            }
        }
        catch (error) {
            this.logger.error(`Login failed: ${error.message}`, error.stack);
            throw error instanceof common_1.UnauthorizedException
                ? error
                : new common_1.UnauthorizedException('Login failed. Please try again.');
        }
    }
    generateJti() {
        return require('crypto').randomBytes(16).toString('hex');
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = await this.tokenService.verifyRefreshToken(refreshToken);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                include: { tenant: true },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            const jti = this.generateJti();
            const { accessToken, refreshToken: newRefreshToken } = await this.tokenService.generateTokens({
                id: user.id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                isActive: user.isActive,
            }, jti);
            await this.prisma.refreshToken.create({
                data: {
                    jti,
                    userId: user.id,
                    token: await bcrypt.hash(newRefreshToken, this.SALT_ROUNDS),
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    tenantId: user.tenantId,
                },
            });
            await this.prisma.refreshToken.updateMany({
                where: { jti: payload.jti },
                data: {
                    revoked: true,
                    updatedAt: new Date()
                },
            });
            return {
                accessToken,
                refreshToken: newRefreshToken,
            };
        }
        catch (error) {
            this.logger.error('Failed to refresh tokens', error);
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logoutAllDevices(userId) {
        try {
            await this.prisma.refreshToken.updateMany({
                where: {
                    userId,
                    revoked: false
                },
                data: {
                    revoked: true,
                    updatedAt: new Date()
                },
            });
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to logout all devices for user ${userId}: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to logout from all devices');
        }
    }
    async getProfile(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    tenantId: true,
                    createdAt: true,
                    updatedAt: true,
                    lastLoginAt: true,
                    tenant: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            isActive: true
                        }
                    }
                }
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            return user;
        }
        catch (error) {
            this.logger.error(`Failed to get profile for user ${userId}: ${error.message}`, error.stack);
            throw error instanceof common_1.NotFoundException
                ? error
                : new common_1.BadRequestException('Failed to get user profile');
        }
    }
    async getTokens(userId, email, role, tenantId) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email,
                role,
                tenantId,
                jti: (0, uuid_1.v4)(),
            }, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION') || '15m',
            }),
            this.jwtService.signAsync({
                sub: userId,
                email,
                role,
                tenantId,
                jti: (0, uuid_1.v4)(),
                type: 'refresh',
            }, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async logout(userId, jti) {
        await this.prisma.refreshToken.updateMany({
            where: { jti },
            data: { revoked: true }
        });
    }
    async updateRefreshToken(userId, refreshToken, jti) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { tenantId: true }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.refreshToken.updateMany({
            where: { jti },
            data: { revoked: true }
        });
        await this.prisma.refreshToken.create({
            data: {
                jti: (0, uuid_1.v4)(),
                token: refreshToken,
                userId,
                tenantId: user.tenantId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                revoked: false
            }
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        token_service_1.TokenService])
], AuthService);
//# sourceMappingURL=auth.service.js.map