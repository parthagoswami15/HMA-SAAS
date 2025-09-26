"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BedWardModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bed_entity_1 = require("../../entities/bed.entity");
const ward_entity_1 = require("../../entities/ward.entity");
const admission_entity_1 = require("../../entities/admission.entity");
const bed_ward_controller_1 = require("../controllers/bed-ward.controller");
const bed_ward_service_1 = require("../../services/bed-ward.service");
let BedWardModule = class BedWardModule {
};
exports.BedWardModule = BedWardModule;
exports.BedWardModule = BedWardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                bed_entity_1.Bed,
                ward_entity_1.Ward,
                admission_entity_1.Admission,
            ]),
        ],
        controllers: [bed_ward_controller_1.BedWardController],
        providers: [bed_ward_service_1.BedWardService],
        exports: [bed_ward_service_1.BedWardService],
    })
], BedWardModule);
//# sourceMappingURL=bed-ward.module.js.map