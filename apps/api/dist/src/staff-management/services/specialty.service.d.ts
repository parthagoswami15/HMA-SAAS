import { PrismaService } from '../../prisma/prisma.service';
import { ISpecialty, ICreateSpecialty, IUpdateSpecialty, ISpecialtyFilterOptions, IStaffSpecialty, ICreateStaffSpecialty, IUpdateStaffSpecialty } from '../interfaces/specialty.interface';
import { PaginatedResponse } from '../../common/interfaces';
export declare class SpecialtyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, createSpecialtyDto: ICreateSpecialty): Promise<ISpecialty>;
    findAll(tenantId: string, options?: ISpecialtyFilterOptions): Promise<PaginatedResponse<ISpecialty>>;
    findById(tenantId: string, id: string): Promise<ISpecialty>;
    findByCode(tenantId: string, code: string): Promise<ISpecialty | null>;
    update(tenantId: string, id: string, updateSpecialtyDto: IUpdateSpecialty): Promise<ISpecialty>;
    delete(tenantId: string, id: string): Promise<{
        success: boolean;
    }>;
    assignSpecialtiesToStaff(tenantId: string, staffId: string, specialties: ICreateStaffSpecialty[]): Promise<{
        success: boolean;
    }>;
    updateStaffSpecialties(tenantId: string, staffId: string, specialties: ICreateStaffSpecialty[]): Promise<{
        success: boolean;
    }>;
    getStaffSpecialties(staffId: string): Promise<IStaffSpecialty[]>;
    updateStaffSpecialty(tenantId: string, staffId: string, specialtyId: string, updateData: IUpdateStaffSpecialty): Promise<IStaffSpecialty>;
    validateSpecialtiesExist(tenantId: string, specialtyIds: string[]): Promise<void>;
    getCountBySpecialty(tenantId: string): Promise<{
        specialtyId: string;
        specialtyName: string;
        count: number;
    }[]>;
}
