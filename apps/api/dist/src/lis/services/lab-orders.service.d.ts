import { PrismaService } from '../../prisma/prisma.service';
import { CreateLabOrderDto, UpdateLabOrderDto, LabOrderResponseDto } from '../dto/lab-order.dto';
import { LabBarcodeService } from './lab-barcode.service';
export declare class LabOrdersService {
    private prisma;
    private barcodeService;
    constructor(prisma: PrismaService, barcodeService: LabBarcodeService);
    createOrder(createOrderDto: CreateLabOrderDto): Promise<LabOrderResponseDto>;
    getAllOrders(filters: any): Promise<LabOrderResponseDto[]>;
    getOrderById(id: string): Promise<LabOrderResponseDto>;
    updateOrder(id: string, updateOrderDto: UpdateLabOrderDto): Promise<LabOrderResponseDto>;
    cancelOrder(id: string): Promise<{
        message: string;
    }>;
    collectOrder(id: string): Promise<LabOrderResponseDto>;
    accessionOrder(id: string): Promise<LabOrderResponseDto>;
    generateBarcode(id: string): Promise<{
        barcode: string;
    }>;
    private mapToResponseDto;
}
