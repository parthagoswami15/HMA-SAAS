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
var ReportBuilderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportBuilderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const facts_entity_1 = require("../entities/facts.entity");
const reports_entity_1 = require("../entities/reports.entity");
let ReportBuilderService = ReportBuilderService_1 = class ReportBuilderService {
    factBillingRepo;
    factVisitsRepo;
    factLabsRepo;
    dimDateRepo;
    dimFacilityRepo;
    dimProviderRepo;
    dimServiceRepo;
    dimPayerRepo;
    reportConfigRepo;
    logger = new common_1.Logger(ReportBuilderService_1.name);
    constructor(factBillingRepo, factVisitsRepo, factLabsRepo, dimDateRepo, dimFacilityRepo, dimProviderRepo, dimServiceRepo, dimPayerRepo, reportConfigRepo) {
        this.factBillingRepo = factBillingRepo;
        this.factVisitsRepo = factVisitsRepo;
        this.factLabsRepo = factLabsRepo;
        this.dimDateRepo = dimDateRepo;
        this.dimFacilityRepo = dimFacilityRepo;
        this.dimProviderRepo = dimProviderRepo;
        this.dimServiceRepo = dimServiceRepo;
        this.dimPayerRepo = dimPayerRepo;
        this.reportConfigRepo = reportConfigRepo;
    }
    async buildReport(tenantId, userId, reportBuilderDto) {
        try {
            this.logger.log(`Building report for tenant: ${tenantId}, user: ${userId}`);
            await this.validateReportConfig(reportBuilderDto);
            const query = this.generateSQLQuery(tenantId, reportBuilderDto);
            const results = await this.executeQuery(query);
            const processedResults = this.processResults(results, reportBuilderDto);
            const response = {
                metadata: {
                    tenantId,
                    userId,
                    generatedAt: new Date(),
                    totalRows: results.length,
                    query: query.sql,
                    executionTime: Date.now() - Date.now(),
                },
                data: processedResults,
                summary: this.generateSummary(processedResults, reportBuilderDto),
            };
            this.logger.log(`Report built successfully with ${results.length} rows`);
            return response;
        }
        catch (error) {
            this.logger.error(`Failed to build report: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Report building failed: ${error.message}`);
        }
    }
    async saveReportConfig(tenantId, userId, reportBuilderDto, name, description) {
        try {
            const reportConfig = this.reportConfigRepo.create({
                tenantId,
                name,
                description: description || 'Custom report',
                category: 'CUSTOM',
                config: reportBuilderDto,
                isActive: true,
                createdBy: userId,
            });
            const savedConfig = await this.reportConfigRepo.save(reportConfig);
            this.logger.log(`Report configuration saved: ${savedConfig.id} for tenant: ${tenantId}`);
            return savedConfig;
        }
        catch (error) {
            this.logger.error(`Failed to save report config: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to save report configuration');
        }
    }
    async getReportTemplates(tenantId) {
        return [
            {
                id: 'daily-collections',
                name: 'Daily Collections Report',
                description: 'Daily revenue and collection analysis',
                category: 'FINANCIAL',
                template: {
                    factTable: 'FactBilling',
                    dimensions: ['DimDate', 'DimFacility', 'DimProvider'],
                    metrics: ['totalAmount', 'collectedAmount', 'outstandingAmount'],
                    filters: [
                        { field: 'date.date', operator: 'gte', value: 'CURRENT_DATE - 30 days' }
                    ],
                    groupBy: ['date.date', 'facility.name'],
                },
            },
            {
                id: 'patient-visits',
                name: 'Patient Visits Analysis',
                description: 'Patient visit patterns and trends',
                category: 'CLINICAL',
                template: {
                    factTable: 'FactVisits',
                    dimensions: ['DimDate', 'DimFacility', 'DimProvider', 'DimService'],
                    metrics: ['visitCount', 'uniquePatients'],
                    filters: [],
                    groupBy: ['date.date', 'facility.name', 'provider.name'],
                },
            },
            {
                id: 'lab-utilization',
                name: 'Lab Utilization Report',
                description: 'Laboratory test utilization and performance',
                category: 'OPERATIONAL',
                template: {
                    factTable: 'FactLabs',
                    dimensions: ['DimDate', 'DimFacility', 'DimService'],
                    metrics: ['testCount', 'turnaroundHours', 'abnormalResults'],
                    filters: [],
                    groupBy: ['date.date', 'facility.name', 'service.name'],
                },
            },
            {
                id: 'revenue-by-payer',
                name: 'Revenue by Payer Analysis',
                description: 'Revenue breakdown by insurance and payment types',
                category: 'FINANCIAL',
                template: {
                    factTable: 'FactBilling',
                    dimensions: ['DimDate', 'DimPayer', 'DimService'],
                    metrics: ['totalAmount', 'collectedAmount'],
                    filters: [],
                    groupBy: ['payer.name', 'service.name', 'date.month'],
                },
            },
            {
                id: 'case-mix-analysis',
                name: 'Case Mix Analysis',
                description: 'Patient case complexity and service utilization',
                category: 'CLINICAL',
                template: {
                    factTable: 'FactVisits',
                    dimensions: ['DimDate', 'DimService', 'DimProvider'],
                    metrics: ['visitCount', 'avgComplexity'],
                    filters: [],
                    groupBy: ['service.category', 'provider.specialty'],
                },
            },
        ];
    }
    async validateReportConfig(reportBuilderDto) {
        if (!['FactBilling', 'FactVisits', 'FactLabs'].includes(reportBuilderDto.factTable)) {
            throw new common_1.BadRequestException('Invalid fact table specified');
        }
        for (const dimension of reportBuilderDto.dimensions) {
            if (!this.isValidDimension(reportBuilderDto.factTable, dimension)) {
                throw new common_1.BadRequestException(`Invalid dimension: ${dimension} for fact table: ${reportBuilderDto.factTable}`);
            }
        }
        for (const metric of reportBuilderDto.metrics) {
            if (!this.isValidMetric(reportBuilderDto.factTable, metric)) {
                throw new common_1.BadRequestException(`Invalid metric: ${metric} for fact table: ${reportBuilderDto.factTable}`);
            }
        }
        for (const filter of reportBuilderDto.filters) {
            if (!this.isValidFilter(reportBuilderDto.factTable, filter)) {
                throw new common_1.BadRequestException(`Invalid filter: ${filter.field}`);
            }
        }
        if (reportBuilderDto.groupBy && reportBuilderDto.groupBy.length === 0 && reportBuilderDto.metrics.length > 1) {
            throw new common_1.BadRequestException('Cannot have multiple metrics without grouping');
        }
    }
    isValidDimension(factTable, dimension) {
        const validDimensions = {
            FactBilling: ['DimDate', 'DimFacility', 'DimProvider', 'DimService', 'DimPayer'],
            FactVisits: ['DimDate', 'DimFacility', 'DimProvider', 'DimService'],
            FactLabs: ['DimDate', 'DimFacility', 'DimProvider', 'DimService'],
        };
        return validDimensions[factTable]?.includes(dimension) || false;
    }
    isValidMetric(factTable, metric) {
        const validMetrics = {
            FactBilling: ['totalAmount', 'collectedAmount', 'outstandingAmount', 'discountAmount', 'taxAmount'],
            FactVisits: ['visitCount', 'uniquePatients', 'avgComplexity', 'emergencyCount', 'referralCount'],
            FactLabs: ['testCount', 'turnaroundHours', 'abnormalResults', 'rerunCount', 'cancelledCount'],
        };
        return validMetrics[factTable]?.includes(metric) || false;
    }
    isValidFilter(factTable, filter) {
        return filter.field && filter.operator && filter.value !== undefined;
    }
    generateSQLQuery(tenantId, reportBuilderDto) {
        const { factTable, dimensions, metrics, filters, groupBy, sortBy, limit } = reportBuilderDto;
        let sql = `SELECT `;
        const selectFields = [];
        for (const dimension of dimensions) {
            selectFields.push(this.getDimensionField(dimension));
        }
        for (const metric of metrics) {
            selectFields.push(this.getMetricField(factTable, metric));
        }
        sql += selectFields.join(', ');
        sql += ` FROM ${factTable} f`;
        for (const dimension of dimensions) {
            sql += this.getDimensionJoin(dimension);
        }
        const whereConditions = [`f.tenantId = '${tenantId}'`];
        const params = [tenantId];
        for (const filter of filters) {
            const { condition, field, operator, value } = filter;
            whereConditions.push(`${condition || 'AND'} ${this.buildFilterCondition(field, operator, value, params)}`);
        }
        if (whereConditions.length > 1) {
            sql += ` WHERE ${whereConditions.join(' ')}`;
        }
        if (groupBy && groupBy.length > 0) {
            const groupFields = groupBy.map(field => this.getFieldAlias(field));
            sql += ` GROUP BY ${groupFields.join(', ')}`;
        }
        if (sortBy && sortBy.length > 0) {
            const orderFields = sortBy.map(sort => {
                const direction = sort.direction || 'ASC';
                return `${this.getFieldAlias(sort.field)} ${direction}`;
            });
            sql += ` ORDER BY ${orderFields.join(', ')}`;
        }
        if (limit) {
            sql += ` LIMIT ${limit}`;
        }
        return { sql, params };
    }
    getDimensionField(dimension) {
        const fieldMappings = {
            DimDate: 'd.date',
            DimFacility: 'fac.name',
            DimProvider: 'p.name',
            DimService: 's.name',
            DimPayer: 'pay.name',
        };
        return `${fieldMappings[dimension]} AS "${dimension}"`;
    }
    getMetricField(factTable, metric) {
        return `f.${metric} AS "${metric}"`;
    }
    getDimensionJoin(dimension) {
        const joinMappings = {
            DimDate: ' LEFT JOIN DimDate d ON f.dateId = d.id',
            DimFacility: ' LEFT JOIN DimFacility fac ON f.facilityId = fac.id',
            DimProvider: ' LEFT JOIN DimProvider p ON f.providerId = p.id',
            DimService: ' LEFT JOIN DimService s ON f.serviceId = s.id',
            DimPayer: ' LEFT JOIN DimPayer pay ON f.payerId = pay.id',
        };
        return joinMappings[dimension] || '';
    }
    buildFilterCondition(field, operator, value, params) {
        const paramIndex = params.length;
        switch (operator) {
            case 'eq':
                params.push(value);
                return `${field} = $${paramIndex}`;
            case 'neq':
                params.push(value);
                return `${field} != $${paramIndex}`;
            case 'gt':
                params.push(value);
                return `${field} > $${paramIndex}`;
            case 'gte':
                params.push(value);
                return `${field} >= $${paramIndex}`;
            case 'lt':
                params.push(value);
                return `${field} < $${paramIndex}`;
            case 'lte':
                params.push(value);
                return `${field} <= $${paramIndex}`;
            case 'like':
                params.push(`%${value}%`);
                return `${field} ILIKE $${paramIndex}`;
            case 'in':
                const values = Array.isArray(value) ? value : [value];
                const placeholders = values.map((_, i) => `$${paramIndex + i}`).join(', ');
                params.push(...values);
                return `${field} IN (${placeholders})`;
            case 'between':
                const [start, end] = value;
                params.push(start, end);
                return `${field} BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
            default:
                throw new common_1.BadRequestException(`Unsupported operator: ${operator}`);
        }
    }
    getFieldAlias(field) {
        return field.replace('.', '_');
    }
    async executeQuery(query) {
        this.logger.log(`Executing query: ${query.sql} with params: ${JSON.stringify(query.params)}`);
        return this.generateMockData(query);
    }
    generateMockData(query) {
        const mockRowCount = Math.floor(Math.random() * 100) + 10;
        return Array.from({ length: mockRowCount }, (_, i) => ({
            id: i + 1,
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            facility: `Facility ${Math.floor(Math.random() * 5) + 1}`,
            provider: `Provider ${Math.floor(Math.random() * 10) + 1}`,
            service: `Service ${Math.floor(Math.random() * 8) + 1}`,
            totalAmount: Math.floor(Math.random() * 10000) + 1000,
            collectedAmount: Math.floor(Math.random() * 8000) + 500,
            visitCount: Math.floor(Math.random() * 50) + 5,
        }));
    }
    processResults(results, reportBuilderDto) {
        if (reportBuilderDto.sortBy && reportBuilderDto.sortBy.length > 0) {
            results.sort((a, b) => {
                for (const sort of reportBuilderDto.sortBy) {
                    const aVal = this.getNestedValue(a, sort.field);
                    const bVal = this.getNestedValue(b, sort.field);
                    if (aVal < bVal)
                        return sort.direction === 'DESC' ? 1 : -1;
                    if (aVal > bVal)
                        return sort.direction === 'DESC' ? -1 : 1;
                }
                return 0;
            });
        }
        return results;
    }
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    generateSummary(results, reportBuilderDto) {
        const summary = {
            totalRows: results.length,
            totalMetrics: reportBuilderDto.metrics.length,
        };
        for (const metric of reportBuilderDto.metrics) {
            const total = results.reduce((sum, row) => sum + (row[metric] || 0), 0);
            summary[`total_${metric}`] = total;
        }
        return summary;
    }
    async getReportPreview(tenantId, reportBuilderDto, previewLimit = 10) {
        const previewDto = { ...reportBuilderDto, limit: previewLimit };
        return this.buildReport(tenantId, '', previewDto);
    }
    async validateQuery(tenantId, reportBuilderDto) {
        const errors = [];
        try {
            await this.validateReportConfig(reportBuilderDto);
        }
        catch (error) {
            errors.push(error.message);
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
};
exports.ReportBuilderService = ReportBuilderService;
exports.ReportBuilderService = ReportBuilderService = ReportBuilderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(facts_entity_1.FactBilling)),
    __param(1, (0, typeorm_1.InjectRepository)(facts_entity_1.FactVisits)),
    __param(2, (0, typeorm_1.InjectRepository)(facts_entity_1.FactLabs)),
    __param(3, (0, typeorm_1.InjectRepository)(facts_entity_1.DimDate)),
    __param(4, (0, typeorm_1.InjectRepository)(facts_entity_1.DimFacility)),
    __param(5, (0, typeorm_1.InjectRepository)(facts_entity_1.DimProvider)),
    __param(6, (0, typeorm_1.InjectRepository)(facts_entity_1.DimService)),
    __param(7, (0, typeorm_1.InjectRepository)(facts_entity_1.DimPayer)),
    __param(8, (0, typeorm_1.InjectRepository)(reports_entity_1.ReportConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportBuilderService);
//# sourceMappingURL=report-builder.service.js.map