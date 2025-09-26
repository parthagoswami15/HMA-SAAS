import { PrismaService } from '../../prisma/prisma.service';
export interface SampleStabilityRule {
    sampleType: string;
    containerType: string;
    analyte: string;
    stabilityHours: number;
    storageCondition: 'ROOM_TEMP' | 'REFRIGERATED' | 'FROZEN';
    isActive: boolean;
}
export interface SampleIssue {
    id: string;
    sampleId: string;
    issueType: 'INSUFFICIENT_VOLUME' | 'HEMOLYSIS' | 'CLOTTED' | 'EXPIRED' | 'CONTAMINATED' | 'INCORRECT_CONTAINER';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    requiresRecollection: boolean;
    canUseForAnalysis: boolean;
    affectedTests: string[];
    reportedBy: string;
    reportedAt: Date;
    tenantId?: string;
}
export declare class LabSampleStabilityService {
    private prisma;
    constructor(prisma: PrismaService);
    private stabilityRules;
    checkSampleStability(sampleId: string): Promise<{
        isStable: boolean;
        issues: string[];
        recommendations: string[];
    }>;
    createSampleIssue(issueData: Omit<SampleIssue, 'id'>): Promise<SampleIssue>;
    handleAddOnTest(sampleId: string, testId: string): Promise<{
        canAdd: boolean;
        reason?: string;
        recommendations?: string[];
    }>;
    getExpiredSamples(): Promise<any[]>;
    getSamplesRequiringRecollection(): Promise<any[]>;
    getSampleIssues(sampleId: string): Promise<SampleIssue[]>;
    updateSampleCondition(sampleId: string, condition: {
        hemolysisLevel?: number;
        clottingStatus?: string;
        contaminationStatus?: string;
        volume?: number;
    }): Promise<void>;
    private checkAnalyteStability;
    private checkSampleTestCompatibility;
    private checkAddOnStability;
    private mapIssueToType;
    private determineSeverity;
    private determineIfRecollectionNeeded;
    private determineIfUsable;
    private createRecollectionNotification;
}
