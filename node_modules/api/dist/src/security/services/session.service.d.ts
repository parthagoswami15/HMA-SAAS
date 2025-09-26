import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
export declare class SessionService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    createSession(userId: string, deviceInfo: any, ipAddress: string): Promise<any>;
    getSession(sessionId: string): Promise<any>;
    extendSession(sessionId: string): Promise<any>;
    revokeSession(sessionId: string, user: any): Promise<any>;
    revokeAllSessions(user: any): Promise<{
        revokedCount: any;
    }>;
    getUserSessions(user: any): Promise<any>;
    cleanupExpiredSessions(): Promise<{
        deletedCount: any;
    }>;
    getActiveSessionsCount(user: any): Promise<{
        userId: any;
        activeSessions: any;
    }>;
}
