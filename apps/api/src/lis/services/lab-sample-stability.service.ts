import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { differenceInHours, isAfter, addHours } from 'date-fns';

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

@Injectable()
export class LabSampleStabilityService {
  constructor(private prisma: PrismaService) {}

  private stabilityRules: SampleStabilityRule[] = [
    // Blood samples
    { sampleType: 'WHOLE_BLOOD', containerType: 'EDTA_TUBE', analyte: 'CBC', stabilityHours: 24, storageCondition: 'REFRIGERATED', isActive: true },
    { sampleType: 'WHOLE_BLOOD', containerType: 'EDTA_TUBE', analyte: 'GLUCOSE', stabilityHours: 4, storageCondition: 'ROOM_TEMP', isActive: true },
    { sampleType: 'SERUM', containerType: 'SST_TUBE', analyte: 'CHEMISTRY', stabilityHours: 72, storageCondition: 'REFRIGERATED', isActive: true },
    { sampleType: 'PLASMA', containerType: 'LITHIUM_HEPARIN', analyte: 'TROPONIN', stabilityHours: 48, storageCondition: 'REFRIGERATED', isActive: true },

    // Urine samples
    { sampleType: 'URINE', containerType: 'STERILE_CUP', analyte: 'URINALYSIS', stabilityHours: 2, storageCondition: 'REFRIGERATED', isActive: true },
    { sampleType: 'URINE', containerType: 'PRESERVATIVE_TUBE', analyte: 'CULTURE', stabilityHours: 24, storageCondition: 'REFRIGERATED', isActive: true },

    // Special samples
    { sampleType: 'CSF', containerType: 'STERILE_TUBE', analyte: 'CELL_COUNT', stabilityHours: 1, storageCondition: 'ROOM_TEMP', isActive: true },
    { sampleType: 'CSF', containerType: 'STERILE_TUBE', analyte: 'CHEMISTRY', stabilityHours: 4, storageCondition: 'REFRIGERATED', isActive: true },
  ];

  async checkSampleStability(sampleId: string): Promise<{
    isStable: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const sample = await this.prisma.$queryRaw`
      SELECT
        s.*,
        lo.patientId,
        lo.orderingPhysician,
        JSON_AGG(lr.*) as results
      FROM lab_samples s
      LEFT JOIN lab_orders lo ON s.orderId = lo.id
      LEFT JOIN lab_results lr ON lo.id = lr.orderId
      WHERE s.id = ${sampleId}
      GROUP BY s.id, lo.id
    `;

    if (!sample || (sample as any[]).length === 0) {
      throw new Error('Sample not found');
    }

    const sampleData = (sample as any[])[0];
    const issues: string[] = [];
    const recommendations: string[] = [];
    let isStable = true;

    // Check expiration
    if (sampleData.stabilityExpiresAt && isAfter(new Date(), new Date(sampleData.stabilityExpiresAt))) {
      issues.push('Sample has expired');
      recommendations.push('Recollect sample for accurate results');
      isStable = false;
    }

    // Check hemolysis
    if (sampleData.hemolysisLevel && sampleData.hemolysisLevel > 2) {
      issues.push(`Sample shows hemolysis level ${sampleData.hemolysisLevel}`);
      if (sampleData.hemolysisLevel > 3) {
        recommendations.push('Recollect sample - hemolysis may affect results');
        isStable = false;
      } else {
        recommendations.push('Use with caution - hemolysis may interfere with some tests');
      }
    }

    // Check sample volume
    if (sampleData.volume && sampleData.volume < 1.0) {
      issues.push('Insufficient sample volume');
      recommendations.push('Request additional sample for retesting');
      isStable = false;
    }

    // Check clotting for serum samples
    if (sampleData.sampleType === 'SERUM' && sampleData.clottingStatus === 'CLOTTED') {
      issues.push('Sample is clotted');
      recommendations.push('Recollect sample with proper clotting prevention');
      isStable = false;
    }

    // Check contamination
    if (sampleData.contaminationStatus === 'CONTAMINATED') {
      issues.push('Sample appears contaminated');
      recommendations.push('Recollect sample with sterile technique');
      isStable = false;
    }

    // Check storage conditions and stability
    if (sampleData.results) {
      for (const result of sampleData.results) {
        const stabilityIssue = await this.checkAnalyteStability(sampleData, result);
        if (stabilityIssue) {
          issues.push(stabilityIssue.issue);
          recommendations.push(stabilityIssue.recommendation);
          if (stabilityIssue.critical) {
            isStable = false;
          }
        }
      }
    }

    return {
      isStable,
      issues,
      recommendations,
    };
  }

  async createSampleIssue(issueData: Omit<SampleIssue, 'id'>): Promise<SampleIssue> {
    const issueId = `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await this.prisma.$queryRaw`
      INSERT INTO lab_sample_issues (
        id, sampleId, issueType, severity, description,
        requiresRecollection, canUseForAnalysis, affectedTests,
        reportedBy, reportedAt, tenantId, createdAt, updatedAt
      ) VALUES (
        ${issueId},
        ${issueData.sampleId},
        ${issueData.issueType},
        ${issueData.severity},
        ${issueData.description},
        ${issueData.requiresRecollection},
        ${issueData.canUseForAnalysis},
        ${JSON.stringify(issueData.affectedTests)},
        ${issueData.reportedBy},
        ${issueData.reportedAt},
        ${issueData.tenantId || ''},
        NOW(),
        NOW()
      )
    `;

    // If recollection is required, update sample status
    if (issueData.requiresRecollection) {
      await this.prisma.$queryRaw`
        UPDATE lab_samples
        SET status = 'REQUIRES_RECOLLECTION',
            notes = CONCAT(COALESCE(notes, ''), '\nIssue reported: ${issueData.description}'),
            updatedAt = NOW()
        WHERE id = ${issueData.sampleId}
      `;

      // Create notification for recollection
      await this.createRecollectionNotification(issueData.sampleId, issueData.description);
    }

    return {
      id: issueId,
      ...issueData,
    } as SampleIssue;
  }

  async handleAddOnTest(sampleId: string, testId: string): Promise<{
    canAdd: boolean;
    reason?: string;
    recommendations?: string[];
  }> {
    const [sampleResult, testResult] = await Promise.all([
      this.prisma.$queryRaw`
        SELECT
          s.*,
          JSON_AGG(lr.*) as results
        FROM lab_samples s
        LEFT JOIN lab_orders lo ON s.orderId = lo.id
        LEFT JOIN lab_results lr ON lo.id = lr.orderId
        WHERE s.id = ${sampleId}
        GROUP BY s.id
      `,
      this.prisma.$queryRaw`SELECT * FROM lab_tests WHERE id = ${testId}`
    ]);

    const sample = (sampleResult as any[])[0];
    const test = (testResult as any[])[0];

    if (!sample || !test) {
      return {
        canAdd: false,
        reason: 'Sample or test not found',
      };
    }

    const recommendations: string[] = [];

    // Check if sample has expired
    if (sample.stabilityExpiresAt && isAfter(new Date(), new Date(sample.stabilityExpiresAt))) {
      return {
        canAdd: false,
        reason: 'Sample has expired and cannot be used for additional testing',
        recommendations: ['Recollect sample for the add-on test'],
      };
    }

    // Check sample volume for additional testing
    if (sample.volume && sample.volume < 0.5) {
      recommendations.push('Sample volume is low - may be insufficient for additional testing');
    }

    // Check if sample type is compatible with the test
    const compatibility = await this.checkSampleTestCompatibility(sample.sampleType, test.category);
    if (!compatibility.compatible) {
      return {
        canAdd: false,
        reason: compatibility.reason,
        recommendations: ['Use appropriate sample type for this test'],
      };
    }

    // Check storage conditions
    const stabilityCheck = await this.checkAddOnStability(sample, test);
    if (!stabilityCheck.allowed) {
      return {
        canAdd: false,
        reason: stabilityCheck.reason,
        recommendations: stabilityCheck.recommendations,
      };
    }

    return {
      canAdd: true,
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    };
  }

  async getExpiredSamples(): Promise<any[]> {
    const expiredSamples = await this.prisma.$queryRaw`
      SELECT
        s.*,
        lo.patientId,
        p.firstName,
        p.lastName,
        DATEDIFF(HOUR, s.stabilityExpiresAt, NOW()) as hoursExpired
      FROM lab_samples s
      LEFT JOIN lab_orders lo ON s.orderId = lo.id
      LEFT JOIN patients p ON lo.patientId = p.id
      WHERE s.stabilityExpiresAt < NOW()
        AND s.status != 'DISPOSED'
      ORDER BY s.stabilityExpiresAt ASC
    `;

    return expiredSamples as any[];
  }

  async getSamplesRequiringRecollection(): Promise<any[]> {
    const samples = await this.prisma.$queryRaw`
      SELECT
        s.*,
        lo.patientId,
        p.firstName,
        p.lastName,
        JSON_AGG(si.*) as issues
      FROM lab_samples s
      LEFT JOIN lab_orders lo ON s.orderId = lo.id
      LEFT JOIN patients p ON lo.patientId = p.id
      LEFT JOIN lab_sample_issues si ON s.id = si.sampleId
      WHERE s.status = 'REQUIRES_RECOLLECTION'
      GROUP BY s.id, lo.id, p.id
      ORDER BY s.updatedAt DESC
    `;

    return samples as any[];
  }

  async getSampleIssues(sampleId: string): Promise<SampleIssue[]> {
    const issues = await this.prisma.$queryRaw`
      SELECT * FROM lab_sample_issues
      WHERE sampleId = ${sampleId}
      ORDER BY reportedAt DESC
    `;

    return issues as SampleIssue[];
  }

  async updateSampleCondition(sampleId: string, condition: {
    hemolysisLevel?: number;
    clottingStatus?: string;
    contaminationStatus?: string;
    volume?: number;
  }): Promise<void> {
    await this.prisma.$queryRaw`
      UPDATE lab_samples
      SET ${condition.hemolysisLevel !== undefined ? `hemolysisLevel = ${condition.hemolysisLevel},` : ''}
          ${condition.clottingStatus ? `clottingStatus = '${condition.clottingStatus}',` : ''}
          ${condition.contaminationStatus ? `contaminationStatus = '${condition.contaminationStatus}',` : ''}
          ${condition.volume !== undefined ? `volume = ${condition.volume},` : ''}
          updatedAt = NOW()
      WHERE id = ${sampleId}
    `;

    // Check if update triggers any issues
    const stabilityCheck = await this.checkSampleStability(sampleId);
    if (!stabilityCheck.isStable) {
      for (const issue of stabilityCheck.issues) {
        await this.createSampleIssue({
          sampleId,
          issueType: this.mapIssueToType(issue),
          severity: this.determineSeverity(issue),
          description: issue,
          requiresRecollection: this.determineIfRecollectionNeeded(issue),
          canUseForAnalysis: this.determineIfUsable(issue),
          affectedTests: [], // Would need to determine based on issue
          reportedBy: 'SYSTEM',
          reportedAt: new Date(),
        });
      }
    }
  }

  private async checkAnalyteStability(sample: any, result: any): Promise<{
    issue?: string;
    recommendation?: string;
    critical?: boolean;
  } | null> {
    const rule = this.stabilityRules.find(r =>
      r.sampleType === sample.sampleType &&
      r.analyte === result.test?.category
    );

    if (!rule) return null;

    const hoursElapsed = differenceInHours(new Date(), sample.collectedAt || new Date());
    if (hoursElapsed > rule.stabilityHours) {
      return {
        issue: `${result.analyte} stability exceeded (${hoursElapsed}h > ${rule.stabilityHours}h)`,
        recommendation: 'Results may be unreliable due to sample age',
        critical: hoursElapsed > rule.stabilityHours * 2,
      };
    }

    return null;
  }

  private async checkSampleTestCompatibility(sampleType: string, testCategory: string): Promise<{
    compatible: boolean;
    reason?: string;
  }> {
    // Define compatibility matrix
    const compatibilityMatrix: { [key: string]: string[] } = {
      'WHOLE_BLOOD': ['HEMATOLOGY'],
      'SERUM': ['CHEMISTRY', 'IMMUNOLOGY', 'SEROLOGY'],
      'PLASMA': ['CHEMISTRY', 'COAGULATION'],
      'URINE': ['URINALYSIS', 'MICROBIOLOGY'],
      'CSF': ['CHEMISTRY', 'MICROBIOLOGY'],
    };

    const compatibleCategories = compatibilityMatrix[sampleType] || [];
    if (compatibleCategories.includes(testCategory)) {
      return { compatible: true };
    }

    return {
      compatible: false,
      reason: `Sample type ${sampleType} is not compatible with ${testCategory} tests`,
    };
  }

  private async checkAddOnStability(sample: any, test: any): Promise<{
    allowed: boolean;
    reason?: string;
    recommendations?: string[];
  }> {
    const rule = this.stabilityRules.find(r =>
      r.sampleType === sample.sampleType &&
      r.analyte === test.category
    );

    if (!rule) {
      return {
        allowed: true,
      };
    }

    const hoursElapsed = differenceInHours(new Date(), sample.collectedAt || new Date());
    const remainingStability = rule.stabilityHours - hoursElapsed;

    if (remainingStability < 0) {
      return {
        allowed: false,
        reason: 'Sample has exceeded stability limits',
        recommendations: ['Sample is too old for reliable results'],
      };
    }

    if (remainingStability < 2) {
      return {
        allowed: false,
        reason: 'Insufficient remaining stability for add-on test',
        recommendations: ['Recollect sample for add-on test'],
      };
    }

    return { allowed: true };
  }

  private mapIssueToType(description: string): SampleIssue['issueType'] {
    if (description.toLowerCase().includes('hemolysis')) return 'HEMOLYSIS';
    if (description.toLowerCase().includes('volume')) return 'INSUFFICIENT_VOLUME';
    if (description.toLowerCase().includes('clotted')) return 'CLOTTED';
    if (description.toLowerCase().includes('expired')) return 'EXPIRED';
    if (description.toLowerCase().includes('contaminated')) return 'CONTAMINATED';
    return 'INCORRECT_CONTAINER';
  }

  private determineSeverity(issue: string): SampleIssue['severity'] {
    if (issue.toLowerCase().includes('critical')) return 'CRITICAL';
    if (issue.toLowerCase().includes('hemolysis') && issue.includes('level 3')) return 'HIGH';
    if (issue.toLowerCase().includes('expired')) return 'HIGH';
    if (issue.toLowerCase().includes('contaminated')) return 'HIGH';
    return 'MEDIUM';
  }

  private determineIfRecollectionNeeded(issue: string): boolean {
    return issue.toLowerCase().includes('expired') ||
           issue.toLowerCase().includes('contaminated') ||
           issue.toLowerCase().includes('insufficient') ||
           (issue.toLowerCase().includes('hemolysis') && issue.includes('level 3'));
  }

  private determineIfUsable(issue: string): boolean {
    return !issue.toLowerCase().includes('expired') &&
           !issue.toLowerCase().includes('contaminated');
  }

  private async createRecollectionNotification(sampleId: string, reason: string): Promise<void> {
    await this.prisma.$queryRaw`
      INSERT INTO lab_notifications (
        id, orderId, message, type, isRead, tenantId, createdAt, updatedAt
      ) VALUES (
        ${`notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`},
        '', -- Would get from sample
        ${`Sample requires recollection: ${reason}`},
        'SAMPLE_ISSUE',
        ${false},
        '', -- Would get from context
        NOW(),
        NOW()
      )
    `;
  }
}
