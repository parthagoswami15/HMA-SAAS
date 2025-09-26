"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const reports_controller_1 = require("./controllers/reports.controller");
const reports_service_1 = require("./services/reports.service");
const analytics_service_1 = require("./services/analytics.service");
const export_service_1 = require("./services/export.service");
const dashboard_service_1 = require("./services/dashboard.service");
const financial_reports_service_1 = require("./services/financial-reports.service");
const clinical_reports_service_1 = require("./services/clinical-reports.service");
const operational_reports_service_1 = require("./services/operational-reports.service");
const patient_reports_service_1 = require("./services/patient-reports.service");
const report_builder_service_1 = require("./services/report-builder.service");
const email_scheduler_service_1 = require("./services/email-scheduler.service");
const reports_entity_1 = require("./entities/reports.entity");
const dimensions_entity_1 = require("./entities/dimensions.entity");
const facts_entity_1 = require("./entities/facts.entity");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                reports_entity_1.ReportConfig,
                reports_entity_1.ReportSchedule,
                reports_entity_1.SavedReport,
                reports_entity_1.DashboardConfig,
                reports_entity_1.DashboardAccess,
                dimensions_entity_1.DimDate,
                dimensions_entity_1.DimFacility,
                dimensions_entity_1.DimProvider,
                dimensions_entity_1.DimService,
                dimensions_entity_1.DimPayer,
                facts_entity_1.FactBilling,
                facts_entity_1.FactVisits,
                facts_entity_1.FactLabs,
            ]),
        ],
        controllers: [reports_controller_1.ReportsController],
        providers: [
            reports_service_1.ReportsService,
            analytics_service_1.AnalyticsService,
            export_service_1.ExportService,
            dashboard_service_1.DashboardService,
            financial_reports_service_1.FinancialReportsService,
            clinical_reports_service_1.ClinicalReportsService,
            operational_reports_service_1.OperationalReportsService,
            patient_reports_service_1.PatientReportsService,
            report_builder_service_1.ReportBuilderService,
            email_scheduler_service_1.EmailSchedulerService,
        ],
        exports: [
            reports_service_1.ReportsService,
            analytics_service_1.AnalyticsService,
            export_service_1.ExportService,
            dashboard_service_1.DashboardService,
            financial_reports_service_1.FinancialReportsService,
            clinical_reports_service_1.ClinicalReportsService,
            operational_reports_service_1.OperationalReportsService,
            patient_reports_service_1.PatientReportsService,
            report_builder_service_1.ReportBuilderService,
            email_scheduler_service_1.EmailSchedulerService,
        ],
    })
], ReportsModule);
//# sourceMappingURL=reports.module.js.map