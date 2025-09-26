import { PrismaService } from '../../prisma/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Staff, Prisma } from '@prisma/client';
type StaffWithRelations = Prisma.StaffGetPayload<{
    include: {
        user: {
            select: {
                id: true;
                firstName: true;
                lastName: true;
                email: true;
                phone: true;
            };
        };
        department: {
            select: {
                id: true;
                name: true;
                code: true;
            };
        };
        roles: {
            select: {
                role: {
                    select: {
                        id: true;
                        name: true;
                        description: true;
                    };
                };
            };
        };
        specialties: {
            select: {
                id: true;
                isPrimary: true;
                experience: true;
                notes: true;
                specialty: {
                    select: {
                        id: true;
                        name: true;
                        code: true;
                        category: true;
                    };
                };
            };
        };
    };
}>;
export declare class StaffRepository extends BaseRepository<'Staff'> {
    protected readonly prismaDelegate: Prisma.StaffDelegate;
    protected readonly modelName = "Staff";
    constructor(prisma: PrismaService);
    findByEmployeeId(tenantId: string, employeeId: string): Promise<Staff | null>;
    findByUserId(tenantId: string, userId: string): Promise<StaffWithRelations | null>;
    findStaffWithDetails(tenantId: string, staffId: string): Promise<StaffWithRelations | null>;
    findManyWithDetails(tenantId: string, where?: Prisma.StaffWhereInput, options?: {
        skip?: number;
        take?: number;
        orderBy?: Prisma.StaffOrderByWithRelationInput | Prisma.StaffOrderByWithRelationInput[];
    }): Promise<{
        data: StaffWithRelations[];
        total: number;
    }>;
    updateStaff(tenantId: string, staffId: string, data: Prisma.StaffUpdateInput): Promise<StaffWithRelations>;
    softDelete(tenantId: string, staffId: string): Promise<Staff>;
    assignRoles(tenantId: string, staffId: string, roleIds: string[], assignedBy: string): Promise<void>;
    assignSpecialties(tenantId: string, staffId: string, specialties: Array<{
        specialtyId: string;
        isPrimary?: boolean;
        experience?: number;
        notes?: string;
    }>, assignedBy: string): Promise<void>;
    logAudit(tenantId: string, staffId: string, action: string, field?: string, oldValue?: any, newValue?: any, performedBy?: string, ipAddress?: string, userAgent?: string): Promise<void>;
    private getDefaultInclude;
}
export {};
