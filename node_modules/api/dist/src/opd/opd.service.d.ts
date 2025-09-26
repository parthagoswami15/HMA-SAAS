import { PrismaService } from '../prisma/prisma.service';
export declare class OpdService {
    private prisma;
    constructor(prisma: PrismaService);
    createEncounter(tenantId: string, data: {
        patientId: string;
        doctorId: string;
        type: string;
        occurredAt?: Date;
        vitals?: any;
        diagnosis?: string;
        procedures?: any;
        notes?: string;
    }): any;
    getEncounter(tenantId: string, id: string): Promise<any>;
    listEncounters(tenantId: string): any;
    updateEncounter(tenantId: string, id: string, data: any): Promise<any>;
}
