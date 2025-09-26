import { PrismaService } from '../../prisma/prisma.service';
import { CreateSampleDto, SampleResponseDto, SampleStatus } from '../dto/lab-order.dto';
export declare class LabSamplesService {
    private prisma;
    constructor(prisma: PrismaService);
    createSample(createSampleDto: CreateSampleDto): Promise<SampleResponseDto>;
    getAllSamples(filters?: any): Promise<SampleResponseDto[]>;
    getSampleById(id: string): Promise<SampleResponseDto>;
    updateSample(id: string, updateData: Partial<CreateSampleDto>): Promise<SampleResponseDto>;
    deleteSample(id: string): Promise<{
        message: string;
    }>;
    collectSample(id: string, collectedAt?: Date): Promise<SampleResponseDto>;
    receiveSample(id: string): Promise<SampleResponseDto>;
    processSample(id: string): Promise<SampleResponseDto>;
    storeSample(id: string): Promise<SampleResponseDto>;
    disposeSample(id: string): Promise<SampleResponseDto>;
    getSamplesByOrder(orderId: string): Promise<SampleResponseDto[]>;
    getSamplesByStatus(status: SampleStatus): Promise<SampleResponseDto[]>;
    getSamplesByType(sampleType: string): Promise<SampleResponseDto[]>;
    getExpiredSamples(): Promise<SampleResponseDto[]>;
    generateBarcode(id: string): Promise<{
        barcode: string;
    }>;
    private mapToResponseDto;
}
