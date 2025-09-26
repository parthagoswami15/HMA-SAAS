import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
type TokenPayload = {
    sub: string;
    email: string;
    role: string;
    tenantId?: string;
};
export declare class JwtService {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: NestJwtService, configService: ConfigService);
    generateTokens(payload: TokenPayload): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    verifyToken(token: string, isRefreshToken?: boolean): Promise<any>;
    getTokenFromHeader(authHeader: string | undefined): string;
}
export {};
