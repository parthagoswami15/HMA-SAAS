"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffManagementModule = void 0;
const common_1 = require("@nestjs/common");
const staff_service_1 = require("./services/staff.service");
const role_service_1 = require("./services/role.service");
const specialty_service_1 = require("./services/specialty.service");
const department_service_1 = require("./services/department.service");
const prisma_module_1 = require("../prisma/prisma.module");
const user_module_1 = require("../user/user.module");
const auth_module_1 = require("../auth/auth.module");
const staff_repository_1 = require("./repositories/staff.repository");
const department_repository_1 = require("./repositories/department.repository");
const role_repository_1 = require("./repositories/role.repository");
const specialty_repository_1 = require("./repositories/specialty.repository");
let StaffManagementModule = class StaffManagementModule {
};
exports.StaffManagementModule = StaffManagementModule;
exports.StaffManagementModule = StaffManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            user_module_1.UserModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        providers: [
            staff_service_1.StaffService,
            role_service_1.RoleService,
            specialty_service_1.SpecialtyService,
            department_service_1.DepartmentService,
            staff_repository_1.StaffRepository,
            department_repository_1.DepartmentRepository,
            role_repository_1.RoleRepository,
            specialty_repository_1.SpecialtyRepository,
        ],
        exports: [
            staff_service_1.StaffService,
            role_service_1.RoleService,
            specialty_service_1.SpecialtyService,
            department_service_1.DepartmentService,
            staff_repository_1.StaffRepository,
            department_repository_1.DepartmentRepository,
            role_repository_1.RoleRepository,
            specialty_repository_1.SpecialtyRepository,
        ],
    })
], StaffManagementModule);
//# sourceMappingURL=staff-management.module.js.map