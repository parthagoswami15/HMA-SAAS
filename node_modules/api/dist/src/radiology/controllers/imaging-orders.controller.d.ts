import { ImagingOrdersService } from '../services/imaging-orders.service';
import { CreateImagingOrderDto, UpdateImagingOrderDto, ScheduleImagingOrderDto, ImagingOrderFilterDto, ImagingOrderListDto } from '../dto/imaging-orders.dto';
export declare class ImagingOrdersController {
    private readonly imagingOrdersService;
    constructor(imagingOrdersService: ImagingOrdersService);
    create(createDto: CreateImagingOrderDto, req: any): Promise<ImagingOrder>;
    findAll(filterDto: ImagingOrderFilterDto, listDto: ImagingOrderListDto): Promise<{
        data: ImagingOrder[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<ImagingOrder>;
    update(id: string, updateDto: UpdateImagingOrderDto): Promise<ImagingOrder>;
    schedule(id: string, scheduleDto: ScheduleImagingOrderDto): Promise<ImagingOrder>;
    complete(id: string): Promise<ImagingOrder>;
    cancel(id: string, reason: string): Promise<ImagingOrder>;
    getPatientHistory(patientId: string): Promise<ImagingOrder[]>;
    getStats(req: any): Promise<{
        total: any;
        today: any;
        byStatus: {
            [k: string]: any;
        };
        byModality: {
            [k: string]: any;
        };
    }>;
    remove(id: string): Promise<void>;
}
