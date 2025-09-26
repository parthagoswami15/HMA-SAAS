import { PrismaService } from '../prisma/prisma.service';
import { PatientsService } from '../patients/patients.service';
export declare class TestDataService {
    private prisma;
    private patientsService;
    constructor(prisma: PrismaService, patientsService: PatientsService);
    private readonly logger;
    createTestData(tenantId: string): Promise<{
        message: string;
        patients: number;
    }>;
    clearTestData(tenantId: string): Promise<{
        message: string;
    }>;
}
