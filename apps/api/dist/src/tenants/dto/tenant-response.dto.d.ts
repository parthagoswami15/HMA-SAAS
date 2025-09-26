import { Tenant, TenantType } from '@prisma/client';
export declare class TenantResponseDto {
    id: string;
    name: string;
    slug: string;
    type: TenantType;
    address: string | null;
    phone: string | null;
    email: string | null;
    logo: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    constructor(partial: Partial<Tenant>);
}
