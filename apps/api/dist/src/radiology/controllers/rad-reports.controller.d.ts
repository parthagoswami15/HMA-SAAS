import { RadReportsService } from '../services/rad-reports.service';
import { CreateRadReportDto, UpdateRadReportDto, SignRadReportDto, RadReportFilterDto, RadReportListDto } from '../dto/rad-reports.dto';
export declare class RadReportsController {
    private readonly radReportsService;
    constructor(radReportsService: RadReportsService);
    create(createDto: CreateRadReportDto, req: any): Promise<RadReport>;
    findAll(filterDto: RadReportFilterDto, listDto: RadReportListDto): Promise<{
        data: RadReport[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<RadReport>;
    update(id: string, updateDto: UpdateRadReportDto): Promise<RadReport>;
    signReport(id: string, signDto: SignRadReportDto, req: any): Promise<RadReport>;
    getReportsByStudy(studyId: string): Promise<RadReport[]>;
    getReportsByPatient(patientId: string): Promise<RadReport[]>;
    getStructuredReportData(reportId: string): Promise<any>;
    updateStructuredFindings(id: string, findings: Record<string, any>): Promise<RadReport>;
    getStats(req: any): Promise<{
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
    remove(id: string): Promise<void>;
}
