import { PrismaService } from '../prisma/prisma.service';
import { CreateChamberDto, UpdateChamberDto } from './dto/chamber.dto';
export declare class ChambersService {
    private prisma;
    constructor(prisma: PrismaService);
    createChamber(tenantId: string, doctorId: string, data: CreateChamberDto): Promise<any>;
    getChambers(tenantId: string, doctorId?: string): Promise<any>;
    getChamberById(tenantId: string, id: string): Promise<any>;
    updateChamber(tenantId: string, id: string, data: UpdateChamberDto): Promise<any>;
    deleteChamber(tenantId: string, id: string): Promise<any>;
    bookAppointment(tenantId: string, chamberId: string, appointmentData: any): Promise<any>;
}
