import { BedWardService } from '../services/bed-ward.service';
import { CreateWardDto } from '../dto/create-ward.dto';
import { UpdateWardDto } from '../dto/update-ward.dto';
import { CreateBedDto } from '../dto/create-bed.dto';
import { UpdateBedDto } from '../dto/update-bed.dto';
import { BedStatus } from '../enums/bed-status.enum';
import { BedClass } from '../enums/bed-class.enum';
export declare class BedWardController {
    private readonly bedWardService;
    constructor(bedWardService: BedWardService);
    createWard(createWardDto: CreateWardDto): Promise<import("../entities/ward.entity").Ward[]>;
    getWards(includeBeds?: boolean): Promise<any>;
    getWardById(wardId: string, includeBeds?: boolean): Promise<any>;
    updateWard(wardId: string, updateWardDto: UpdateWardDto): Promise<import("../entities/ward.entity").Ward>;
    deleteWard(wardId: string): Promise<any>;
    addBedToWard(wardId: string, createBedDto: CreateBedDto): Promise<any>;
    getAvailableBeds(wardId?: string, bedClass?: BedClass): Promise<any>;
    getOccupiedBeds(wardId?: string): Promise<any>;
    getBedById(bedId: string): Promise<any>;
    updateBed(bedId: string, updateBedDto: UpdateBedDto): Promise<import("../entities/bed.entity").Bed>;
    removeBed(bedId: string): Promise<import("../entities/bed.entity").Bed>;
    updateBedStatus(bedId: string, status: BedStatus, updatedById: string, notes?: string): Promise<import("../entities/bed.entity").Bed>;
    getBedStatistics(): Promise<any>;
    getBedOccupancyReport(wardId?: string, startDate?: string, endDate?: string): Promise<any>;
}
