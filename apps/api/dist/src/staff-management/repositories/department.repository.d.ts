import { PrismaService } from '../../prisma/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Department, Prisma } from '@prisma/client';
type DepartmentWithRelations = Prisma.DepartmentGetPayload<{
    include: {
        headStaff: {
            select: {
                id: true;
                user: {
                    select: {
                        firstName: true;
                        lastName: true;
                        email: true;
                    };
                };
            };
        };
        parent: {
            select: {
                id: true;
                name: true;
                code: true;
            };
        };
        children: {
            select: {
                id: true;
                name: true;
                code: true;
                isActive: true;
                _count: {
                    select: {
                        staff: true;
                        children: true;
                    };
                };
            };
        };
        _count: {
            select: {
                staff: true;
                children: true;
            };
        };
    };
}>;
export declare class DepartmentRepository extends BaseRepository<'Department'> {
    protected readonly prismaDelegate: Prisma.DepartmentDelegate;
    protected readonly modelName = "Department";
    constructor(prisma: PrismaService);
    findByCode(tenantId: string, code: string): Promise<Department | null>;
    findDepartmentWithDetails(tenantId: string, departmentId: string): Promise<DepartmentWithRelations | null>;
    findManyWithDetails(tenantId: string, where?: Prisma.DepartmentWhereInput, options?: {
        skip?: number;
        take?: number;
        orderBy?: Prisma.DepartmentOrderByWithRelationInput | Prisma.DepartmentOrderByWithRelationInput[];
    }): Promise<{
        data: DepartmentWithRelations[];
        total: number;
    }>;
    getDepartmentHierarchy(tenantId: string): Promise<DepartmentWithRelations[]>;
    getStaffCountByDepartment(tenantId: string): Promise<Array<{
        departmentId: string | null;
        departmentName: string;
        count: number;
    }>>;
    updateDepartment(tenantId: string, departmentId: string, data: Prisma.DepartmentUpdateInput): Promise<DepartmentWithRelations>;
    assignDepartmentHead(tenantId: string, departmentId: string, staffId: string): Promise<DepartmentWithRelations>;
    removeDepartmentHead(tenantId: string, departmentId: string): Promise<DepartmentWithRelations>;
    getDepartmentStaff(tenantId: string, departmentId: string, includeSubDepartments?: boolean): Promise<Array<{
        id: string;
        employeeId: string;
        designation: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
        };
        roles: Array<{
            id: string;
            name: string;
        }>;
    }>>;
    private getChildDepartmentIds;
    private getDefaultInclude;
}
export {};
