import { Role } from '@prisma/client';
declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<any>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    role?: Role;
    isActive?: boolean;
}
export {};
