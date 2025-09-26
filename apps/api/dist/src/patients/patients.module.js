"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const event_emitter_1 = require("@nestjs/event-emitter");
const platform_express_1 = require("@nestjs/platform-express");
const config_1 = require("@nestjs/config");
const audit_module_1 = require("../audit/audit.module");
const file_storage_module_1 = require("../file-storage/file-storage.module");
const notifications_module_1 = require("../notifications/notifications.module");
const patients_service_1 = require("./patients.service");
const patients_controller_1 = require("./patients.controller");
const patient_registration_controller_1 = require("./controllers/patient-registration.controller");
const patient_documents_controller_1 = require("./controllers/patient-documents.controller");
const patient_audit_interceptor_1 = require("./interceptors/patient-audit.interceptor");
const supabase_module_1 = require("../supabase/supabase.module");
const patient_repository_1 = require("./repositories/patient.repository");
let PatientsModule = class PatientsModule {
};
exports.PatientsModule = PatientsModule;
exports.PatientsModule = PatientsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            supabase_module_1.SupabaseModule,
            audit_module_1.AuditModule,
            event_emitter_1.EventEmitterModule.forRoot(),
            platform_express_1.MulterModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    dest: configService.get('UPLOAD_PATH', './uploads'),
                    limits: {
                        fileSize: 10 * 1024 * 1024,
                    },
                    fileFilter: (req, file, cb) => {
                        const allowedMimeTypes = [
                            'image/jpeg',
                            'image/png',
                            'application/pdf',
                            'application/msword',
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        ];
                        if (allowedMimeTypes.includes(file.mimetype)) {
                            cb(null, true);
                        }
                        else {
                            cb(new Error('Invalid file type'), false);
                        }
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            (0, common_1.forwardRef)(() => notifications_module_1.NotificationsModule),
            file_storage_module_1.FileStorageModule,
        ],
        providers: [
            patients_service_1.PatientsService,
            patient_repository_1.PatientRepository,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: patient_audit_interceptor_1.PatientAuditInterceptor,
            },
        ],
        controllers: [
            patients_controller_1.PatientsController,
            patient_registration_controller_1.PatientRegistrationController,
            patient_documents_controller_1.PatientDocumentsController,
        ],
        exports: [patients_service_1.PatientsService, patient_repository_1.PatientRepository],
    })
], PatientsModule);
//# sourceMappingURL=patients.module.js.map