import { Role } from '@prisma/client';
export interface TokenPayload {
    sub: string;
    email: string;
    role: Role;
    tenantId?: string;
    jti?: string;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface JwtConfig {
    secret: string;
    expiresIn: string;
}
export interface AuthUser {
    id: string;
    sub: string;
    email: string;
    role: string;
    tenantId?: string;
    firstName: string | null;
    lastName: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    jti?: string;
}
