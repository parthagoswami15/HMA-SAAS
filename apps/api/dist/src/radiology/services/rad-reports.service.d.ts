import { PrismaService } from '../../prisma/prisma.service';
import { CreateRadReportDto, UpdateRadReportDto, SignRadReportDto, RadReportFilterDto, RadReportListDto } from '../dto/rad-reports.dto';
import { RadReport } from '@prisma/client';
export declare class RadReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateRadReportDto, userId: string): Promise<RadReport>;
    findAll(filterDto: RadReportFilterDto, listDto: RadReportListDto): Promise<{
        data: RadReport[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<RadReport>;
    update(id: string, updateDto: UpdateRadReportDto): Promise<RadReport>;
    signReport(id: string, signDto: SignRadReportDto, userId: string): Promise<RadReport>;
    getReportsByStudy(studyId: string): Promise<RadReport[]>;
    getReportsByPatient(patientId: string): Promise<RadReport[]>;
    getStats(tenantId: string): Promise<{
        total: any;
        today: any;
        byStatus: {
            [k: string]: any;
        };
        byBiRads: {
            [k: string]: any;
        };
        byLungRads: {
            [k: string]: any;
        };
    }>;
    private generateReportNumber;
    getStructuredReportData(reportId: string): Promise<any>;
    updateStructuredFindings(id: string, findings: Record<string, any>): Promise<RadReport>;
}
