import { PrismaService } from '../../prisma/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Role, Prisma } from '@prisma/client';
type RoleWithPermissions = Prisma.RoleGetPayload<{
    include: {
        permissions: {
            select: {
                permission: {
                    select: {
                        id: true;
                        key: true;
                        name: true;
                        description: true;
                        module: true;
                        isActive: boolean;
                    };
                };
            };
        };
        staff: {
            select: {
                staff: {
                    select: {
                        id: true;
                        employeeId: true;
                        user: {
                            select: {
                                firstName: true;
                                lastName: true;
                                email: true;
                            };
                        };
                    };
                };
            };
        };
        _count: {
            select: {
                staff: true;
                permissions: true;
            };
        };
    };
}>;
export declare class RoleRepository extends BaseRepository<'Role'> {
    protected readonly prismaDelegate: Prisma.RoleDelegate;
    protected readonly modelName = "Role";
    constructor(prisma: PrismaService);
    findByName(tenantId: string, name: string): Promise<Role | null>;
    findRoleWithDetails(tenantId: string, roleId: string): Promise<RoleWithPermissions | null>;
    findManyWithDetails(tenantId: string, where?: Prisma.RoleWhereInput, options?: {
        skip?: number;
        take?: number;
        orderBy?: Prisma.RoleOrderByWithRelationInput | Prisma.RoleOrderByWithRelationInput[];
    }): Promise<{
        data: RoleWithPermissions[];
        total: number;
    }>;
    assignPermissions(tenantId: string, roleId: string, permissionKeys: string[]): Promise<void>;
    getStaffWithRole(tenantId: string, roleId: string): Promise<Array<{
        id: string;
        employeeId: string;
        user: {
            firstName: string;
            lastName: string;
            email: string;
        };
    }>>;
    assignRoleToStaff(tenantId: string, roleId: string, staffId: string, assignedBy: string, isPrimary?: boolean): Promise<void>;
    removeRoleFromStaff(tenantId: string, roleId: string, staffId: string): Promise<void>;
    private getDefaultInclude;
}
export {};
