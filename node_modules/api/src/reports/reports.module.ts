import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { AnalyticsService } from './services/analytics.service';
import { ExportService } from './services/export.service';
import { DashboardService } from './services/dashboard.service';
import { FinancialReportsService } from './services/financial-reports.service';
import { ClinicalReportsService } from './services/clinical-reports.service';
import { OperationalReportsService } from './services/operational-reports.service';
import { PatientReportsService } from './services/patient-reports.service';
import { ReportBuilderService } from './services/report-builder.service';
import { EmailSchedulerService } from './services/email-scheduler.service';

import { ReportConfig, ReportSchedule, SavedReport, DashboardConfig, DashboardAccess } from './entities/reports.entity';
import { DimDate, DimFacility, DimProvider, DimService, DimPayer } from './entities/dimensions.entity';
import { FactBilling, FactVisits, FactLabs } from './entities/facts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReportConfig,
      ReportSchedule,
      SavedReport,
      DashboardConfig,
      DashboardAccess,
      DimDate,
      DimFacility,
      DimProvider,
      DimService,
      DimPayer,
      FactBilling,
      FactVisits,
      FactLabs,
    ]),
  ],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    AnalyticsService,
    ExportService,
    DashboardService,
    FinancialReportsService,
    ClinicalReportsService,
    OperationalReportsService,
    PatientReportsService,
    ReportBuilderService,
    EmailSchedulerService,
  ],
  exports: [
    ReportsService,
    AnalyticsService,
    ExportService,
    DashboardService,
    FinancialReportsService,
    ClinicalReportsService,
    OperationalReportsService,
    PatientReportsService,
    ReportBuilderService,
    EmailSchedulerService,
  ],
})
export class ReportsModule {}
