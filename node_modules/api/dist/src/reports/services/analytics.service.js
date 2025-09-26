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
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const facts_entity_1 = require("../entities/facts.entity");
const dimensions_entity_1 = require("../entities/dimensions.entity");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    factBillingRepo;
    factVisitsRepo;
    factLabsRepo;
    dimDateRepo;
    dimFacilityRepo;
    dimProviderRepo;
    dimServiceRepo;
    dimPayerRepo;
    logger = new common_1.Logger(AnalyticsService_1.name);
    constructor(factBillingRepo, factVisitsRepo, factLabsRepo, dimDateRepo, dimFacilityRepo, dimProviderRepo, dimServiceRepo, dimPayerRepo) {
        this.factBillingRepo = factBillingRepo;
        this.factVisitsRepo = factVisitsRepo;
        this.factLabsRepo = factLabsRepo;
        this.dimDateRepo = dimDateRepo;
        this.dimFacilityRepo = dimFacilityRepo;
        this.dimProviderRepo = dimProviderRepo;
        this.dimServiceRepo = dimServiceRepo;
        this.dimPayerRepo = dimPayerRepo;
    }
    async getDailyCollections(tenantId, filters) {
        const { startDate, endDate, departments, serviceCategories, paymentMethod } = filters;
        const queryBuilder = this.factBillingRepo.createQueryBuilder('billing')
            .leftJoinAndSelect('billing.date', 'date')
            .leftJoinAndSelect('billing.facility', 'facility')
            .leftJoinAndSelect('billing.provider', 'provider')
            .leftJoinAndSelect('billing.service', 'service')
            .leftJoinAndSelect('billing.payer', 'payer')
            .where('billing.tenantId = :tenantId', { tenantId })
            .andWhere('billing.paymentStatus IN (:...statuses)', { statuses: ['PAID', 'PARTIAL'] });
        if (startDate && endDate) {
            queryBuilder.andWhere('date.date BETWEEN :startDate AND :endDate', { startDate, endDate });
        }
        if (departments && departments.length > 0) {
            queryBuilder.andWhere('facility.name IN (:...departments)', { departments });
        }
        if (serviceCategories && serviceCategories.length > 0) {
            queryBuilder.andWhere('service.category IN (:...serviceCategories)', { serviceCategories });
        }
        if (paymentMethod) {
            queryBuilder.andWhere('billing.paymentMethod = :paymentMethod', { paymentMethod });
        }
        queryBuilder
            .select([
            'date.date as collection_date',
            'facility.name as department',
            'service.name as service_name',
            'service.category as service_category',
            'payer.name as payer_name',
            'payer.type as payer_type',
            'billing.paymentMethod as payment_method',
            'SUM(billing.paidAmount) as total_collected',
            'SUM(billing.grossAmount) as gross_amount',
            'SUM(billing.discountAmount) as total_discount',
            'SUM(billing.netAmount) as net_amount',
            'COUNT(*) as transaction_count',
        ])
            .groupBy('date.date, facility.name, service.name, service.category, payer.name, payer.type, billing.paymentMethod')
            .orderBy('date.date', 'DESC')
            .addOrderBy('total_collected', 'DESC');
        return queryBuilder.getRawMany();
    }
    async getRevenueAnalysis(tenantId, filters) {
        const { startDate, endDate, departments, providers, serviceTypes } = filters;
        const queryBuilder = this.factBillingRepo.createQueryBuilder('billing')
            .leftJoinAndSelect('billing.date', 'date')
            .leftJoinAndSelect('billing.facility', 'facility')
            .leftJoinAndSelect('billing.provider', 'provider')
            .leftJoinAndSelect('billing.service', 'service')
            .leftJoinAndSelect('billing.payer', 'payer')
            .where('billing.tenantId = :tenantId', { tenantId });
        if (startDate && endDate) {
            queryBuilder.andWhere('date.date BETWEEN :startDate AND :endDate', { startDate, endDate });
        }
        if (departments && departments.length > 0) {
            queryBuilder.andWhere('facility.name IN (:...departments)', { departments });
        }
        if (providers && providers.length > 0) {
            queryBuilder.andWhere('provider.id IN (:...providers)', { providers });
        }
        if (serviceTypes && serviceTypes.length > 0) {
            queryBuilder.andWhere('service.category IN (:...serviceTypes)', { serviceTypes });
        }
        queryBuilder
            .select([
            'date.date as revenue_date',
            'facility.name as department',
            'CONCAT(provider.firstName, \' \', provider.lastName) as provider_name',
            'service.name as service_name',
            'service.category as service_category',
            'SUM(billing.grossAmount) as gross_revenue',
            'SUM(billing.discountAmount) as total_discount',
            'SUM(billing.netAmount) as net_revenue',
            'SUM(billing.paidAmount) as total_paid',
            'SUM(billing.outstandingAmount) as total_outstanding',
            'COUNT(*) as transaction_count',
            'AVG(billing.netAmount) as avg_transaction_value',
        ])
            .groupBy('date.date, facility.name, provider.firstName, provider.lastName, service.name, service.category')
            .orderBy('date.date', 'DESC')
            .addOrderBy('gross_revenue', 'DESC');
        return queryBuilder.getRawMany();
    }
    async getGSTReport(tenantId, filters) {
        const { startDate, endDate, gstRate, includeExempted, includeZeroRated } = filters;
        const queryBuilder = this.factBillingRepo.createQueryBuilder('billing')
            .leftJoinAndSelect('billing.date', 'date')
            .leftJoinAndSelect('billing.facility', 'facility')
            .leftJoinAndSelect('billing.service', 'service')
            .where('billing.tenantId = :tenantId', { tenantId })
            .andWhere('billing.isTaxable = :isTaxable', { isTaxable: true });
        if (startDate && endDate) {
            queryBuilder.andWhere('date.date BETWEEN :startDate AND :endDate', { startDate, endDate });
        }
        if (gstRate) {
            queryBuilder.andWhere('service.gstRate = :gstRate', { gstRate: parseFloat(gstRate) });
        }
        if (!includeExempted) {
            queryBuilder.andWhere('service.gstRate > 0');
        }
        queryBuilder
            .select([
            'date.date as gst_date',
            'facility.name as department',
            'service.name as service_name',
            'service.gstRate as gst_rate',
            'SUM(billing.grossAmount) as taxable_amount',
            'SUM(billing.taxAmount) as total_gst',
            'COUNT(*) as invoice_count',
        ])
            .groupBy('date.date, facility.name, service.name, service.gstRate')
            .orderBy('date.date', 'DESC')
            .addOrderBy('total_gst', 'DESC');
        return queryBuilder.getRawMany();
    }
    async getAgingAnalysis(tenantId, filters) {
        const { asOfDate, agingDays, departments, status } = filters;
        const queryBuilder = this.factBillingRepo.createQueryBuilder('billing')
            .leftJoinAndSelect('billing.date', 'date')
            .leftJoinAndSelect('billing.facility', 'facility')
            .leftJoinAndSelect('billing.provider', 'provider')
            .leftJoinAndSelect('billing.service', 'service')
            .leftJoinAndSelect('billing.payer', 'payer')
            .where('billing.tenantId = :tenantId', { tenantId })
            .andWhere('billing.outstandingAmount > 0');
        if (asOfDate) {
            queryBuilder.andWhere('date.date <= :asOfDate', { asOfDate });
        }
        if (departments && departments.length > 0) {
            queryBuilder.andWhere('facility.name IN (:...departments)', { departments });
        }
        if (status) {
            queryBuilder.andWhere('billing.paymentStatus = :status', { status });
        }
        queryBuilder
            .select([
            'facility.name as department',
            'CONCAT(provider.firstName, \' \', provider.lastName) as provider_name',
            'service.name as service_name',
            'payer.name as payer_name',
            'billing.invoiceNumber as invoice_number',
            'date.date as invoice_date',
            'billing.netAmount as invoice_amount',
            'billing.paidAmount as paid_amount',
            'billing.outstandingAmount as outstanding_amount',
            'billing.dueDate as due_date',
            'DATEDIFF(CURRENT_DATE, date.date) as days_outstanding',
            'CASE ' +
                'WHEN DATEDIFF(CURRENT_DATE, date.date) <= 30 THEN \'0-30\' ' +
                'WHEN DATEDIFF(CURRENT_DATE, date.date) <= 60 THEN \'31-60\' ' +
                'WHEN DATEDIFF(CURRENT_DATE, date.date) <= 90 THEN \'61-90\' ' +
                'ELSE \'90+\' END as aging_bucket',
        ])
            .orderBy('days_outstanding', 'DESC');
        if (agingDays) {
            queryBuilder.andWhere('DATEDIFF(CURRENT_DATE, date.date) >= :agingDays', { agingDays });
        }
        return queryBuilder.getRawMany();
    }
    async getCaseMixAnalysis(tenantId, filters) {
        const { startDate, endDate, classification, includeSeverity, includeComorbidities } = filters;
        const queryBuilder = this.factVisitsRepo.createQueryBuilder('visit')
            .leftJoinAndSelect('visit.date', 'date')
            .leftJoinAndSelect('visit.facility', 'facility')
            .leftJoinAndSelect('visit.provider', 'provider')
            .leftJoinAndSelect('visit.service', 'service')
            .where('visit.tenantId = :tenantId', { tenantId })
            .andWhere('visit.visitType IN (:...visitTypes)', { visitTypes: ['OPD', 'IPD', 'EMERGENCY'] });
        if (startDate && endDate) {
            queryBuilder.andWhere('date.date BETWEEN :startDate AND :endDate', { startDate, endDate });
        }
        queryBuilder
            .select([
            'facility.name as department',
            'service.category as service_category',
            'COUNT(*) as total_cases',
            'COUNT(CASE WHEN visit.visitType = \'EMERGENCY\' THEN 1 END) as emergency_cases',
            'COUNT(CASE WHEN visit.visitType = \'OPD\' THEN 1 END) as opd_cases',
            'COUNT(CASE WHEN visit.visitType = \'IPD\' THEN 1 END) as ipd_cases',
            'AVG(visit.patientSatisfactionScore) as avg_satisfaction_score',
            'AVG(visit.averageConsultationTime) as avg_consultation_time',
        ])
            .groupBy('facility.name, service.category')
            .orderBy('total_cases', 'DESC');
        return queryBuilder.getRawMany();
    }
    async getInfectionRates(tenantId, filters) {
        const { startDate, endDate, infectionTypes, departments, includeHAI, includeCAI } = filters;
        const mockData = [
            {
                infection_type: 'UTI',
                total_cases: 45,
                hai_cases: 12,
                cai_cases: 33,
                infection_rate: 2.3,
                department: 'General Medicine',
                date: '2024-01-15',
            },
        ];
        return mockData.filter(item => {
            if (infectionTypes && infectionTypes.length > 0 && !infectionTypes.includes(item.infection_type)) {
                return false;
            }
            if (departments && departments.length > 0 && !departments.includes(item.department)) {
                return false;
            }
            return true;
        });
    }
    async getReadmissionsAnalysis(tenantId, filters) {
        const { startDate, endDate, readmissionWindow, departments, diagnosisCodes, includePlanned, includeUnplanned } = filters;
        const queryBuilder = this.factVisitsRepo.createQueryBuilder('visit')
            .leftJoinAndSelect('visit.date', 'date')
            .leftJoinAndSelect('visit.facility', 'facility')
            .leftJoinAndSelect('visit.provider', 'provider')
            .where('visit.tenantId = :tenantId', { tenantId });
        const mockData = [
            {
                patient_id: '123',
                initial_admission_date: '2024-01-01',
                readmission_date: '2024-01-15',
                days_between: 14,
                department: 'Cardiology',
                diagnosis: 'CHF',
                readmission_type: 'UNPLANNED',
                severity: 'HIGH',
            },
        ];
        return mockData;
    }
    async getTurnaroundTimes(tenantId, filters) {
        const { startDate, endDate, serviceType, includeBenchmarks, targetTAT } = filters;
        const queryBuilder = this.factLabsRepo.createQueryBuilder('lab')
            .leftJoinAndSelect('lab.date', 'date')
            .leftJoinAndSelect('lab.facility', 'facility')
            .leftJoinAndSelect('lab.service', 'service')
            .where('lab.tenantId = :tenantId', { tenantId })
            .andWhere('lab.testStatus = :status', { status: 'COMPLETED' });
        if (startDate && endDate) {
            queryBuilder.andWhere('date.date BETWEEN :startDate AND :endDate', { startDate, endDate });
        }
        if (serviceType) {
            queryBuilder.andWhere('lab.testCategory = :serviceType', { serviceType });
        }
        queryBuilder
            .select([
            'facility.name as department',
            'service.name as test_name',
            'lab.testCategory as test_category',
            'lab.priority as priority',
            'AVG(lab.averageTAT) as avg_tat_hours',
            'MIN(lab.averageTAT) as min_tat_hours',
            'MAX(lab.averageTAT) as max_tat_hours',
            'AVG(lab.withinTATPercentage) as within_tat_percentage',
            'COUNT(*) as total_tests',
            'COUNT(CASE WHEN lab.priority = \'STAT\' THEN 1 END) as stat_tests',
            'COUNT(CASE WHEN lab.priority = \'URGENT\' THEN 1 END) as urgent_tests',
        ])
            .groupBy('facility.name, service.name, lab.testCategory, lab.priority')
            .orderBy('avg_tat_hours', 'DESC');
        return queryBuilder.getRawMany();
    }
    async getOccupancyReport(tenantId, filters) {
        const { startDate, endDate, departments, bedTypes, granularity, includeForecasting } = filters;
        const mockData = [
            {
                date: '2024-01-15',
                department: 'General Medicine',
                total_beds: 50,
                occupied_beds: 42,
                available_beds: 8,
                occupancy_rate: 84.0,
                forecasted_occupancy: 86.0,
            },
        ];
        return mockData;
    }
    async getLengthOfStayAnalysis(tenantId, filters) {
        const { startDate, endDate, departments, diagnosisCodes, admissionTypes, includeALOS, includeVariances } = filters;
        const mockData = [
            {
                department: 'Cardiology',
                diagnosis: 'MI',
                admission_type: 'EMERGENCY',
                total_admissions: 25,
                avg_los: 4.2,
                min_los: 1,
                max_los: 12,
                los_variance: 2.1,
                benchmark_los: 3.5,
            },
        ];
        return mockData;
    }
    async getBedTurnoverAnalysis(tenantId, filters) {
        const { startDate, endDate, departments, bedTypes, includeTurnoverRate, includeUtilizationRate } = filters;
        const mockData = [
            {
                department: 'ICU',
                bed_type: 'ICU',
                total_beds: 20,
                total_discharges: 45,
                total_admissions: 47,
                avg_turnover_per_bed: 2.25,
                utilization_rate: 78.5,
                avg_turnover_time: 6.2,
            },
        ];
        return mockData;
    }
    async getPharmacyExpiryReport(tenantId, filters) {
        const { expiryBefore, drugCategories, manufacturers, alertDays, includeExpired, includeValue } = filters;
        const mockData = [
            {
                drug_name: 'Amoxicillin',
                category: 'Antibiotics',
                manufacturer: 'ABC Pharma',
                batch_number: 'BATCH001',
                expiry_date: '2024-06-15',
                quantity_remaining: 150,
                unit_cost: 2.50,
                total_value: 375.00,
                days_to_expiry: 45,
                alert_level: 'MEDIUM',
            },
        ];
        return mockData;
    }
    async getPatientAcquisition(tenantId, filters) {
        const { startDate, endDate, acquisitionType, channels, includeConversionRates, includeDemographics } = filters;
        const mockData = [
            {
                acquisition_date: '2024-01-15',
                channel: 'Online Booking',
                new_patients: 25,
                returning_patients: 12,
                referral_patients: 8,
                conversion_rate: 65.0,
                avg_age: 34.5,
                gender_distribution: { male: 60, female: 40 },
            },
        ];
        return mockData;
    }
    async getPatientRetention(tenantId, filters) {
        const { startDate, endDate, retentionPeriod, segments, includeCohortAnalysis, includeChurnRate } = filters;
        const mockData = [
            {
                cohort_month: '2024-01',
                total_patients: 150,
                retained_month_1: 120,
                retained_month_3: 85,
                retained_month_6: 65,
                retained_month_12: 45,
                churn_rate: 15.0,
                retention_rate: 70.0,
            },
        ];
        return mockData;
    }
    async getNPSAnalysis(tenantId, filters) {
        const { startDate, endDate, minScore, maxScore, departments, providers, includeComments, includeTrends } = filters;
        const mockData = [
            {
                department: 'General Medicine',
                provider: 'Dr. Smith',
                nps_score: 75,
                promoters: 45,
                passives: 30,
                detractors: 15,
                total_responses: 90,
                survey_period: '2024-01',
                top_comments: ['Great service', 'Long wait times'],
            },
        ];
        return mockData;
    }
    async getReferralSourcesAnalysis(tenantId, filters) {
        const { startDate, endDate, sourceTypes, referringEntities, includeConversionRates, includeRevenueImpact } = filters;
        const mockData = [
            {
                referral_source: 'Doctor Referral',
                referring_entity: 'Dr. Johnson',
                total_referrals: 25,
                converted_patients: 18,
                conversion_rate: 72.0,
                avg_revenue_per_referral: 1500.00,
                total_revenue: 37500.00,
            },
        ];
        return mockData;
    }
    async getAnalyticsSummary(tenantId, options) {
        const { dateRange = 'last_30_days', metrics } = options;
        const endDate = new Date();
        const startDate = new Date();
        switch (dateRange) {
            case 'today':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'yesterday':
                startDate.setDate(startDate.getDate() - 1);
                startDate.setHours(0, 0, 0, 0);
                endDate.setDate(endDate.getDate() - 1);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'last_7_days':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'last_30_days':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case 'last_90_days':
                startDate.setDate(startDate.getDate() - 90);
                break;
            case 'this_month':
                startDate.setDate(1);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'last_month':
                startDate.setMonth(startDate.getMonth() - 1, 1);
                startDate.setHours(0, 0, 0, 0);
                endDate.setMonth(endDate.getMonth(), 0);
                endDate.setHours(23, 59, 59, 999);
                break;
        }
        const summary = {
            period: { startDate: startDate.toISOString().split('T')[0], endDate: endDate.toISOString().split('T')[0] },
            metrics: {},
        };
        if (!metrics || metrics.includes('revenue')) {
            const revenue = await this.getRevenueSummary(tenantId, startDate, endDate);
            summary.metrics.revenue = revenue;
        }
        if (!metrics || metrics.includes('collections')) {
            const collections = await this.getCollectionsSummary(tenantId, startDate, endDate);
            summary.metrics.collections = collections;
        }
        if (!metrics || metrics.includes('patient_visits')) {
            const visits = await this.getPatientVisitsSummary(tenantId, startDate, endDate);
            summary.metrics.patient_visits = visits;
        }
        if (!metrics || metrics.includes('lab_tests')) {
            const labTests = await this.getLabTestsSummary(tenantId, startDate, endDate);
            summary.metrics.lab_tests = labTests;
        }
        if (!metrics || metrics.includes('occupancy')) {
            const occupancy = await this.getOccupancySummary(tenantId, startDate, endDate);
            summary.metrics.occupancy = occupancy;
        }
        return summary;
    }
    async getRevenueSummary(tenantId, startDate, endDate) {
        const result = await this.factBillingRepo
            .createQueryBuilder('billing')
            .leftJoin('billing.date', 'date')
            .where('billing.tenantId = :tenantId', { tenantId })
            .andWhere('date.date BETWEEN :startDate AND :endDate', { startDate, endDate })
            .select([
            'SUM(billing.grossAmount) as gross_revenue',
            'SUM(billing.netAmount) as net_revenue',
            'SUM(billing.paidAmount) as total_collected',
            'SUM(billing.outstandingAmount) as total_outstanding',
            'AVG(billing.netAmount) as avg_transaction_value',
            'COUNT(*) as total_transactions',
        ])
            .getRawOne();
        return result;
    }
    async getCollectionsSummary(tenantId, startDate, endDate) {
        const result = await this.factBillingRepo
            .createQueryBuilder('billing')
            .leftJoin('billing.date', 'date')
            .where('billing.tenantId = :tenantId', { tenantId })
            .andWhere('billing.paymentStatus IN (:...statuses)', { statuses: ['PAID', 'PARTIAL'] })
            .andWhere('date.date BETWEEN :startDate AND :endDate', { startDate, endDate })
            .select([
            'SUM(billing.paidAmount) as total_collected',
            'COUNT(*) as paid_transactions',
            'SUM(CASE WHEN billing.paymentMethod = \'CASH\' THEN billing.paidAmount ELSE 0 END) as cash_collections',
            'SUM(CASE WHEN billing.paymentMethod = \'INSURANCE\' THEN billing.paidAmount ELSE 0 END) as insurance_collections',
        ])
            .getRawOne();
        return result;
    }
    async getPatientVisitsSummary(tenantId, startDate, endDate) {
        const result = await this.factVisitsRepo
            .createQueryBuilder('visit')
            .leftJoin('visit.date', 'date')
            .where('visit.tenantId = :tenantId', { tenantId })
            .andWhere('date.date BETWEEN :startDate AND :endDate', { startDate, endDate })
            .select([
            'COUNT(*) as total_visits',
            'SUM(visit.newPatients) as new_patients',
            'SUM(visit.followUpPatients) as follow_up_patients',
            'SUM(visit.emergencyCases) as emergency_cases',
            'AVG(visit.patientSatisfactionScore) as avg_satisfaction_score',
            'AVG(visit.averageWaitTime) as avg_wait_time',
        ])
            .getRawOne();
        return result;
    }
    async getLabTestsSummary(tenantId, startDate, endDate) {
        const result = await this.factLabsRepo
            .createQueryBuilder('lab')
            .leftJoin('lab.date', 'date')
            .where('lab.tenantId = :tenantId', { tenantId })
            .andWhere('date.date BETWEEN :startDate AND :endDate', { startDate, endDate })
            .select([
            'COUNT(*) as total_tests',
            'SUM(lab.completedTests) as completed_tests',
            'SUM(lab.pendingTests) as pending_tests',
            'AVG(lab.averageTAT) as avg_tat_hours',
            'AVG(lab.withinTATPercentage) as within_tat_percentage',
            'SUM(CASE WHEN lab.priority = \'STAT\' THEN 1 ELSE 0 END) as stat_tests',
        ])
            .getRawOne();
        return result;
    }
    async getOccupancySummary(tenantId, startDate, endDate) {
        return {
            avg_occupancy_rate: 78.5,
            total_beds: 200,
            avg_occupied_beds: 157,
            peak_occupancy: 92.0,
            low_occupancy: 65.0,
        };
    }
    async getTrendAnalysis(tenantId, metric, period, groupBy) {
        const trends = [];
        const endDate = new Date();
        const startDate = new Date();
        switch (period) {
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(startDate.getDate() - 90);
                break;
            case '1y':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
        }
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const value = Math.random() * 100 + 50;
            const groupValue = groupBy === 'department' ? ['Medicine', 'Surgery', 'Cardiology'][Math.floor(Math.random() * 3)] : null;
            trends.push({
                date: currentDate.toISOString().split('T')[0],
                value: Math.round(value * 100) / 100,
                metric,
                groupBy: groupValue,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return trends;
    }
    async getKPIDashboard(tenantId, category) {
        const kpis = {
            financial: [
                { name: 'Total Revenue', value: 1250000, change: 12.5, trend: 'up' },
                { name: 'Collections Rate', value: 85.2, change: 2.1, trend: 'up' },
                { name: 'Outstanding Amount', value: 450000, change: -8.3, trend: 'down' },
                { name: 'Avg Transaction Value', value: 1250, change: 5.7, trend: 'up' },
            ],
            clinical: [
                { name: 'Patient Satisfaction', value: 4.2, change: 0.3, trend: 'up' },
                { name: 'Avg Wait Time', value: 18, change: -2.5, trend: 'down' },
                { name: 'Readmission Rate', value: 3.2, change: -0.8, trend: 'down' },
                { name: 'Treatment Success Rate', value: 92.5, change: 1.2, trend: 'up' },
            ],
            operational: [
                { name: 'Bed Occupancy Rate', value: 78.5, change: 3.2, trend: 'up' },
                { name: 'Avg Length of Stay', value: 3.8, change: -0.4, trend: 'down' },
                { name: 'Resource Utilization', value: 82.1, change: 1.8, trend: 'up' },
                { name: 'Staff Productivity', value: 94.3, change: 2.1, trend: 'up' },
            ],
            patient: [
                { name: 'New Patient Acquisition', value: 245, change: 8.7, trend: 'up' },
                { name: 'Patient Retention Rate', value: 78.9, change: 1.2, trend: 'up' },
                { name: 'NPS Score', value: 75, change: 5.3, trend: 'up' },
                { name: 'Referral Conversion', value: 68.4, change: 3.1, trend: 'up' },
            ],
        };
        return category ? kpis[category] || [] : kpis;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(facts_entity_1.FactBilling)),
    __param(1, (0, typeorm_1.InjectRepository)(facts_entity_1.FactVisits)),
    __param(2, (0, typeorm_1.InjectRepository)(facts_entity_1.FactLabs)),
    __param(3, (0, typeorm_1.InjectRepository)(dimensions_entity_1.DimDate)),
    __param(4, (0, typeorm_1.InjectRepository)(dimensions_entity_1.DimFacility)),
    __param(5, (0, typeorm_1.InjectRepository)(dimensions_entity_1.DimProvider)),
    __param(6, (0, typeorm_1.InjectRepository)(dimensions_entity_1.DimService)),
    __param(7, (0, typeorm_1.InjectRepository)(dimensions_entity_1.DimPayer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map