"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const passport_1 = require("@nestjs/passport");
const serve_static_1 = require("@nestjs/serve-static");
const schedule_1 = require("@nestjs/schedule");
const path_1 = require("path");
const joi_1 = __importDefault(require("joi"));
const throttler_config_1 = require("./config/throttler.config");
const tenants_module_1 = require("./tenants/tenants.module");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const patients_module_1 = require("./patients/patients.module");
const lab_module_1 = require("./lab/lab.module");
const pharmacy_module_1 = require("./pharmacy/pharmacy.module");
const billing_module_1 = require("./billing/billing.module");
const payments_module_1 = require("./payments/payments.module");
const chambers_module_1 = require("./chambers/chambers.module");
const emergency_module_1 = require("./emergency/emergency.module");
const notifications_module_1 = require("./notifications/notifications.module");
const audit_module_1 = require("./audit/audit.module");
const opd_module_1 = require("./opd-management/opd.module");
const ipd_module_1 = require("./ipd-management/ipd.module");
const supabase_module_1 = require("./supabase/supabase.module");
const insurance_module_1 = require("./insurance/insurance.module");
const appointments_module_1 = require("./appointments/appointments.module");
const reports_module_1 = require("./reports/reports.module");
const compliance_module_1 = require("./compliance/compliance.module");
const telemedicine_module_1 = require("./telemedicine/telemedicine.module");
const security_module_1 = require("./security/security.module");
const patient_portal_module_1 = require("./patient-portal/patient-portal.module");
const integrations_module_1 = require("./integrations/integrations.module");
const radiology_module_1 = require("./radiology/radiology.module");
const admin_tenant_module_1 = require("./admin-tenant/admin-tenant.module");
const devops_sre_module_1 = require("./devops-sre/devops-sre.module");
const ai_assistive_module_1 = require("./ai-assistive/ai-assistive.module");
const tenant_throttle_guard_1 = require("./auth/tenant-throttle.guard");
const supabase_auth_guard_1 = require("./auth/guards/supabase-auth.guard");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: joi_1.default.object({
                    NODE_ENV: joi_1.default.string()
                        .valid('development', 'production', 'test')
                        .default('development'),
                    PORT: joi_1.default.number().default(3000),
                    SUPABASE_URL: joi_1.default.string().required(),
                    SUPABASE_ANON_KEY: joi_1.default.string().required(),
                    SUPABASE_SERVICE_ROLE_KEY: joi_1.default.string().required(),
                    JWT_SECRET: joi_1.default.string().required(),
                    JWT_ACCESS_SECRET: joi_1.default.string().required(),
                    JWT_ACCESS_EXPIRATION: joi_1.default.string().default('15m'),
                    JWT_REFRESH_SECRET: joi_1.default.string().required(),
                    JWT_REFRESH_EXPIRATION: joi_1.default.string().default('7d'),
                    APP_URL: joi_1.default.string().default('http://localhost:3000'),
                }),
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    ...throttler_config_1.throttlerConfig,
                }),
            }),
            schedule_1.ScheduleModule.forRoot(),
            supabase_module_1.SupabaseModule,
            passport_1.PassportModule.register({ defaultStrategy: 'supabase-jwt' }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public'),
                serveRoot: '/public',
            }),
            prisma_module_1.PrismaModule,
            supabase_module_1.SupabaseModule,
            auth_module_1.AuthModule,
            tenants_module_1.TenantsModule,
            opd_module_1.OPDModule,
            ipd_module_1.IPDModule,
            patients_module_1.PatientsModule,
            lab_module_1.LabModule,
            pharmacy_module_1.PharmacyModule,
            billing_module_1.BillingModule,
            payments_module_1.PaymentsModule,
            insurance_module_1.InsuranceModule,
            appointments_module_1.AppointmentsModule,
            chambers_module_1.ChambersModule,
            emergency_module_1.EmergencyModule,
            notifications_module_1.NotificationsModule,
            audit_module_1.AuditModule,
            reports_module_1.ReportsModule,
            compliance_module_1.ComplianceModule,
            telemedicine_module_1.TelemedicineModule,
            security_module_1.SecurityModule,
            patient_portal_module_1.PatientPortalModule,
            integrations_module_1.IntegrationsModule,
            radiology_module_1.RadiologyModule,
            admin_tenant_module_1.AdminTenantModule,
            devops_sre_module_1.DevOpsSreModule,
            ai_assistive_module_1.AIAssistiveModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: supabase_auth_guard_1.SupabaseAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: tenant_throttle_guard_1.TenantThrottleGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map