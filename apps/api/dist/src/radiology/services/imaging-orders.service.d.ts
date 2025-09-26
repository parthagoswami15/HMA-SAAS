import { PrismaService } from '../../prisma/prisma.service';
import { CreateImagingOrderDto, UpdateImagingOrderDto, ScheduleImagingOrderDto, ImagingOrderFilterDto, ImagingOrderListDto } from '../dto/imaging-orders.dto';
import { ImagingOrder } from '@prisma/client';
export declare class ImagingOrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateImagingOrderDto, userId: string): Promise<ImagingOrder>;
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
    cancel(id: string, reason: string): Promise<ImagingOrder>;
    complete(id: string): Promise<ImagingOrder>;
    private generateOrderNumber;
    private handleContrastAllergy;
    private handlePregnancyProtocol;
    getPatientHistory(patientId: string): Promise<ImagingOrder[]>;
    getStats(tenantId: string): Promise<{
        total: any;
        today: any;
        byStatus: {
            [k: string]: any;
        };
        byModality: {
            [k: string]: any;
        };
    }>;
}
