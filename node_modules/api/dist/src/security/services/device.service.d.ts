import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
export declare class DeviceService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    getUserDevices(user: any): Promise<any>;
    trustDevice(trustDto: any, user: any): Promise<any>;
    revokeDevice(deviceId: string, user: any): Promise<{
        success: boolean;
    }>;
    updateDeviceActivity(userId: string, deviceId: string): Promise<void>;
    isDeviceTrusted(userId: string, deviceId: string): Promise<boolean>;
    getDeviceStats(user: any): Promise<{
        userId: any;
        totalDevices: any;
        activeDevices: any;
        inactiveDevices: number;
        devicesByType: any;
    }>;
}
