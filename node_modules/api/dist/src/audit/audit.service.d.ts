import { PrismaService } from '../prisma/prisma.service';
export interface AuditLogEntry {
    tenantId: string;
    userId: string;
    action: string;
    resource: string;
    resourceId?: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    ipAddress: string;
    userAgent: string;
    timestamp: Date;
    metadata?: Record<string, any>;
    statusCode?: number;
}
export interface GetAuditLogsParams {
    tenantId: string;
    userId?: string;
    resource?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    limit: number;
    offset: number;
}
export interface GetLogsByUserParams {
    tenantId: string;
    userId: string;
    limit: number;
}
export interface GetLogsByResourceParams {
    tenantId: string;
    resource: string;
    limit: number;
}
type CreateAuditLogInput = Omit<AuditLogEntry, 'timestamp'> & {
    timestamp?: Date;
};
export declare class AuditService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    log(data: CreateAuditLogInput): Promise<any>;
    getAuditLogs(params: GetAuditLogsParams): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getAuditLogsByUser(params: GetLogsByUserParams): Promise<any>;
    getAuditLogsByResource(params: GetLogsByResourceParams): Promise<any>;
}
export {};
