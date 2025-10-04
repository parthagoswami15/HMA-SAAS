import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor();
    tokenBlacklist: {
        findUnique: (args: {
            where: {
                jti: string;
                tenantId: string;
            };
        }) => Promise<any>;
        upsert: (args: {
            where: {
                jti: string;
                tenantId: string;
            };
            update: {
                revoked: boolean;
                reason: string;
                updatedAt: Date;
            };
            create: {
                jti: string;
                userId: string;
                tenantId: string;
                token: string;
                expiresAt: Date;
                revoked: boolean;
                reason: string;
            };
        }) => Promise<any>;
        updateMany: (args: {
            where: {
                userId: string;
                tenantId: string;
            };
            data: {
                revoked: boolean;
                reason: string;
                updatedAt: Date;
            };
        }) => Promise<any>;
    };
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
