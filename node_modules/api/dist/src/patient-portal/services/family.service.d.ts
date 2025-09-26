import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class FamilyService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    getFamilyMembers(user: any): Promise<any>;
    addFamilyMember(familyDto: any, user: any): Promise<any>;
    updateFamilyMember(memberId: string, updateDto: any, user: any): Promise<any>;
    removeFamilyMember(memberId: string, user: any): Promise<void>;
    switchToFamilyMember(memberId: string, user: any): Promise<{
        switchedTo: string;
        context: {
            primaryUserId: any;
            familyMemberId: string;
            profileId: any;
            switchedAt: Date;
        };
    }>;
    getFamilyHealthSummary(user: any): Promise<any[]>;
    getFamilyMemberProfile(memberId: string, user: any): Promise<any>;
    getFamilyStats(user: any): Promise<{
        userId: any;
        totalMembers: any;
        membersByRelation: any;
        totalAppointments: any;
    }>;
}
