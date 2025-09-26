import { PrismaService } from '../../prisma/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Specialty, Prisma } from '@prisma/client';
type SpecialtyWithRelations = Prisma.SpecialtyGetPayload<{
    include: {
        staffSpecialties: {
            select: {
                id: true;
                isPrimary: boolean;
                experience: number | null;
                notes: string | null;
                staff: {
                    select: {
                        id: true;
                        employeeId: string;
                        user: {
                            select: {
                                firstName: string;
                                lastName: string;
                                email: string;
                            };
                        };
                    };
                };
            };
        };
        _count: {
            select: {
                staffSpecialties: number;
            };
        };
    };
}>;
export declare class SpecialtyRepository extends BaseRepository<'Specialty'> {
    protected readonly prismaDelegate: Prisma.SpecialtyDelegate;
    protected readonly modelName = "Specialty";
    constructor(prisma: PrismaService);
    findByCode(tenantId: string, code: string): Promise<Specialty | null>;
    findSpecialtyWithDetails(tenantId: string, specialtyId: string): Promise<SpecialtyWithRelations | null>;
    findManyWithDetails(tenantId: string, where?: Prisma.SpecialtyWhereInput, options?: {
        skip?: number;
        take?: number;
        orderBy?: Prisma.SpecialtyOrderByWithRelationInput | Prisma.SpecialtyOrderByWithRelationInput[];
    }): Promise<{
        data: SpecialtyWithRelations[];
        total: number;
    }>;
    assignSpecialtyToStaff(tenantId: string, specialtyId: string, staffId: string, assignedBy: string, isPrimary?: boolean, experience?: number, notes?: string): Promise<void>;
    removeSpecialtyFromStaff(tenantId: string, specialtyId: string, staffId: string): Promise<void>;
    getStaffWithSpecialty(tenantId: string, specialtyId: string): Promise<Array<{
        id: string;
        staffId: string;
        isPrimary: boolean;
        experience: number | null;
        notes: string | null;
        assignedAt: Date;
        assignedBy: string | null;
        staff: {
            id: string;
            employeeId: string;
            user: {
                firstName: string;
                lastName: string;
                email: string;
            };
        };
    }>>;
    getStaffSpecialties(tenantId: string, staffId: string): Promise<Array<{
        id: string;
        specialtyId: string;
        isPrimary: boolean;
        experience: number | null;
        notes: string | null;
        assignedAt: Date;
        assignedBy: string | null;
        specialty: {
            id: string;
            name: string;
            code: string | null;
            category: string | null;
        };
    }>>;
    private getDefaultInclude;
}
export {};
