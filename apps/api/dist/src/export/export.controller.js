"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportController = void 0;
const common_1 = require("@nestjs/common");
const export_service_1 = require("./export.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
const fs_1 = require("fs");
let ExportController = class ExportController {
    exportService;
    constructor(exportService) {
        this.exportService = exportService;
    }
    async exportPatients(req, format = 'excel', startDate, endDate, res) {
        const options = {
            format,
            ...(startDate && endDate && {
                dateRange: {
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                },
            }),
        };
        const result = await this.exportService.exportPatients(req.user.tenantId, options);
        res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
        res.setHeader('Content-Type', this.getContentType(format));
        const fileStream = (0, fs_1.createReadStream)(result.filePath);
        fileStream.pipe(res);
    }
    async exportLabResults(req, format = 'excel', startDate, endDate, res) {
        const options = {
            format,
            ...(startDate && endDate && {
                dateRange: {
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                },
            }),
        };
        const result = await this.exportService.exportLabResults(req.user.tenantId, options);
        res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
        res.setHeader('Content-Type', this.getContentType(format));
        const fileStream = (0, fs_1.createReadStream)(result.filePath);
        fileStream.pipe(res);
    }
    async exportFinancialData(req, format = 'excel', startDate, endDate, res) {
        const options = {
            format,
            ...(startDate && endDate && {
                dateRange: {
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                },
            }),
        };
        const result = await this.exportService.exportFinancialData(req.user.tenantId, options);
        res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
        res.setHeader('Content-Type', this.getContentType(format));
        const fileStream = (0, fs_1.createReadStream)(result.filePath);
        fileStream.pipe(res);
    }
    async createBackup(req, options) {
        const result = await this.exportService.createFullBackup(req.user.tenantId, options);
        return {
            message: 'Backup created successfully',
            fileName: result.fileName,
            filePath: result.filePath,
        };
    }
    async downloadBackup(req, fileName, res) {
        const filePath = `backups/${fileName}`;
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        const fileStream = (0, fs_1.createReadStream)(filePath);
        fileStream.pipe(res);
    }
    async restoreBackup(req, body) {
        await this.exportService.restoreFromBackup(req.user.tenantId, body.backupFilePath);
        return {
            message: 'Backup restored successfully',
        };
    }
    getContentType(format) {
        switch (format) {
            case 'excel':
                return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            case 'csv':
                return 'text/csv';
            case 'json':
                return 'application/json';
            default:
                return 'application/octet-stream';
        }
    }
};
exports.ExportController = ExportController;
__decorate([
    (0, common_1.Get)('patients'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.NURSE),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('format')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "exportPatients", null);
__decorate([
    (0, common_1.Get)('lab-results'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.LAB_TECHNICIAN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('format')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "exportLabResults", null);
__decorate([
    (0, common_1.Get)('financial'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.OWNER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('format')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "exportFinancialData", null);
__decorate([
    (0, common_1.Post)('backup/create'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.OWNER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "createBackup", null);
__decorate([
    (0, common_1.Get)('backup/download/:fileName'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.OWNER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('fileName')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "downloadBackup", null);
__decorate([
    (0, common_1.Post)('backup/restore'),
    (0, roles_decorator_1.Roles)(client_1.Role.OWNER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "restoreBackup", null);
exports.ExportController = ExportController = __decorate([
    (0, common_1.Controller)('export'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [export_service_1.ExportService])
], ExportController);
//# sourceMappingURL=export.controller.js.map