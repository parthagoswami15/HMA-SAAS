"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpdModule = void 0;
const common_1 = require("@nestjs/common");
const ipd_service_1 = require("./ipd.service");
const ipd_controller_1 = require("./ipd.controller");
let IpdModule = class IpdModule {
};
exports.IpdModule = IpdModule;
exports.IpdModule = IpdModule = __decorate([
    (0, common_1.Module)({
        providers: [ipd_service_1.IpdService],
        controllers: [ipd_controller_1.IpdController],
    })
], IpdModule);
//# sourceMappingURL=ipd.module.js.map