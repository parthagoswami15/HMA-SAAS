import { PrismaService } from '../../prisma/prisma.service';
export declare class RadiationDoseService {
    private prisma;
    constructor(prisma: PrismaService);
    recordDose(studyId: string, doseData: any): Promise<any>;
    getStudyDose(studyId: string): Promise<any>;
    getPatientCumulativeDose(patientId: string): Promise<any>;
    getPatientDoseHistory(patientId: string, dateFrom?: Date, dateTo?: Date): Promise<any[]>;
    checkDoseAlerts(patientId: string): Promise<any[]>;
    getModalityDoseStats(modalityType: string, tenantId: string): Promise<any>;
    private updateCumulativeDose;
    getDoseReport(patientId: string, dateFrom?: Date, dateTo?: Date): Promise<any>;
}
