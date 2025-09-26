import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantResponseDto } from './dto/tenant-response.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    create(createTenantDto: CreateTenantDto): Promise<TenantResponseDto>;
    findAll(page?: number, limit?: number, search?: string, isActive?: boolean, includeDeleted?: boolean): Promise<PaginatedResponseDto<TenantResponseDto>>;
    findOne(id: string, includeDeleted?: boolean): Promise<TenantResponseDto>;
    update(id: string, updateTenantDto: UpdateTenantDto): Promise<TenantResponseDto>;
    remove(id: string): Promise<void>;
    checkSlug(slug: string, excludeId?: string): Promise<{
        available: boolean;
        message: string;
    }>;
}
