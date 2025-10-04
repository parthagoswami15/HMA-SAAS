"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomPrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let CustomPrismaService = class CustomPrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    async findTokenByJti(jti) {
        return this.$queryRaw `SELECT * FROM "RefreshToken" WHERE jti = ${jti} LIMIT 1`
            .then((result) => {
            const tokens = Array.isArray(result) ? result : [];
            return tokens[0] || null;
        });
    }
    async upsertTokenBlacklist(params) {
        const { jti, userId, token, expiresAt, revoked } = params;
        return this.$executeRaw `
      INSERT INTO "RefreshToken" (jti, "userId", token, "expiresAt", revoked, "createdAt", "updatedAt")
      VALUES (${jti}, ${userId}, ${token}, ${expiresAt}, ${revoked}, NOW(), NOW())
      ON CONFLICT (jti) 
      DO UPDATE SET 
        revoked = EXCLUDED.revoked,
        "updatedAt" = NOW()
      RETURNING *
    `;
    }
    async revokeAllUserTokens(userId) {
        return this.refreshToken.updateMany({
            where: {
                userId,
                revoked: false
            },
            data: {
                revoked: true
            },
        });
    }
    async isTokenBlacklisted(jti) {
        const token = await this.refreshToken.findFirst({
            where: {
                jti,
                OR: [
                    { revoked: true },
                    { expiresAt: { lt: new Date() } }
                ]
            },
            select: { id: true }
        });
        return !!token;
    }
    async cleanupExpiredTokens() {
        const result = await this.refreshToken.deleteMany({
            where: {
                expiresAt: { lt: new Date() }
            }
        });
        return result.count;
    }
};
CustomPrismaService = __decorate([
    (0, common_1.Injectable)()
], CustomPrismaService);
exports.CustomPrismaService = CustomPrismaService;
//# sourceMappingURL=custom-prisma.service.js.map