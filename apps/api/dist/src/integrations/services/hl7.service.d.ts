import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class Hl7Service {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    processHl7Message(hl7Dto: any, user: any): Promise<{
        messageId: any;
        messageType: any;
        status: string;
        result: {
            admissionId: any;
            patientId: any;
        } | {
            patientId: any;
            observationCount: number;
            observations: any[];
        } | {
            orderId: any;
            patientId: any;
        };
    }>;
    processAdmitMessage(admitDto: any, user: any): Promise<{
        admissionId: any;
        patientId: any;
    }>;
    processDischargeMessage(dischargeDto: any, user: any): Promise<{
        admissionId: any;
        patientId: any;
    }>;
    processObservationMessage(observationDto: any, user: any): Promise<{
        patientId: any;
        observationCount: number;
        observations: any[];
    }>;
    processOrderMessage(orderDto: any, user: any): Promise<{
        orderId: any;
        patientId: any;
    }>;
    getHl7Message(messageId: string, user: any): Promise<{
        id: any;
        messageType: any;
        messageContent: any;
        sourceSystem: any;
        processedAt: any;
        status: any;
    }>;
    syncData(messageType: string, syncFrom: Date, syncTo: Date, tenantId: string): Promise<{
        messageType: string;
        syncedFrom: Date;
        syncedTo: Date;
        recordsProcessed: number;
        errors: never[];
    }>;
    getStatus(tenantId: string): Promise<{
        integrationType: string;
        status: string;
        lastSyncAt: any;
        isActive: any;
    }>;
    getStats(tenantId: string): Promise<{
        totalMessages: any;
        processedMessages: any;
        failedMessages: any;
        messagesByType: any;
    }>;
    retryOperation(log: any): Promise<{
        success: boolean;
        message: string;
    }>;
    private parseHl7Message;
}
