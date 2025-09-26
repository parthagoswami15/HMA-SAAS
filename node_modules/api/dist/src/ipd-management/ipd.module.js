"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPDModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const admission_module_1 = require("./submodules/admission/admission.module");
const bed_ward_module_1 = require("./submodules/bed-ward/bed-ward.module");
const nursing_module_1 = require("./submodules/nursing/nursing.module");
const ot_module_1 = require("./submodules/ot/ot.module");
const discharge_module_1 = require("./submodules/discharge/discharge.module");
const ipd_service_1 = require("./services/ipd.service");
const ipd_controller_1 = require("./controllers/ipd.controller");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
let IPDModule = class IPDModule {
};
exports.IPDModule = IPDModule;
exports.IPDModule = IPDModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
                }),
                inject: [config_1.ConfigService],
            }),
            admission_module_1.AdmissionModule,
            bed_ward_module_1.BedWardModule,
            nursing_module_1.NursingModule,
            ot_module_1.OTModule,
            discharge_module_1.DischargeModule,
        ],
        controllers: [ipd_controller_1.IPDController],
        providers: [
            ipd_service_1.IPDService,
            jwt_auth_guard_1.JwtAuthGuard,
            roles_guard_1.RolesGuard,
        ],
        exports: [ipd_service_1.IPDService],
    })
], IPDModule);
//# sourceMappingURL=ipd.module.js.map