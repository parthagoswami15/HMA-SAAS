"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icd10Module = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const icd10_code_entity_1 = require("../entities/icd10-code.entity");
const icd10_controller_1 = require("../controllers/icd10.controller");
const icd10_service_1 = require("../services/icd10.service");
const icd10_repository_1 = require("../repositories/icd10.repository");
let Icd10Module = class Icd10Module {
};
exports.Icd10Module = Icd10Module;
exports.Icd10Module = Icd10Module = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([icd10_code_entity_1.Icd10Code, icd10_repository_1.Icd10Repository]),
        ],
        controllers: [icd10_controller_1.Icd10Controller],
        providers: [icd10_service_1.Icd10Service],
        exports: [icd10_service_1.Icd10Service],
    })
], Icd10Module);
//# sourceMappingURL=icd10.module.js.map