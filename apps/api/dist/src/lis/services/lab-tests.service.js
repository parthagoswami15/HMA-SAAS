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
exports.LabTestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const lab_test_dto_1 = require("../dto/lab-test.dto");
let LabTestsService = class LabTestsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTest(createTestDto) {
        try {
            const test = await this.prisma.labTest.create({
                data: {
                    ...createTestDto,
                    status: lab_test_dto_1.TestStatus.ACTIVE,
                    isActive: createTestDto.isActive ?? true,
                },
                include: {
                    referenceRanges: true,
                },
            });
            return this.mapToResponseDto(test);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create lab test');
        }
    }
    async getAllTests(category, active) {
        const tests = await this.prisma.labTest.findMany({
            where: {
                ...(category && { category }),
                ...(active !== undefined && { isActive: active }),
            },
            include: {
                referenceRanges: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return tests.map(test => this.mapToResponseDto(test));
    }
    async getTestById(id) {
        const test = await this.prisma.labTest.findUnique({
            where: { id },
            include: {
                referenceRanges: true,
            },
        });
        if (!test) {
            throw new common_1.NotFoundException('Lab test not found');
        }
        return this.mapToResponseDto(test);
    }
    async updateTest(id, updateTestDto) {
        try {
            const test = await this.prisma.labTest.update({
                where: { id },
                data: updateTestDto,
                include: {
                    referenceRanges: true,
                },
            });
            return this.mapToResponseDto(test);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to update lab test');
        }
    }
    async deleteTest(id) {
        try {
            await this.prisma.labTest.update({
                where: { id },
                data: { status: lab_test_dto_1.TestStatus.INACTIVE },
            });
            return { message: 'Lab test deactivated successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to delete lab test');
        }
    }
    async getTestsByPanel(panelId) {
        const tests = await this.prisma.labTest.findMany({
            where: {
                panelId,
                isActive: true,
            },
            include: {
                referenceRanges: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return tests.map(test => this.mapToResponseDto(test));
    }
    mapToResponseDto(test) {
        return {
            id: test.id,
            name: test.name,
            code: test.code,
            description: test.description,
            category: test.category,
            department: test.department,
            section: test.section,
            price: test.price,
            tatHours: test.tatHours,
            isActive: test.isActive,
            requiresValidation: test.requiresValidation,
            method: test.method,
            unit: test.unit,
            sampleTypes: test.sampleTypes,
            containerTypes: test.containerTypes,
            referenceRanges: test.referenceRanges,
            analyzerSettings: test.analyzerSettings,
            qcSettings: test.qcSettings,
            createdAt: test.createdAt,
            updatedAt: test.updatedAt,
        };
    }
};
exports.LabTestsService = LabTestsService;
exports.LabTestsService = LabTestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabTestsService);
//# sourceMappingURL=lab-tests.service.js.map