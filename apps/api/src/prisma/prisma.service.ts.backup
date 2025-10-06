import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { INestApplication } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'pretty',
    });
  }

  // Add tokenBlacklist property with proper typing
  tokenBlacklist: {
    findUnique: (args: { where: { jti: string; tenantId: string } }) => Promise<any>;
    upsert: (args: {
      where: { jti: string; tenantId: string };
      update: { revoked: boolean; reason: string; updatedAt: Date };
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
      where: { userId: string; tenantId: string };
      data: { revoked: boolean; reason: string; updatedAt: Date };
    }) => Promise<any>;
  };

  async onModuleInit() {
    await this.$connect();
    
    // Initialize tokenBlacklist with proper typing
    this.tokenBlacklist = {
      findUnique: async (args: { where: { jti: string; tenantId: string } }) => {
        return this.refreshToken.findFirst({
          where: {
            jti: args.where.jti,
            tenantId: args.where.tenantId,
          },
        });
      },
      
      upsert: async (args: {
        where: { jti: string; tenantId: string };
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
      }) => {
        return this.refreshToken.upsert({
          where: {
            jti: args.where.jti,
          },
          update: args.update,
          create: args.create,
        });
      },
      
      updateMany: async (args: {
        where: { userId: string; tenantId: string };
        data: { revoked: boolean; reason: string; updatedAt: Date };
      }) => {
        return this.refreshToken.updateMany({
          where: {
            userId: args.where.userId,
            tenantId: args.where.tenantId,
          },
          data: args.data,
        });
      },
    };
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}


