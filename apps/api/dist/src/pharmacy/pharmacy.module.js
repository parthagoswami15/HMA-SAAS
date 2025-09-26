"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyModule = void 0;
const common_1 = require("@nestjs/common");
const pharmacy_service_1 = require("./pharmacy.service");
const pharmacy_controller_1 = require("./pharmacy.controller");
let PharmacyModule = class PharmacyModule {
};
exports.PharmacyModule = PharmacyModule;
exports.PharmacyModule = PharmacyModule = __decorate([
    (0, common_1.Module)({
        providers: [pharmacy_service_1.PharmacyService],
        controllers: [pharmacy_controller_1.PharmacyController],
    })
], PharmacyModule);
//# sourceMappingURL=pharmacy.module.js.map