import { LabSamplesService } from '../services/lab-samples.service';
import { CreateSampleDto, SampleResponseDto, SampleStatus } from '../dto/lab-order.dto';
export declare class LabSamplesController {
    private readonly labSamplesService;
    constructor(labSamplesService: LabSamplesService);
    createSample(createSampleDto: CreateSampleDto): Promise<SampleResponseDto>;
    getAllSamples(orderId?: string, sampleType?: string, status?: SampleStatus, barcode?: string, dateFrom?: string, dateTo?: string): Promise<SampleResponseDto[]>;
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
}
