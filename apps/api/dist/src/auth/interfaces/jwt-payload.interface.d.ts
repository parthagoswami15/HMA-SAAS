import { Role } from '@prisma/client';
export interface JwtPayload {
    sub: string;
    jti: string;
    iat: number;
    exp: number;
    email: string;
    role: Role;
    tenantId: string;
    [key: string]: any;
}
export interface RequestWithUser extends Request {
    user: JwtPayload & {
        permissions?: string[];
    };
}
