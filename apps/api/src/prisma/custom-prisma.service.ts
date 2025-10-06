import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as BasePrismaClient } from '@prisma/client';

// This is a custom Prisma client that includes our custom methods
@Injectable()
export class CustomPrismaService
  extends BasePrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Add custom methods for tokenBlacklist
  async findTokenByJti(jti: string) {
    return this
      .$queryRaw`SELECT * FROM "RefreshToken" WHERE jti = ${jti} LIMIT 1`.then(
      (result: unknown) => {
        const tokens = Array.isArray(result) ? result : [];
        return tokens[0] || null;
      },
    );
  }

  async upsertTokenBlacklist(params: {
    jti: string;
    userId: string;
    token: string;
    expiresAt: Date;
    revoked: boolean;
  }) {
    const { jti, userId, token, expiresAt, revoked } = params;

    return this.$executeRaw`
      INSERT INTO "RefreshToken" (jti, "userId", token, "expiresAt", revoked, "createdAt", "updatedAt")
      VALUES (${jti}, ${userId}, ${token}, ${expiresAt}, ${revoked}, NOW(), NOW())
      ON CONFLICT (jti) 
      DO UPDATE SET 
        revoked = EXCLUDED.revoked,
        "updatedAt" = NOW()
      RETURNING *
    `;
  }

  /**
   * Revoke all tokens for a user
   */
  async revokeAllUserTokens(userId: string) {
    return this.refreshToken.updateMany({
      where: {
        userId,
        revoked: false,
      },
      data: {
        revoked: true,
      },
    });
  }

  /**
   * Check if a token is blacklisted
   */
  async isTokenBlacklisted(jti: string): Promise<boolean> {
    const token = await this.refreshToken.findFirst({
      where: {
        jti,
        OR: [{ revoked: true }, { expiresAt: { lt: new Date() } }],
      },
      select: { id: true },
    });

    return !!token;
  }

  /**
   * Clean up expired tokens
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    return result.count;
  }
}

// This is the type that will be used throughout the app
export type PrismaService = CustomPrismaService;
