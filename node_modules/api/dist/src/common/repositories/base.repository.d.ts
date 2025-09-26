import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
type ModelName = Prisma.ModelName;
type ModelType<T extends ModelName> = T extends 'User' ? Prisma.UserDelegate : T extends 'Role' ? Prisma.RoleDelegate : T extends 'Permission' ? Prisma.PermissionDelegate : T extends 'Department' ? Prisma.DepartmentDelegate : T extends 'Staff' ? Prisma.StaffDelegate : T extends 'Specialty' ? Prisma.SpecialtyDelegate : T extends 'StaffRole' ? Prisma.StaffRoleDelegate : T extends 'RolePermission' ? Prisma.RolePermissionDelegate : T extends 'StaffSpecialty' ? Prisma.StaffSpecialtyDelegate : T extends 'StaffAuditLog' ? Prisma.StaffAuditLogDelegate : never;
type ModelCreateInput<T extends ModelName> = T extends 'User' ? Prisma.UserCreateInput : T extends 'Role' ? Prisma.RoleCreateInput : T extends 'Permission' ? Prisma.PermissionCreateInput : T extends 'Department' ? Prisma.DepartmentCreateInput : T extends 'Staff' ? Prisma.StaffCreateInput : T extends 'Specialty' ? Prisma.SpecialtyCreateInput : T extends 'StaffRole' ? Prisma.StaffRoleCreateInput : T extends 'RolePermission' ? Prisma.RolePermissionCreateInput : T extends 'StaffSpecialty' ? Prisma.StaffSpecialtyCreateInput : T extends 'StaffAuditLog' ? Prisma.StaffAuditLogCreateInput : never;
type ModelUpdateInput<T extends ModelName> = T extends 'User' ? Prisma.UserUpdateInput : T extends 'Role' ? Prisma.RoleUpdateInput : T extends 'Permission' ? Prisma.PermissionUpdateInput : T extends 'Department' ? Prisma.DepartmentUpdateInput : T extends 'Staff' ? Prisma.StaffUpdateInput : T extends 'Specialty' ? Prisma.SpecialtyUpdateInput : T extends 'StaffRole' ? Prisma.StaffRoleUpdateInput : T extends 'RolePermission' ? Prisma.RolePermissionUpdateInput : T extends 'StaffSpecialty' ? Prisma.StaffSpecialtyUpdateInput : T extends 'StaffAuditLog' ? Prisma.StaffAuditLogUpdateInput : never;
type ModelWhereInput<T extends ModelName> = T extends 'User' ? Prisma.UserWhereInput : T extends 'Role' ? Prisma.RoleWhereInput : T extends 'Permission' ? Prisma.PermissionWhereInput : T extends 'Department' ? Prisma.DepartmentWhereInput : T extends 'Staff' ? Prisma.StaffWhereInput : T extends 'Specialty' ? Prisma.SpecialtyWhereInput : T extends 'StaffRole' ? Prisma.StaffRoleWhereInput : T extends 'RolePermission' ? Prisma.RolePermissionWhereInput : T extends 'StaffSpecialty' ? Prisma.StaffSpecialtyWhereInput : T extends 'StaffAuditLog' ? Prisma.StaffAuditLogWhereInput : never;
type ModelSelect<T extends ModelName> = T extends 'User' ? Prisma.UserSelect : T extends 'Role' ? Prisma.RoleSelect : T extends 'Permission' ? Prisma.PermissionSelect : T extends 'Department' ? Prisma.DepartmentSelect : T extends 'Staff' ? Prisma.StaffSelect : T extends 'Specialty' ? Prisma.SpecialtySelect : T extends 'StaffRole' ? Prisma.StaffRoleSelect : T extends 'RolePermission' ? Prisma.RolePermissionSelect : T extends 'StaffSpecialty' ? Prisma.StaffSpecialtySelect : T extends 'StaffAuditLog' ? Prisma.StaffAuditLogSelect : never;
export declare abstract class BaseRepository<T extends ModelName> {
    protected readonly prisma: PrismaService;
    protected abstract readonly prismaDelegate: ModelType<T>;
    protected abstract readonly modelName: string;
    constructor(prisma: PrismaService);
    create<Select extends ModelSelect<T> = {}>(data: ModelCreateInput<T>, select?: Select): Promise<any>;
    findUnique<Select extends ModelSelect<T> = {}>(where: ModelWhereInput<T>, select?: Select): Promise<any>;
    findFirst<Select extends ModelSelect<T> = {}>(where: ModelWhereInput<T>, select?: Select): Promise<any>;
    findMany<Select extends ModelSelect<T> = {}>(where?: ModelWhereInput<T>, select?: Select, skip?: number, take?: number, orderBy?: any): Promise<any>;
    update<Select extends ModelSelect<T> = {}>(where: ModelWhereInput<T>, data: ModelUpdateInput<T>, select?: Select): Promise<any>;
    delete(where: ModelWhereInput<T>): Promise<any>;
    count(where?: ModelWhereInput<T>): Promise<number>;
    exists(where: ModelWhereInput<T>): Promise<boolean>;
    withTransaction(prisma: Prisma.TransactionClient): this;
}
export {};
