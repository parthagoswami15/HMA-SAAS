import { Request as ExpressRequest } from 'express';
import { AuditService } from './audit.service';
import type { AuditLogEntry } from './audit.service';
import { Role } from '@prisma/client';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    createAuditLog(entry: Omit<AuditLogEntry, 'tenantId' | 'userId' | 'ipAddress' | 'userAgent'>, user: {
        id: string;
        tenantId: string;
        role: Role;
    }, req: ExpressRequest): Promise<any>;
    getAuditLogs(user: any, userId?: string, resource?: string, action?: string, startDate?: string, endDate?: string, limit?: string, offset?: string): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getAuditLogsByUser(user: any, userId: string, limit?: string): Promise<any>;
    getAuditLogsByResource(user: any, resource: string, limit?: string): Promise<any>;
}
