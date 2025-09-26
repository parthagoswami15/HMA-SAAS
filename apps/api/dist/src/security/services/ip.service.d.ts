import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
export declare class IpService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    getIpAllowlist(tenantId: string): Promise<any>;
    addIpToAllowlist(ipDto: any, user: any): Promise<any>;
    removeIpFromAllowlist(ipId: string, user: any): Promise<{
        success: boolean;
    }>;
    isIpAllowed(ipAddress: string, tenantId: string): Promise<boolean>;
    getIpStats(tenantId: string): Promise<{
        tenantId: string;
        totalIps: any;
        activeIps: any;
        inactiveIps: number;
    }>;
    private isValidIpAddress;
}
