import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantResponseDto } from './dto/tenant-response.dto';
interface FindAllParams {
    skip?: number;
    take?: number;
    cursor?: Prisma.TenantWhereUniqueInput;
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithRelationInput;
    includeDeleted?: boolean;
}
export declare class TenantsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createTenantDto: CreateTenantDto): Promise<TenantResponseDto>;
    findAll(params?: FindAllParams): Promise<TenantResponseDto[]>;
    findOne(id: string, includeDeleted?: boolean): Promise<TenantResponseDto>;
    update(id: string, updateTenantDto: UpdateTenantDto): Promise<TenantResponseDto>;
    remove(id: string): Promise<void>;
    isSlugTaken(slug: string, excludeId?: string): Promise<boolean>;
    count(where?: Prisma.TenantWhereInput): Promise<number>;
}
export {};
