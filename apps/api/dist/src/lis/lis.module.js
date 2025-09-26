"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LisModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("../prisma/prisma.module");
const lab_panels_controller_1 = require("./controllers/lab-panels.controller");
const lab_panels_service_1 = require("./services/lab-panels.service");
const lab_tests_service_1 = require("./services/lab-tests.service");
const lab_orders_service_1 = require("./services/lab-orders.service");
const lab_sample_stability_service_1 = require("./services/lab-sample-stability.service");
const lab_samples_service_1 = require("./services/lab-samples.service");
const lab_analyzers_service_1 = require("./services/lab-analyzers.service");
const lab_results_service_1 = require("./services/lab-results.service");
const lab_qc_service_1 = require("./services/lab-qc.service");
const lab_reports_service_1 = require("./services/lab-reports.service");
const lab_sample_stability_controller_1 = require("./controllers/lab-sample-stability.controller");
const lab_reflex_controller_1 = require("./controllers/lab-reflex.controller");
const lab_delta_check_controller_1 = require("./controllers/lab-delta-check.controller");
const lab_panic_alert_controller_1 = require("./controllers/lab-panic-alert.controller");
const lab_tat_controller_1 = require("./controllers/lab-tat.controller");
const lab_auth_guard_1 = require("./guards/lab-auth.guard");
const analyzer_interface_1 = require("./interfaces/analyzer.interface");
let LisModule = class LisModule {
};
exports.LisModule = LisModule;
exports.LisModule = LisModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, prisma_module_1.PrismaModule],
        controllers: [
            LabTestsController,
            LabOrdersController,
            LabSamplesController,
            LabAnalyzersController,
            LabResultsController,
            LabQcController,
            LabReportsController,
            lab_panels_controller_1.LabPanelsController,
            lab_reflex_controller_1.LabReflexController,
            lab_delta_check_controller_1.LabDeltaCheckController,
            lab_panic_alert_controller_1.LabPanicAlertController,
            lab_tat_controller_1.LabTatController,
            lab_sample_stability_controller_1.LabSampleStabilityController,
        ],
        providers: [
            lab_tests_service_1.LabTestsService,
            lab_orders_service_1.LabOrdersService,
            lab_samples_service_1.LabSamplesService,
            lab_analyzers_service_1.LabAnalyzersService,
            lab_results_service_1.LabResultsService,
            lab_qc_service_1.LabQcService,
            lab_reports_service_1.LabReportsService,
            LabValidationService,
            LabReflexService,
            LabBarcodeService,
            LabTatService,
            LabDeltaCheckService,
            LabPanicAlertService,
            lab_panels_service_1.LabPanelsService,
            lab_auth_guard_1.LabAuthGuard,
            analyzer_interface_1.AnalyzerInterface,
        ],
        exports: [
            lab_tests_service_1.LabTestsService,
            lab_orders_service_1.LabOrdersService,
            lab_samples_service_1.LabSamplesService,
            lab_results_service_1.LabResultsService,
            LabValidationService,
            LabReflexService,
            LabBarcodeService,
            LabTatService,
            lab_reports_service_1.LabReportsService,
            LabDeltaCheckService,
            LabPanicAlertService,
            lab_sample_stability_service_1.LabSampleStabilityService,
            lab_panels_service_1.LabPanelsService,
        ],
    })
], LisModule);
//# sourceMappingURL=lis.module.js.map