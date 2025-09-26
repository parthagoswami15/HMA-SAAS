import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CustomPrismaService } from '../../prisma/custom-prisma.service';
import { Role } from '@prisma/client';
export interface TokenPayload {
    sub: string;
    email: string;
    role: Role;
    tenantId: string;
    jti: string;
    iat?: number;
    exp?: number;
    type?: 'access' | 'refresh';
}
type UserWithRequiredFields = {
    id: string;
    email: string;
    role: Role;
    tenantId: string;
    [key: string]: any;
};
export declare class TokenService {
    private readonly jwtService;
    private readonly configService;
    private readonly prisma;
    constructor(jwtService: JwtService, configService: ConfigService, prisma: CustomPrismaService);
    private readonly logger;
    generateTokens(user: UserWithRequiredFields, jti: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private generateAccessToken;
    private generateRefreshToken;
    verifyAccessToken(token: string): Promise<TokenPayload>;
    verifyRefreshToken(token: string): Promise<TokenPayload>;
    revokeToken(jti: string, userId: string, token: string, expiresAt: Date): Promise<void>;
    revokeAllUserTokens(userId: string): Promise<void>;
    private hashToken;
}
export {};
