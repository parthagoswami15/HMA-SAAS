import { SpecialtyService } from '../services/specialty.service';
import { SpecialtyResponseDto, CreateSpecialtyDto, UpdateSpecialtyDto, SpecialtyFilterDto, StaffSpecialtyResponseDto, CreateStaffSpecialtyDto, UpdateStaffSpecialtyDto } from '../dto';
import { IUser } from '../../user/interfaces';
import { PaginatedResponse } from '../../common/interfaces';
export declare class SpecialtyController {
    private readonly specialtyService;
    constructor(specialtyService: SpecialtyService);
    create(user: IUser, createSpecialtyDto: CreateSpecialtyDto): Promise<SpecialtyResponseDto>;
    findAll(user: IUser, filterDto: SpecialtyFilterDto): Promise<PaginatedResponse<SpecialtyResponseDto>>;
    countBySpecialty(user: IUser): Promise<Array<{
        specialtyId: string;
        specialtyName: string;
        count: number;
    }>>;
    findOne(user: IUser, id: string): Promise<SpecialtyResponseDto>;
    findByCode(user: IUser, code: string): Promise<SpecialtyResponseDto>;
    update(user: IUser, id: string, updateSpecialtyDto: UpdateSpecialtyDto): Promise<SpecialtyResponseDto>;
    remove(user: IUser, id: string): Promise<void>;
    assignSpecialties(user: IUser, staffId: string, specialties: CreateStaffSpecialtyDto[]): Promise<{
        success: boolean;
    }>;
    updateStaffSpecialties(user: IUser, staffId: string, specialties: CreateStaffSpecialtyDto[]): Promise<{
        success: boolean;
    }>;
    getStaffSpecialties(staffId: string): Promise<StaffSpecialtyResponseDto[]>;
    updateStaffSpecialty(user: IUser, staffId: string, specialtyId: string, updateData: UpdateStaffSpecialtyDto): Promise<StaffSpecialtyResponseDto>;
    removeStaffSpecialty(staffId: string, specialtyId: string): Promise<void>;
}
