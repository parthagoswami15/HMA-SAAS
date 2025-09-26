import { OTService } from '../services/ot.service';
import { CreateSurgeryDto } from '../dto/create-surgery.dto';
import { UpdateSurgeryDto } from '../dto/update-surgery.dto';
import { SurgeryStatus } from '../enums/surgery-status.enum';
import { CreateOTTheaterDto } from '../dto/create-ot-theater.dto';
import { UpdateOTTheaterDto } from '../dto/update-ot-theater.dto';
export declare class OTController {
    private readonly otService;
    constructor(otService: OTService);
    scheduleSurgery(createSurgeryDto: CreateSurgeryDto): Promise<any>;
    getSurgeries(status?: SurgeryStatus, surgeonId?: string, patientId?: string, startDate?: string, endDate?: string): Promise<any>;
    getSurgeryById(surgeryId: string): Promise<any>;
    updateSurgery(surgeryId: string, updateSurgeryDto: UpdateSurgeryDto): Promise<any>;
    updateSurgeryStatus(surgeryId: string, status: SurgeryStatus, updatedById: string, notes?: string): Promise<any>;
    getPatientSurgeries(patientId: string): Promise<any>;
    addTheater(createTheaterDto: CreateOTTheaterDto): Promise<any>;
    getTheaters(includeSchedule?: boolean): Promise<any>;
    getTheaterById(theaterId: string, includeSchedule?: boolean): Promise<any>;
    updateTheater(theaterId: string, updateTheaterDto: UpdateOTTheaterDto): Promise<any>;
    checkTheaterAvailability(theaterId: string, startTime: string, endTime: string): Promise<any>;
    getUpcomingSurgeries(days?: number): Promise<any>;
    getSurgeonSchedule(surgeonId: string, startDate?: string, endDate?: string): Promise<any>;
    addSurgeryNotes(surgeryId: string, notes: string, addedById: string, isCritical?: boolean): Promise<any>;
    recordComplications(surgeryId: string, description: string, severity: 'MILD' | 'MODERATE' | 'SEVERE', actionTaken: string, recordedById: string): Promise<any>;
    getOTDashboardStats(): Promise<any>;
}
