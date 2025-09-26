import { PrismaService } from '../prisma/prisma.service';
export declare class IpdService {
    private prisma;
    constructor(prisma: PrismaService);
    createRoom(tenantId: string, data: {
        code: string;
        type: string;
        capacity?: number;
    }): any;
    listRooms(tenantId: string): any;
    admit(tenantId: string, data: {
        patientId: string;
        roomId: string;
        diagnosis?: string;
        notes?: string;
    }): Promise<any>;
    listAdmissions(tenantId: string): any;
    discharge(tenantId: string, id: string): Promise<any>;
}
