import { PrismaService } from '../prisma/prisma.service';
import { CreateEmergencyCaseDto, UpdateEmergencyCaseDto } from './dto/emergency.dto';
export declare class EmergencyService {
    private prisma;
    constructor(prisma: PrismaService);
    createEmergencyCase(tenantId: string, data: CreateEmergencyCaseDto): Promise<any>;
    getEmergencyCases(tenantId: string, status?: string): Promise<any>;
    getEmergencyCaseById(tenantId: string, id: string): Promise<any>;
    updateEmergencyCase(tenantId: string, id: string, data: UpdateEmergencyCaseDto): Promise<any>;
    dischargeEmergencyCase(tenantId: string, id: string, notes?: string): Promise<any>;
    admitEmergencyCase(tenantId: string, id: string, roomId?: string): Promise<any>;
    getTriageStats(tenantId: string): Promise<any>;
}
