import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardsService {
    private prisma;
    constructor(prisma: PrismaService);
    overview(tenantId: string): Promise<{
        patients: any;
        invoices: any;
        labOrders: any;
    }>;
}
