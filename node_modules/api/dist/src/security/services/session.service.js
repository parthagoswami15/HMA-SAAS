"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SessionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("./audit.service");
const crypto = __importStar(require("crypto"));
let SessionService = SessionService_1 = class SessionService {
    prisma;
    auditService;
    logger = new common_1.Logger(SessionService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async createSession(userId, deviceInfo, ipAddress) {
        this.logger.log(`Creating session for user: ${userId}`);
        const sessionId = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
        const session = await this.prisma.session.create({
            data: {
                id: sessionId,
                userId,
                ipAddress,
                userAgent: deviceInfo?.userAgent || '',
                deviceInfo: JSON.stringify(deviceInfo),
                expiresAt,
            },
        });
        return session;
    }
    async getSession(sessionId) {
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        isActive: true,
                        mfaEnabled: true,
                        roles: true,
                    },
                },
            },
        });
        if (!session || session.expiresAt < new Date()) {
            return null;
        }
        return session;
    }
    async extendSession(sessionId) {
        this.logger.log(`Extending session: ${sessionId}`);
        const session = await this.prisma.session.update({
            where: { id: sessionId },
            data: {
                expiresAt: new Date(Date.now() + 30 * 60 * 1000),
                lastActivity: new Date(),
            },
        });
        return session;
    }
    async revokeSession(sessionId, user) {
        this.logger.log(`Revoking session: ${sessionId}`);
        const session = await this.prisma.session.update({
            where: { id: sessionId },
            data: {
                revokedAt: new Date(),
                revokedBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'SESSION_REVOKED',
            entityType: 'SESSION',
            entityId: sessionId,
            userId: user.id,
        });
        return session;
    }
    async revokeAllSessions(user) {
        this.logger.log(`Revoking all sessions for user: ${user.id}`);
        const sessions = await this.prisma.session.updateMany({
            where: { userId: user.id },
            data: {
                revokedAt: new Date(),
                revokedBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'ALL_SESSIONS_REVOKED',
            entityType: 'USER',
            entityId: user.id,
            userId: user.id,
        });
        return { revokedCount: sessions.count };
    }
    async getUserSessions(user) {
        const sessions = await this.prisma.session.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });
        return sessions.map(session => ({
            id: session.id,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
            deviceInfo: JSON.parse(session.deviceInfo || '{}'),
            createdAt: session.createdAt,
            expiresAt: session.expiresAt,
            lastActivity: session.lastActivity,
            isActive: session.expiresAt > new Date() && !session.revokedAt,
        }));
    }
    async cleanupExpiredSessions() {
        this.logger.log('Cleaning up expired sessions');
        const expiredSessions = await this.prisma.session.deleteMany({
            where: {
                expiresAt: { lt: new Date() },
            },
        });
        return { deletedCount: expiredSessions.count };
    }
    async getActiveSessionsCount(user) {
        const count = await this.prisma.session.count({
            where: {
                userId: user.id,
                expiresAt: { gt: new Date() },
                revokedAt: null,
            },
        });
        return { userId: user.id, activeSessions: count };
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = SessionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], SessionService);
//# sourceMappingURL=session.service.js.map