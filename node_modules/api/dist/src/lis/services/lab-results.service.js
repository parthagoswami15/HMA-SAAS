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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabResultsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const lab_result_dto_1 = require("../dto/lab-result.dto");
const lab_validation_service_1 = require("./lab-validation.service");
let LabResultsService = class LabResultsService {
    prisma;
    validationService;
    constructor(prisma, validationService) {
        this.prisma = prisma;
        this.validationService = validationService;
    }
    async createResult(createResultDto) {
        try {
            const result = await this.prisma.labResult.create({
                data: {
                    ...createResultDto,
                    flag: createResultDto.flag || lab_result_dto_1.ResultFlag.PENDING,
                    validationStatus: createResultDto.validationStatus || lab_result_dto_1.ValidationStatus.PENDING,
                },
                include: {
                    order: true,
                    test: true,
                },
            });
            return this.mapToResponseDto(result);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create lab result');
        }
    }
    async getAllResults(filters) {
        const results = await this.prisma.labResult.findMany({
            where: {
                ...(filters?.orderId && { orderId: filters.orderId }),
                ...(filters?.testId && { testId: filters.testId }),
                ...(filters?.validationStatus && { validationStatus: filters.validationStatus }),
                ...(filters?.flag && { flag: filters.flag }),
                ...(filters?.dateFrom && filters?.dateTo && {
                    resultDateTime: {
                        gte: filters.dateFrom,
                        lte: filters.dateTo,
                    },
                }),
            },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
                test: true,
            },
            orderBy: {
                resultDateTime: 'desc',
            },
        });
        return results.map(result => this.mapToResponseDto(result));
    }
    async getResultById(id) {
        const result = await this.prisma.labResult.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
                test: true,
            },
        });
        if (!result) {
            throw new common_1.NotFoundException('Lab result not found');
        }
        return this.mapToResponseDto(result);
    }
    async updateResult(id, updateResultDto) {
        try {
            const result = await this.prisma.labResult.update({
                where: { id },
                data: updateResultDto,
                include: {
                    order: {
                        include: {
                            patient: true,
                        },
                    },
                    test: true,
                },
            });
            return this.mapToResponseDto(result);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to update lab result');
        }
    }
    async deleteResult(id) {
        try {
            await this.prisma.labResult.delete({
                where: { id },
            });
            return { message: 'Lab result deleted successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to delete lab result');
        }
    }
    async getResultsByOrder(orderId) {
        const results = await this.prisma.labResult.findMany({
            where: { orderId },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
                test: true,
            },
            orderBy: {
                resultDateTime: 'desc',
            },
        });
        return results.map(result => this.mapToResponseDto(result));
    }
    async getResultsByTest(testId, dateFrom, dateTo) {
        const results = await this.prisma.labResult.findMany({
            where: {
                testId,
                ...(dateFrom && dateTo && {
                    resultDateTime: {
                        gte: dateFrom,
                        lte: dateTo,
                    },
                }),
            },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
                test: true,
            },
            orderBy: {
                resultDateTime: 'desc',
            },
        });
        return results.map(result => this.mapToResponseDto(result));
    }
    async validateResult(id, validatedBy) {
        const validationResult = await this.validationService.validateResult(id, validatedBy);
        return this.getResultById(id);
    }
    async reviewResult(id, reviewedBy) {
        const result = await this.prisma.labResult.update({
            where: { id },
            data: {
                validationStatus: lab_result_dto_1.ValidationStatus.PATH_REVIEWED,
                reviewedBy,
                reviewedAt: new Date(),
            },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
                test: true,
            },
        });
        return this.mapToResponseDto(result);
    }
    async finalizeResult(id, finalizedBy) {
        const result = await this.prisma.labResult.update({
            where: { id },
            data: {
                validationStatus: lab_result_dto_1.ValidationStatus.FINAL,
                validatedBy: finalizedBy,
                validatedAt: new Date(),
            },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
                test: true,
            },
        });
        return this.mapToResponseDto(result);
    }
    async getCriticalResults() {
        const results = await this.prisma.labResult.findMany({
            where: {
                flag: {
                    in: [lab_result_dto_1.ResultFlag.CRITICAL, lab_result_dto_1.ResultFlag.ABNORMAL],
                },
            },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
                test: true,
            },
            orderBy: {
                resultDateTime: 'desc',
            },
        });
        return results.map(result => this.mapToResponseDto(result));
    }
    mapToResponseDto(result) {
        return {
            id: result.id,
            orderId: result.orderId,
            testId: result.testId,
            analyte: result.analyte,
            value: result.value,
            textValue: result.textValue,
            unit: result.unit,
            flag: result.flag,
            referenceLow: result.referenceLow,
            referenceHigh: result.referenceHigh,
            instrument: result.instrument,
            resultDateTime: result.resultDateTime,
            notes: result.notes,
            method: result.method,
            validationStatus: result.validationStatus,
            validatedBy: result.validatedBy,
            validatedAt: result.validatedAt,
            reviewedBy: result.reviewedBy,
            reviewedAt: result.reviewedAt,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        };
    }
};
exports.LabResultsService = LabResultsService;
exports.LabResultsService = LabResultsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, typeof (_a = typeof lab_validation_service_1.LabValidationService !== "undefined" && lab_validation_service_1.LabValidationService) === "function" ? _a : Object])
], LabResultsService);
//# sourceMappingURL=lab-results.service.js.map