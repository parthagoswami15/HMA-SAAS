import { PrismaService } from '../prisma/prisma.service';
import { CreateLabTestDto, CreateLabOrderDto, CreateLabSampleDto, CreateLabResultDto } from './dto/lab.dto';
export declare class LabService {
    private prisma;
    constructor(prisma: PrismaService);
    createTest(tenantId: string, data: CreateLabTestDto): Promise<any>;
    listTests(tenantId: string): Promise<any>;
    getTestById(tenantId: string, testId: string): Promise<any>;
    orderTest(tenantId: string, data: CreateLabOrderDto): Promise<any>;
    listOrders(tenantId: string, status?: string): Promise<any>;
    getOrderById(tenantId: string, orderId: string): Promise<any>;
    updateOrderStatus(tenantId: string, orderId: string, status: string, resultUrl?: string): Promise<any>;
    createSample(tenantId: string, data: CreateLabSampleDto): Promise<any>;
    getSamples(tenantId: string, status?: string): Promise<any>;
    updateSampleStatus(tenantId: string, sampleId: string, status: string, location?: string): Promise<any>;
    createResult(tenantId: string, data: CreateLabResultDto): Promise<any>;
    verifyResult(tenantId: string, resultId: string, verifiedBy: string): Promise<any>;
    getResults(tenantId: string, orderId?: string): Promise<any>;
    getLabStats(tenantId: string): Promise<{
        orders: any;
        samples: any;
        pendingResults: any;
    }>;
}
