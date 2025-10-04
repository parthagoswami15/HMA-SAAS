import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as BasePrismaClient } from '@prisma/client';
export declare class CustomPrismaService extends BasePrismaClient implements OnModuleInit, OnModuleDestroy {
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    findTokenByJti(jti: string): Promise<any>;
    upsertTokenBlacklist(params: {
        jti: string;
        userId: string;
        token: string;
        expiresAt: Date;
        revoked: boolean;
    }): Promise<number>;
    revokeAllUserTokens(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    isTokenBlacklisted(jti: string): Promise<boolean>;
    cleanupExpiredTokens(): Promise<number>;
}
export type PrismaService = CustomPrismaService;
