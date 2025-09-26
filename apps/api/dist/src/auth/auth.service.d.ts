import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role, User, Tenant } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenService } from './services/token.service';
export type UserWithTenant = User & {
    tenant?: Tenant;
};
export type UserWithRequiredFields = {
    id: string;
    email: string;
    role: Role;
    tenantId: string;
    firstName: string | null;
    lastName: string | null;
    isActive: boolean;
    tenant?: Tenant;
};
type Tokens = {
    accessToken: string;
    refreshToken: string;
};
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private tokenService;
    private readonly SALT_ROUNDS;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, tokenService: TokenService);
    private readonly logger;
    private getDeviceInfo;
    private parseUserAgent;
    private detectOS;
    private detectDeviceType;
    validateUser(email: string, password: string): Promise<UserWithRequiredFields>;
    register(registerDto: RegisterDto): Promise<UserWithRequiredFields>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            tenantId: any;
            isActive: any;
        };
    }>;
    private generateJti;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logoutAllDevices(userId: string): Promise<{
        success: boolean;
    }>;
    getProfile(userId: string): Promise<any>;
    getTokens(userId: string, email: string, role: Role, tenantId: string): Promise<Tokens>;
    logout(userId: string, jti: string): Promise<void>;
    updateRefreshToken(userId: string, refreshToken: string, jti: string): Promise<void>;
}
export {};
