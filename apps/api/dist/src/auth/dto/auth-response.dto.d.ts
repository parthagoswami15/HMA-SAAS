import { User } from '@prisma/client';
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken?: string;
    user: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: string;
        tenantId: string;
    };
    constructor(user: User, tokens: {
        accessToken: string;
        refreshToken?: string;
    });
}
