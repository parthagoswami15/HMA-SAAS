import { TenantType } from '@prisma/client';
declare const UpdateTenantDto_base: import("@nestjs/mapped-types").MappedType<any>;
export declare class UpdateTenantDto extends UpdateTenantDto_base {
    deletedAt?: Date | null;
    name?: string;
    slug?: string;
    type?: TenantType;
    address?: string;
    phone?: string;
    logo?: string;
    isActive?: boolean;
}
export {};
