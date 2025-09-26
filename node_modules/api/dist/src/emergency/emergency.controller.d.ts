import { EmergencyService } from './emergency.service';
import { CreateEmergencyCaseDto, UpdateEmergencyCaseDto } from './dto/emergency.dto';
export declare class EmergencyController {
    private emergencyService;
    constructor(emergencyService: EmergencyService);
    createEmergencyCase(tenant: any, createEmergencyCaseDto: CreateEmergencyCaseDto): Promise<any>;
    getEmergencyCases(tenant: any, status?: string): Promise<any>;
    getEmergencyCaseById(tenant: any, id: string): Promise<any>;
    updateEmergencyCase(tenant: any, id: string, updateEmergencyCaseDto: UpdateEmergencyCaseDto): Promise<any>;
    dischargeEmergencyCase(tenant: any, id: string, notes?: string): Promise<any>;
    admitEmergencyCase(tenant: any, id: string, roomId?: string): Promise<any>;
    getTriageStats(tenant: any): Promise<any>;
}
