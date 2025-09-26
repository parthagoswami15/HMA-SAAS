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
exports.LabQcService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LabQcService = class LabQcService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createQcRun(createQcRunDto) {
        try {
            const qcRun = await this.prisma.labQcRun.create({
                data: {
                    ...createQcRunDto,
                    isPassed: false,
                    westgardRules: [],
                },
                include: {
                    analyzer: true,
                },
            });
            return this.mapToResponseDto(qcRun);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create QC run');
        }
    }
    async getAllQcRuns(filters) {
        const qcRuns = await this.prisma.labQcRun.findMany({
            where: {
                ...(filters?.analyzerId && { analyzerId: filters.analyzerId }),
                ...(filters?.isPassed !== undefined && { isPassed: filters.isPassed }),
                ...(filters?.operator && { operator: { contains: filters.operator, mode: 'insensitive' } }),
                ...(filters?.dateFrom && filters?.dateTo && {
                    runDateTime: {
                        gte: filters.dateFrom,
                        lte: filters.dateTo,
                    },
                }),
            },
            include: {
                analyzer: true,
            },
            orderBy: {
                runDateTime: 'desc',
            },
        });
        return qcRuns.map(qcRun => this.mapToResponseDto(qcRun));
    }
    async getQcRunById(id) {
        const qcRun = await this.prisma.labQcRun.findUnique({
            where: { id },
            include: {
                analyzer: true,
            },
        });
        if (!qcRun) {
            throw new common_1.NotFoundException('QC run not found');
        }
        return this.mapToResponseDto(qcRun);
    }
    async updateQcRun(id, updateData) {
        try {
            const qcRun = await this.prisma.labQcRun.update({
                where: { id },
                data: updateData,
                include: {
                    analyzer: true,
                },
            });
            return this.mapToResponseDto(qcRun);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to update QC run');
        }
    }
    async deleteQcRun(id) {
        try {
            await this.prisma.labQcRun.delete({
                where: { id },
            });
            return { message: 'QC run deleted successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to delete QC run');
        }
    }
    async evaluateQcRun(id) {
        const qcRun = await this.prisma.labQcRun.findUnique({
            where: { id },
            include: {
                analyzer: true,
            },
        });
        if (!qcRun) {
            throw new common_1.NotFoundException('QC run not found');
        }
        const qcResults = qcRun.qcResults;
        const qcBatches = qcRun.qcBatches;
        const evaluation = this.evaluateQcResults(qcResults, qcBatches);
        const updatedQcRun = await this.prisma.labQcRun.update({
            where: { id },
            data: {
                isPassed: evaluation.passed,
                westgardRules: evaluation.westgardRules,
                qcResults: evaluation.processedResults,
            },
            include: {
                analyzer: true,
            },
        });
        return this.mapToResponseDto(updatedQcRun);
    }
    async getQcRunsByAnalyzer(analyzerId) {
        const qcRuns = await this.prisma.labQcRun.findMany({
            where: { analyzerId },
            include: {
                analyzer: true,
            },
            orderBy: {
                runDateTime: 'desc',
            },
        });
        return qcRuns.map(qcRun => this.mapToResponseDto(qcRun));
    }
    async getQcRunsByDateRange(dateFrom, dateTo) {
        const qcRuns = await this.prisma.labQcRun.findMany({
            where: {
                runDateTime: {
                    gte: dateFrom,
                    lte: dateTo,
                },
            },
            include: {
                analyzer: true,
            },
            orderBy: {
                runDateTime: 'desc',
            },
        });
        return qcRuns.map(qcRun => this.mapToResponseDto(qcRun));
    }
    async getFailedQcRuns() {
        const qcRuns = await this.prisma.labQcRun.findMany({
            where: { isPassed: false },
            include: {
                analyzer: true,
            },
            orderBy: {
                runDateTime: 'desc',
            },
        });
        return qcRuns.map(qcRun => this.mapToResponseDto(qcRun));
    }
    async getRecentQcRuns(days = 30) {
        const dateFrom = new Date();
        dateFrom.setDate(dateFrom.getDate() - days);
        const qcRuns = await this.prisma.labQcRun.findMany({
            where: {
                runDateTime: {
                    gte: dateFrom,
                },
            },
            include: {
                analyzer: true,
            },
            orderBy: {
                runDateTime: 'desc',
            },
        });
        return qcRuns.map(qcRun => this.mapToResponseDto(qcRun));
    }
    evaluateQcResults(qcResults, qcBatches) {
        const processedResults = [];
        const westgardRules = [];
        let passed = true;
        for (const result of qcResults) {
            const batch = qcBatches.find(b => b.analyte === result.analyte && b.lotNumber === result.lotNumber);
            if (!batch)
                continue;
            const deviation = result.measuredValue - (batch.targetValue || 0);
            const expectedDeviation = batch.targetSd || 0;
            const withinRange = Math.abs(deviation) <= (expectedDeviation * 3);
            processedResults.push({
                ...result,
                expectedValue: batch.targetValue,
                deviation,
                withinRange,
            });
            if (!withinRange) {
                passed = false;
                westgardRules.push('1_3S');
            }
        }
        return {
            passed,
            westgardRules,
            processedResults,
        };
    }
    mapToResponseDto(qcRun) {
        return {
            id: qcRun.id,
            analyzerId: qcRun.analyzerId,
            qcBatches: qcRun.qcBatches,
            qcResults: qcRun.qcResults,
            operator: qcRun.operator,
            runDateTime: qcRun.runDateTime,
            notes: qcRun.notes,
            isPassed: qcRun.isPassed,
            westgardRules: qcRun.westgardRules,
            createdAt: qcRun.createdAt,
            updatedAt: qcRun.updatedAt,
        };
    }
};
exports.LabQcService = LabQcService;
exports.LabQcService = LabQcService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabQcService);
//# sourceMappingURL=lab-qc.service.js.map