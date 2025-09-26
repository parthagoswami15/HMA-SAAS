"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevOpsSreModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../prisma/prisma.module");
const auth_module_1 = require("../../auth/auth.module");
const devops_sre_controller_1 = require("./controllers/devops-sre.controller");
const devops_sre_service_1 = require("./services/devops-sre.service");
let DevOpsSreModule = class DevOpsSreModule {
};
exports.DevOpsSreModule = DevOpsSreModule;
exports.DevOpsSreModule = DevOpsSreModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
        ],
        controllers: [
            devops_sre_controller_1.DevOpsSreController,
        ],
        providers: [
            devops_sre_service_1.DevOpsSreService,
        ],
        exports: [
            devops_sre_service_1.DevOpsSreService,
        ],
    })
], DevOpsSreModule);
//# sourceMappingURL=devops-sre.module.js.map