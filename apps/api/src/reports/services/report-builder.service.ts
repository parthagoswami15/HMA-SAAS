import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FactBilling, FactVisits, FactLabs, DimDate, DimFacility, DimProvider, DimService, DimPayer } from '../entities/facts.entity';
import { ReportConfig } from '../entities/reports.entity';
import { ReportBuilderDto, ReportQuery, ReportFilter, ReportMetric, ReportDimension } from '../dto/reports.dto';

@Injectable()
export class ReportBuilderService {
  private readonly logger = new Logger(ReportBuilderService.name);

  constructor(
    @InjectRepository(FactBilling)
    private readonly factBillingRepo: Repository<FactBilling>,
    @InjectRepository(FactVisits)
    private readonly factVisitsRepo: Repository<FactVisits>,
    @InjectRepository(FactLabs)
    private readonly factLabsRepo: Repository<FactLabs>,
    @InjectRepository(DimDate)
    private readonly dimDateRepo: Repository<DimDate>,
    @InjectRepository(DimFacility)
    private readonly dimFacilityRepo: Repository<DimFacility>,
    @InjectRepository(DimProvider)
    private readonly dimProviderRepo: Repository<DimProvider>,
    @InjectRepository(DimService)
    private readonly dimServiceRepo: Repository<DimService>,
    @InjectRepository(DimPayer)
    private readonly dimPayerRepo: Repository<DimPayer>,
    @InjectRepository(ReportConfig)
    private readonly reportConfigRepo: Repository<ReportConfig>,
  ) {}

  async buildReport(tenantId: string, userId: string, reportBuilderDto: ReportBuilderDto): Promise<any> {
    try {
      this.logger.log(`Building report for tenant: ${tenantId}, user: ${userId}`);

      // Validate the report configuration
      await this.validateReportConfig(reportBuilderDto);

      // Generate SQL query based on configuration
      const query = this.generateSQLQuery(tenantId, reportBuilderDto);

      // Execute the query
      const results = await this.executeQuery(query);

      // Apply post-processing (sorting, grouping, etc.)
      const processedResults = this.processResults(results, reportBuilderDto);

      // Format response
      const response = {
        metadata: {
          tenantId,
          userId,
          generatedAt: new Date(),
          totalRows: results.length,
          query: query.sql,
          executionTime: Date.now() - Date.now(), // Would need proper timing
        },
        data: processedResults,
        summary: this.generateSummary(processedResults, reportBuilderDto),
      };

      this.logger.log(`Report built successfully with ${results.length} rows`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to build report: ${error.message}`, error.stack);
      throw new BadRequestException(`Report building failed: ${error.message}`);
    }
  }

  async saveReportConfig(
    tenantId: string,
    userId: string,
    reportBuilderDto: ReportBuilderDto,
    name: string,
    description?: string,
  ): Promise<ReportConfig> {
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
    } catch (error) {
      this.logger.error(`Failed to save report config: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to save report configuration');
    }
  }

  async getReportTemplates(tenantId: string): Promise<any[]> {
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

  async validateReportConfig(reportBuilderDto: ReportBuilderDto): Promise<void> {
    // Validate fact table
    if (!['FactBilling', 'FactVisits', 'FactLabs'].includes(reportBuilderDto.factTable)) {
      throw new BadRequestException('Invalid fact table specified');
    }

    // Validate dimensions
    for (const dimension of reportBuilderDto.dimensions) {
      if (!this.isValidDimension(reportBuilderDto.factTable, dimension)) {
        throw new BadRequestException(`Invalid dimension: ${dimension} for fact table: ${reportBuilderDto.factTable}`);
      }
    }

    // Validate metrics
    for (const metric of reportBuilderDto.metrics) {
      if (!this.isValidMetric(reportBuilderDto.factTable, metric)) {
        throw new BadRequestException(`Invalid metric: ${metric} for fact table: ${reportBuilderDto.factTable}`);
      }
    }

    // Validate filters
    for (const filter of reportBuilderDto.filters) {
      if (!this.isValidFilter(reportBuilderDto.factTable, filter)) {
        throw new BadRequestException(`Invalid filter: ${filter.field}`);
      }
    }

    // Check for conflicts
    if (reportBuilderDto.groupBy && reportBuilderDto.groupBy.length === 0 && reportBuilderDto.metrics.length > 1) {
      throw new BadRequestException('Cannot have multiple metrics without grouping');
    }
  }

  private isValidDimension(factTable: string, dimension: string): boolean {
    const validDimensions: Record<string, string[]> = {
      FactBilling: ['DimDate', 'DimFacility', 'DimProvider', 'DimService', 'DimPayer'],
      FactVisits: ['DimDate', 'DimFacility', 'DimProvider', 'DimService'],
      FactLabs: ['DimDate', 'DimFacility', 'DimProvider', 'DimService'],
    };

    return validDimensions[factTable]?.includes(dimension) || false;
  }

  private isValidMetric(factTable: string, metric: string): boolean {
    const validMetrics: Record<string, string[]> = {
      FactBilling: ['totalAmount', 'collectedAmount', 'outstandingAmount', 'discountAmount', 'taxAmount'],
      FactVisits: ['visitCount', 'uniquePatients', 'avgComplexity', 'emergencyCount', 'referralCount'],
      FactLabs: ['testCount', 'turnaroundHours', 'abnormalResults', 'rerunCount', 'cancelledCount'],
    };

    return validMetrics[factTable]?.includes(metric) || false;
  }

  private isValidFilter(factTable: string, filter: ReportFilter): boolean {
    // Basic validation - in real implementation, would check against actual schema
    return filter.field && filter.operator && filter.value !== undefined;
  }

  private generateSQLQuery(tenantId: string, reportBuilderDto: ReportBuilderDto): { sql: string; params: any[] } {
    const { factTable, dimensions, metrics, filters, groupBy, sortBy, limit } = reportBuilderDto;

    let sql = `SELECT `;

    // Build SELECT clause
    const selectFields: string[] = [];

    // Add dimension fields
    for (const dimension of dimensions) {
      selectFields.push(this.getDimensionField(dimension));
    }

    // Add metric fields
    for (const metric of metrics) {
      selectFields.push(this.getMetricField(factTable, metric));
    }

    sql += selectFields.join(', ');

    // Build FROM clause
    sql += ` FROM ${factTable} f`;

    // Build JOINs for dimensions
    for (const dimension of dimensions) {
      sql += this.getDimensionJoin(dimension);
    }

    // Build WHERE clause
    const whereConditions: string[] = [`f.tenantId = '${tenantId}'`];
    const params: any[] = [tenantId];

    for (const filter of filters) {
      const { condition, field, operator, value } = filter;
      whereConditions.push(`${condition || 'AND'} ${this.buildFilterCondition(field, operator, value, params)}`);
    }

    if (whereConditions.length > 1) {
      sql += ` WHERE ${whereConditions.join(' ')}`;
    }

    // Build GROUP BY clause
    if (groupBy && groupBy.length > 0) {
      const groupFields = groupBy.map(field => this.getFieldAlias(field));
      sql += ` GROUP BY ${groupFields.join(', ')}`;
    }

    // Build ORDER BY clause
    if (sortBy && sortBy.length > 0) {
      const orderFields = sortBy.map(sort => {
        const direction = sort.direction || 'ASC';
        return `${this.getFieldAlias(sort.field)} ${direction}`;
      });
      sql += ` ORDER BY ${orderFields.join(', ')}`;
    }

    // Build LIMIT clause
    if (limit) {
      sql += ` LIMIT ${limit}`;
    }

    return { sql, params };
  }

  private getDimensionField(dimension: string): string {
    const fieldMappings: Record<string, string> = {
      DimDate: 'd.date',
      DimFacility: 'fac.name',
      DimProvider: 'p.name',
      DimService: 's.name',
      DimPayer: 'pay.name',
    };

    return `${fieldMappings[dimension]} AS "${dimension}"`;
  }

  private getMetricField(factTable: string, metric: string): string {
    return `f.${metric} AS "${metric}"`;
  }

  private getDimensionJoin(dimension: string): string {
    const joinMappings: Record<string, string> = {
      DimDate: ' LEFT JOIN DimDate d ON f.dateId = d.id',
      DimFacility: ' LEFT JOIN DimFacility fac ON f.facilityId = fac.id',
      DimProvider: ' LEFT JOIN DimProvider p ON f.providerId = p.id',
      DimService: ' LEFT JOIN DimService s ON f.serviceId = s.id',
      DimPayer: ' LEFT JOIN DimPayer pay ON f.payerId = pay.id',
    };

    return joinMappings[dimension] || '';
  }

  private buildFilterCondition(field: string, operator: string, value: any, params: any[]): string {
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
        throw new BadRequestException(`Unsupported operator: ${operator}`);
    }
  }

  private getFieldAlias(field: string): string {
    // Convert dimension.field to appropriate alias
    return field.replace('.', '_');
  }

  private async executeQuery(query: { sql: string; params: any[] }): Promise<any[]> {
    // In a real implementation, this would use TypeORM's query method
    // For now, return mock data
    this.logger.log(`Executing query: ${query.sql} with params: ${JSON.stringify(query.params)}`);

    // Mock execution - in real app, this would be:
    // return await this.getRepository(query.factTable).query(query.sql, query.params);
    return this.generateMockData(query);
  }

  private generateMockData(query: { sql: string; params: any[] }): any[] {
    // Generate mock data based on query structure
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

  private processResults(results: any[], reportBuilderDto: ReportBuilderDto): any[] {
    // Apply sorting, grouping, and other post-processing
    if (reportBuilderDto.sortBy && reportBuilderDto.sortBy.length > 0) {
      results.sort((a, b) => {
        for (const sort of reportBuilderDto.sortBy) {
          const aVal = this.getNestedValue(a, sort.field);
          const bVal = this.getNestedValue(b, sort.field);

          if (aVal < bVal) return sort.direction === 'DESC' ? 1 : -1;
          if (aVal > bVal) return sort.direction === 'DESC' ? -1 : 1;
        }
        return 0;
      });
    }

    return results;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private generateSummary(results: any[], reportBuilderDto: ReportBuilderDto): any {
    const summary: any = {
      totalRows: results.length,
      totalMetrics: reportBuilderDto.metrics.length,
    };

    // Calculate metric totals
    for (const metric of reportBuilderDto.metrics) {
      const total = results.reduce((sum, row) => sum + (row[metric] || 0), 0);
      summary[`total_${metric}`] = total;
    }

    return summary;
  }

  async getReportPreview(
    tenantId: string,
    reportBuilderDto: ReportBuilderDto,
    previewLimit: number = 10,
  ): Promise<any> {
    const previewDto = { ...reportBuilderDto, limit: previewLimit };
    return this.buildReport(tenantId, '', previewDto);
  }

  async validateQuery(tenantId: string, reportBuilderDto: ReportBuilderDto): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      await this.validateReportConfig(reportBuilderDto);
    } catch (error) {
      errors.push(error.message);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
