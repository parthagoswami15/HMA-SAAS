import { PrismaService } from '../../prisma/prisma.service';
export declare class ContrastAllergyService {
    private prisma;
    constructor(prisma: PrismaService);
    recordContrastAllergy(allergyData: any): Promise<any>;
    getPatientAllergies(patientId: string): Promise<any[]>;
    checkContrastAllergy(patientId: string, contrastType: string): Promise<any>;
    updateAllergy(allergyId: string, updateData: any): Promise<any>;
    getAllergyAlerts(patientId: string): Promise<any[]>;
    getContrastProtocol(patientId: string, contrastType: string): Promise<any>;
    getAllergyStatistics(tenantId: string): Promise<any>;
    private getContrastRecommendation;
    private getPremedicationInstructions;
    private getAlternativeContrast;
    private getMonitoringRequirements;
    private getAlertLevel;
    private groupAllergiesByType;
    createAllergyAlert(patientId: string, contrastType: string): Promise<any>;
}
