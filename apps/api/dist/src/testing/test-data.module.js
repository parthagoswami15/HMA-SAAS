"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDataModule = void 0;
const common_1 = require("@nestjs/common");
const test_data_service_1 = require("./test-data.service");
const test_data_controller_1 = require("./test-data.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const patients_module_1 = require("../patients/patients.module");
let TestDataModule = class TestDataModule {
};
exports.TestDataModule = TestDataModule;
exports.TestDataModule = TestDataModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, patients_module_1.PatientsModule],
        controllers: [test_data_controller_1.TestDataController],
        providers: [test_data_service_1.TestDataService],
        exports: [test_data_service_1.TestDataService],
    })
], TestDataModule);
//# sourceMappingURL=test-data.module.js.map