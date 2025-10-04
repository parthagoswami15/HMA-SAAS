import { Injectable, Logger } from '@nestjs/common';
import { AadhaarService } from './services/aadhaar.service';
import { AuditService } from './services/audit.service';
import { BirthDeathService } from './services/birth-death.service';
import { PcpndtService } from './services/pcpndt.service';
import { PrescriptionService } from './services/prescription.service';
import { DataLocalizationService } from './services/data-localization.service';
import { ComplianceReportDto } from './dto/compliance.dto';

@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);

  constructor(
    private readonly aadhaarService: AadhaarService,
    private readonly auditService: AuditService,
    private readonly birthDeathService: BirthDeathService,
    private readonly pcpndtService: PcpndtService,
    private readonly prescriptionService: PrescriptionService,
    private readonly dataLocalizationService: DataLocalizationService,
  ) {}

  async generateComplianceReport(query: ComplianceReportDto, user: any) {
    this.logger.log(`Generating compliance report for user ${user.id}`);

    const report = {
      timestamp: new Date(),
      generatedBy: user.id,
      period: query.period || 'monthly',
      components: {
        aadhaar: await this.aadhaarService.getComplianceStatus(),
        audit: await this.auditService.getComplianceStatus(),
        birthDeath: await this.birthDeathService.getComplianceStatus(),
        pcpndt: await this.pcpndtService.getComplianceStatus(),
        prescription: await this.prescriptionService.getComplianceStatus(),
        dataLocalization: await this.dataLocalizationService.getComplianceStatus(),
      },
      summary: {
        totalRecords: 0,
        compliantRecords: 0,
        nonCompliantRecords: 0,
        compliancePercentage: 0,
      },
    };

    // Calculate summary
    const total = Object.values(report.components).reduce((sum, component: any) =>
      sum + (component.totalRecords || 0), 0);
    const compliant = Object.values(report.components).reduce((sum, component: any) =>
      sum + (component.compliantRecords || 0), 0);

    report.summary = {
      totalRecords: total,
      compliantRecords: compliant,
      nonCompliantRecords: total - compliant,
      compliancePercentage: total > 0 ? (compliant / total) * 100 : 100,
    };

    // Log the report generation
    await this.auditService.logActivity({
      action: 'COMPLIANCE_REPORT_GENERATED',
      entityType: 'COMPLIANCE',
      entityId: null,
      userId: user.id,
      details: { reportType: query.type, period: query.period },
    });

    return report;
  }

  async getOverallComplianceStatus(user: any) {
    const report = await this.generateComplianceReport({}, user);
    return {
      status: report.summary.compliancePercentage >= 95 ? 'COMPLIANT' : 'NEEDS_ATTENTION',
      percentage: report.summary.compliancePercentage,
      lastUpdated: new Date(),
    };
  }

  async validateCompliance(entityType: string, entityId: string, user: any) {
    this.logger.log(`Validating compliance for ${entityType}:${entityId}`);

    const validations = {
      aadhaar: await this.aadhaarService.validateCompliance(entityId),
      audit: await this.auditService.validateCompliance(entityId),
      pcpndt: await this.pcpndtService.validateCompliance(entityId),
      prescription: await this.prescriptionService.validateCompliance(entityId),
      dataLocalization: await this.dataLocalizationService.validateCompliance(entityId),
    };

    const isCompliant = Object.values(validations).every(v => v.isCompliant);

    // Log validation
    await this.auditService.logActivity({
      action: 'COMPLIANCE_VALIDATION',
      entityType,
      entityId,
      userId: user.id,
      details: { validations, isCompliant },
    });

    return {
      isCompliant,
      validations,
      timestamp: new Date(),
    };
  }
}
