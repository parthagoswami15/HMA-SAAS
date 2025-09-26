"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChambersModule = void 0;
const common_1 = require("@nestjs/common");
const chambers_service_1 = require("./chambers.service");
const chambers_controller_1 = require("./chambers.controller");
let ChambersModule = class ChambersModule {
};
exports.ChambersModule = ChambersModule;
exports.ChambersModule = ChambersModule = __decorate([
    (0, common_1.Module)({
        controllers: [chambers_controller_1.ChambersController],
        providers: [chambers_service_1.ChambersService],
        exports: [chambers_service_1.ChambersService],
    })
], ChambersModule);
//# sourceMappingURL=chambers.module.js.map