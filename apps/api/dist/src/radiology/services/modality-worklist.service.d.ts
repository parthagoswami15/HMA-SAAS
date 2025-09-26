import { PrismaService } from '../../prisma/prisma.service';
import { ModalityWorklistDto } from '../dto/modalities.dto';
export declare class ModalityWorklistService {
    private prisma;
    constructor(prisma: PrismaService);
    getWorklist(modalityId: string): Promise<any[]>;
    sendToWorklist(modalityId: string, worklistDto: ModalityWorklistDto): Promise<any>;
    updateWorklistStatus(worklistEntryId: string, status: string): Promise<any>;
    getWorklistByModality(modalityId: string, date?: Date): Promise<any[]>;
    getPendingWorklistItems(tenantId: string): Promise<any[]>;
    cleanupOldWorklistEntries(daysOld?: number): Promise<any>;
}
