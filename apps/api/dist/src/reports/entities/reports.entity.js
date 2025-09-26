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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardAccess = exports.DashboardConfig = exports.SavedReport = exports.ReportSchedule = exports.ReportConfig = void 0;
const typeorm_1 = require("typeorm");
let ReportConfig = class ReportConfig {
    id;
    createdAt;
    updatedAt;
    tenantId;
    name;
    description;
    category;
    type;
    configuration;
    parameters;
    isActive;
    isPublic;
    accessLevel;
    createdBy;
    updatedBy;
    tags;
    usageCount;
    lastUsedAt;
    schedules;
    savedReports;
};
exports.ReportConfig = ReportConfig;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReportConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReportConfig.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ReportConfig.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ReportConfig.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], ReportConfig.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], ReportConfig.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ReportConfig.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ReportConfig.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], ReportConfig.prototype, "configuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ReportConfig.prototype, "parameters", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ReportConfig.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ReportConfig.prototype, "isPublic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ReportConfig.prototype, "accessLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ReportConfig.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ReportConfig.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], ReportConfig.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ReportConfig.prototype, "usageCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], ReportConfig.prototype, "lastUsedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ReportSchedule, schedule => schedule.report),
    __metadata("design:type", Array)
], ReportConfig.prototype, "schedules", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SavedReport, savedReport => savedReport.report),
    __metadata("design:type", Array)
], ReportConfig.prototype, "savedReports", void 0);
exports.ReportConfig = ReportConfig = __decorate([
    (0, typeorm_1.Entity)('report_config')
], ReportConfig);
let ReportSchedule = class ReportSchedule {
    id;
    createdAt;
    updatedAt;
    tenantId;
    report;
    reportId;
    frequency;
    dayOfWeek;
    dayOfMonth;
    scheduledTime;
    format;
    recipients;
    filters;
    isActive;
    nextRunAt;
    lastRunAt;
    lastError;
    createdBy;
};
exports.ReportSchedule = ReportSchedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReportSchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReportSchedule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ReportSchedule.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ReportSchedule.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ReportConfig),
    (0, typeorm_1.JoinColumn)({ name: 'report_id' }),
    __metadata("design:type", ReportConfig)
], ReportSchedule.prototype, "report", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ReportSchedule.prototype, "reportId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "dayOfWeek", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ReportSchedule.prototype, "dayOfMonth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "scheduledTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "format", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], ReportSchedule.prototype, "recipients", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ReportSchedule.prototype, "filters", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ReportSchedule.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], ReportSchedule.prototype, "nextRunAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], ReportSchedule.prototype, "lastRunAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], ReportSchedule.prototype, "lastError", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ReportSchedule.prototype, "createdBy", void 0);
exports.ReportSchedule = ReportSchedule = __decorate([
    (0, typeorm_1.Entity)('report_schedule')
], ReportSchedule);
let SavedReport = class SavedReport {
    id;
    createdAt;
    updatedAt;
    tenantId;
    report;
    reportId;
    name;
    description;
    configuration;
    data;
    status;
    expiresAt;
    generatedBy;
    userId;
    exportFormat;
    viewCount;
    lastViewedAt;
};
exports.SavedReport = SavedReport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SavedReport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SavedReport.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SavedReport.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], SavedReport.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ReportConfig),
    (0, typeorm_1.JoinColumn)({ name: 'report_id' }),
    __metadata("design:type", ReportConfig)
], SavedReport.prototype, "report", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], SavedReport.prototype, "reportId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], SavedReport.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], SavedReport.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], SavedReport.prototype, "configuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], SavedReport.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], SavedReport.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SavedReport.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], SavedReport.prototype, "generatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], SavedReport.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], SavedReport.prototype, "exportFormat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], SavedReport.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SavedReport.prototype, "lastViewedAt", void 0);
exports.SavedReport = SavedReport = __decorate([
    (0, typeorm_1.Entity)('saved_report')
], SavedReport);
let DashboardConfig = class DashboardConfig {
    id;
    createdAt;
    updatedAt;
    tenantId;
    name;
    description;
    layout;
    isActive;
    isDefault;
    accessLevel;
    createdBy;
    tags;
    usageCount;
    lastUsedAt;
    accessRecords;
};
exports.DashboardConfig = DashboardConfig;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DashboardConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DashboardConfig.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DashboardConfig.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], DashboardConfig.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], DashboardConfig.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], DashboardConfig.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], DashboardConfig.prototype, "layout", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], DashboardConfig.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], DashboardConfig.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], DashboardConfig.prototype, "accessLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], DashboardConfig.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], DashboardConfig.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], DashboardConfig.prototype, "usageCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], DashboardConfig.prototype, "lastUsedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => DashboardAccess, access => access.dashboard),
    __metadata("design:type", Array)
], DashboardConfig.prototype, "accessRecords", void 0);
exports.DashboardConfig = DashboardConfig = __decorate([
    (0, typeorm_1.Entity)('dashboard_config')
], DashboardConfig);
let DashboardAccess = class DashboardAccess {
    id;
    createdAt;
    updatedAt;
    tenantId;
    dashboard;
    dashboardId;
    userId;
    permission;
    department;
    role;
};
exports.DashboardAccess = DashboardAccess;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DashboardAccess.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DashboardAccess.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DashboardAccess.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], DashboardAccess.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => DashboardConfig),
    (0, typeorm_1.JoinColumn)({ name: 'dashboard_id' }),
    __metadata("design:type", DashboardConfig)
], DashboardAccess.prototype, "dashboard", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], DashboardAccess.prototype, "dashboardId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], DashboardAccess.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], DashboardAccess.prototype, "permission", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], DashboardAccess.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], DashboardAccess.prototype, "role", void 0);
exports.DashboardAccess = DashboardAccess = __decorate([
    (0, typeorm_1.Entity)('dashboard_access')
], DashboardAccess);
//# sourceMappingURL=reports.entity.js.map