import { LabOrdersService } from '../services/lab-orders.service';
import { CreateLabOrderDto, UpdateLabOrderDto, LabOrderResponseDto } from '../dto/lab-order.dto';
export declare class LabOrdersController {
    private readonly labOrdersService;
    constructor(labOrdersService: LabOrdersService);
    createOrder(createOrderDto: CreateLabOrderDto): Promise<LabOrderResponseDto>;
    getAllOrders(patientId?: string, status?: string, priority?: string, dateFrom?: string, dateTo?: string): Promise<LabOrderResponseDto[]>;
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
}
