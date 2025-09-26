import { ChambersService } from './chambers.service';
import { CreateChamberDto, UpdateChamberDto } from './dto/chamber.dto';
export declare class ChambersController {
    private chambersService;
    constructor(chambersService: ChambersService);
    createChamber(tenant: any, user: any, createChamberDto: CreateChamberDto): Promise<any>;
    getChambers(tenant: any, doctorId?: string): Promise<any>;
    getChamberById(tenant: any, id: string): Promise<any>;
    updateChamber(tenant: any, id: string, updateChamberDto: UpdateChamberDto): Promise<any>;
    deleteChamber(tenant: any, id: string): Promise<any>;
    bookAppointment(tenant: any, chamberId: string, appointmentData: any): Promise<any>;
}
