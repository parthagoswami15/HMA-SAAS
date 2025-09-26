import { Repository } from 'typeorm';
import { Bed } from '../entities/bed.entity';
import { Ward } from '../entities/ward.entity';
import { BedStatus } from '../enums/bed-status.enum';
import { BedClass } from '../enums/bed-class.enum';
import { Admission } from '../entities/admission.entity';
export declare class BedWardService {
    private readonly bedRepository;
    private readonly wardRepository;
    private readonly admissionRepository;
    constructor(bedRepository: Repository<Bed>, wardRepository: Repository<Ward>, admissionRepository: Repository<Admission>);
    createWard(createWardDto: any): Promise<Ward[]>;
    findAllWards(filterDto?: any): Promise<{
        data: Ward[];
        total: number;
        page: any;
        totalPages: number;
    }>;
    findWardById(id: string): Promise<Ward>;
    updateWard(id: string, updateWardDto: any): Promise<Ward>;
    removeWard(id: string): Promise<Ward>;
    createBed(createBedDto: any): Promise<Bed[]>;
    findAllBeds(filterDto?: any): Promise<{
        data: Bed[];
        total: number;
        page: any;
        totalPages: number;
    }>;
    findBedById(id: string): Promise<Bed>;
    updateBed(id: string, updateBedDto: any): Promise<Bed>;
    updateBedStatus(bedId: string, status: BedStatus, updatedById: string): Promise<Bed>;
    removeBed(id: string): Promise<Bed>;
    getBedAvailability(filters?: {
        wardId?: string;
        bedClass?: BedClass;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        totalBeds: number;
        availableBeds: number;
        occupiedBeds: number;
        reservedBeds: number;
        maintenanceBeds: number;
        occupancyRate: number;
        beds: Bed[];
    }>;
    getWardOccupancy(wardId: string): Promise<{
        ward: {
            id: string;
            name: string;
            code: string;
            totalBeds: number;
            occupiedBeds: number;
            availableBeds: number;
            occupancyRate: number;
        };
        currentPatients: {
            bedId: string;
            bedNumber: string;
            admissionId: string;
            admissionDate: Date;
            patient: {
                id: any;
                mrn: any;
                name: string;
            } | null;
        }[];
    }>;
}
