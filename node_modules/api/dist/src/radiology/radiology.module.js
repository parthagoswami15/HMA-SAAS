"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiologyModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const auth_module_1 = require("../auth/auth.module");
const imaging_orders_controller_1 = require("./controllers/imaging-orders.controller");
const studies_controller_1 = require("./controllers/studies.controller");
const rad_reports_controller_1 = require("./controllers/rad-reports.controller");
const modalities_controller_1 = require("./controllers/modalities.controller");
const pacs_controller_1 = require("./controllers/pacs.controller");
const imaging_orders_service_1 = require("./services/imaging-orders.service");
const studies_service_1 = require("./services/studies.service");
const rad_reports_service_1 = require("./services/rad-reports.service");
const modalities_service_1 = require("./services/modalities.service");
const pacs_service_1 = require("./services/pacs.service");
const modality_worklist_service_1 = require("./services/modality-worklist.service");
const radiation_dose_service_1 = require("./services/radiation-dose.service");
const contrast_allergy_service_1 = require("./services/contrast-allergy.service");
const report_templates_service_1 = require("./services/report-templates.service");
const imaging_schedule_service_1 = require("./services/imaging-schedule.service");
let RadiologyModule = class RadiologyModule {
};
exports.RadiologyModule = RadiologyModule;
exports.RadiologyModule = RadiologyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
        ],
        controllers: [
            imaging_orders_controller_1.ImagingOrdersController,
            studies_controller_1.StudiesController,
            rad_reports_controller_1.RadReportsController,
            modalities_controller_1.ModalitiesController,
            pacs_controller_1.PACSController,
        ],
        providers: [
            imaging_orders_service_1.ImagingOrdersService,
            studies_service_1.StudiesService,
            rad_reports_service_1.RadReportsService,
            modalities_service_1.ModalitiesService,
            pacs_service_1.PACSService,
            modality_worklist_service_1.ModalityWorklistService,
            radiation_dose_service_1.RadiationDoseService,
            contrast_allergy_service_1.ContrastAllergyService,
            report_templates_service_1.ReportTemplatesService,
            imaging_schedule_service_1.ImagingScheduleService,
        ],
        exports: [
            imaging_orders_service_1.ImagingOrdersService,
            studies_service_1.StudiesService,
            rad_reports_service_1.RadReportsService,
            modalities_service_1.ModalitiesService,
            pacs_service_1.PACSService,
            modality_worklist_service_1.ModalityWorklistService,
            radiation_dose_service_1.RadiationDoseService,
            contrast_allergy_service_1.ContrastAllergyService,
            report_templates_service_1.ReportTemplatesService,
            imaging_schedule_service_1.ImagingScheduleService,
        ],
    })
], RadiologyModule);
//# sourceMappingURL=radiology.module.js.map