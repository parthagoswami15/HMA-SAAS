"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPDModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const jwt_strategy_1 = require("../auth/strategies/jwt.strategy");
const roles_guard_1 = require("../auth/guards/roles.guard");
const opd_controller_1 = require("./opd.controller");
const opd_service_1 = require("./opd.service");
const icd10_module_1 = require("./modules/icd10.module");
const diagnosis_module_1 = require("./modules/diagnosis.module");
const vitals_module_1 = require("./modules/vitals.module");
const visit_module_1 = require("./modules/visit.module");
const encounter_module_1 = require("./modules/encounter.module");
const prescription_module_1 = require("./modules/prescription.module");
const queue_module_1 = require("./modules/queue.module");
const order_module_1 = require("./modules/order.module");
const document_module_1 = require("./modules/document.module");
const billing_module_1 = require("./modules/billing.module");
let OPDModule = class OPDModule {
};
exports.OPDModule = OPDModule;
exports.OPDModule = OPDModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([]),
            icd10_module_1.Icd10Module,
            diagnosis_module_1.DiagnosisModule,
            vitals_module_1.VitalsModule,
            visit_module_1.VisitModule,
            encounter_module_1.EncounterModule,
            prescription_module_1.PrescriptionModule,
            queue_module_1.QueueModule,
            order_module_1.OrderModule,
            document_module_1.DocumentModule,
            billing_module_1.BillingModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN', '1d'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [opd_controller_1.OPDController],
        providers: [opd_service_1.OPDService, jwt_strategy_1.JwtStrategy, roles_guard_1.RolesGuard],
        exports: [opd_service_1.OPDService],
    })
], OPDModule);
//# sourceMappingURL=opd.module.js.map