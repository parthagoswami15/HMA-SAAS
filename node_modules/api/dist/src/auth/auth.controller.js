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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const throttler_2 = require("@nestjs/throttler");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const auth_response_dto_1 = require("./dto/auth-response.dto");
const public_decorator_1 = require("./decorators/public.decorator");
const get_current_user_id_decorator_1 = require("./decorators/get-current-user-id.decorator");
const get_current_user_decorator_1 = require("./decorators/get-current-user.decorator");
const jwt_refresh_guard_1 = require("./guards/jwt-refresh.guard");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async refreshTokens(userId, jti) {
        const user = await this.authService.getProfile(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const tokens = await this.authService.getTokens(user.id, user.email, user.role, user.tenantId);
        await this.authService.updateRefreshToken(userId, tokens.refreshToken, jti);
        const userResponse = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            tenantId: user.tenantId,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            lastLoginAt: user.lastLoginAt
        };
        return new auth_response_dto_1.AuthResponseDto(userResponse, tokens);
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    ;
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refresh'),
    (0, common_1.UseGuards)(jwt_refresh_guard_1.JwtRefreshGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' }),
    (0, swagger_1.ApiBody)({ type: refresh_token_dto_1.RefreshTokenDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token successfully refreshed',
        type: auth_response_dto_1.AuthResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid refresh token',
        schema: {
            example: {
                statusCode: 401,
                message: 'Invalid refresh token',
                error: 'Unauthorized'
            }
        }
    }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, get_current_user_decorator_1.GetCurrentUser)('jti')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokens", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Register a new user',
        description: 'Creates a new user account with the provided details. The user will be assigned the PATIENT role by default.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User registered successfully',
        type: auth_response_dto_1.AuthResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid input data',
        schema: {
            example: {
                statusCode: 400,
                message: 'Bad Request',
                error: 'Bad Request'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - Email already in use',
        schema: {
            example: {
                statusCode: 409,
                message: 'Email already in use',
                error: 'Conflict'
            }
        }
    }),
    (0, swagger_1.ApiBody)({
        description: 'User registration data',
        type: register_dto_1.RegisterDto,
        examples: {
            basic: {
                summary: 'Basic registration',
                value: {
                    email: 'user@example.com',
                    password: 'securePassword123!',
                    firstName: 'John',
                    lastName: 'Doe',
                    phone: '+1234567890'
                }
            },
            full: {
                summary: 'Full registration with all fields',
                value: {
                    email: 'user@example.com',
                    password: 'securePassword123!',
                    firstName: 'John',
                    lastName: 'Doe',
                    phone: '+1234567890',
                    dateOfBirth: '1990-01-01',
                    gender: 'MALE',
                    address: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    country: 'USA',
                    postalCode: '10001'
                }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, throttler_2.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'User login',
        description: 'Authenticates a user and returns access and refresh tokens. Rate limited to 5 requests per minute.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully logged in',
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Missing or invalid input data',
        schema: {
            example: {
                statusCode: 400,
                message: 'Email and password are required',
                error: 'Bad Request',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid credentials',
        schema: {
            example: {
                statusCode: 401,
                message: 'Invalid credentials',
                error: 'Unauthorized',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Account is deactivated',
        schema: {
            example: {
                statusCode: 403,
                message: 'Account is deactivated',
                error: 'Forbidden',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        async login(loginDto, res) {
            const user = await this.authService.validateUser(loginDto.email, loginDto.password);
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const tokens = await this.authService.getTokens(user.id, user.email, user.role, user.tenantId);
            await this.authService.updateRefreshToken(user.id, tokens.refreshToken, tokens.jti);
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            const userResponse = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                tenantId: user.tenantId,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                lastLoginAt: user.lastLoginAt
            };
            return new auth_response_dto_1.AuthResponseDto(userResponse, tokens);
        }
    }, (), logout(, userId, string, , jti, string, , res, Response), Promise < { message: string } > {
        await: this.authService.logout(userId, jti),
        res, : .clearCookie('access_token'),
        res, : .clearCookie('refresh_token'),
        return: { message: 'Successfully logged out' }
    }, (), logoutAllDevices(, userId, string, , res, Response), {
        await: this.authService.logoutAllDevices(userId),
        res, : .clearCookie('refresh_token', {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        }),
        return: { success: true }
    }, (), getProfile(, userId, string), {
        return: this.authService.getProfile(userId)
    }, (), healthCheck(), {
        return: {
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || '1.0.0'
        }
    }),
    __metadata("design:type", Object)
], AuthController.prototype, "", void 0);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not Found' }),
    (0, swagger_1.ApiResponse)({ status: 429, description: 'Too Many Requests' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error' }),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map