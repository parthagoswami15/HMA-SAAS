import { TenantType } from '@prisma/client';
export declare class CreateTenantDto {
    name: string;
    slug?: string;
    type?: TenantType;
    address?: string;
    phone?: string;
    email?: string;
    logo?: string;
    isActive?: boolean;
}
