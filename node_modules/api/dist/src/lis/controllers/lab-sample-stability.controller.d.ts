import { LabSampleStabilityService, SampleIssue } from '../services/lab-sample-stability.service';
export declare class LabSampleStabilityController {
    private readonly labSampleStabilityService;
    constructor(labSampleStabilityService: LabSampleStabilityService);
    checkSampleStability(sampleId: string): Promise<{
        isStable: boolean;
        issues: string[];
        recommendations: string[];
    }>;
    reportSampleIssue(issueData: Omit<SampleIssue, 'id'>): Promise<SampleIssue>;
    checkAddOnTest(sampleId: string, testId: string): Promise<{
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
    }): Promise<{
        message: string;
    }>;
    getStabilityRules(): Promise<any[]>;
    getQualityMetrics(tenantId: string): Promise<any>;
    private calculateQualityScore;
    private analyzeCommonIssues;
}
