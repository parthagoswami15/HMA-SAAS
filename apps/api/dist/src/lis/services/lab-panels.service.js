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
exports.LabPanelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LabPanelsService = class LabPanelsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPanel(createPanelDto) {
        try {
            const panel = await this.prisma.labPanel.create({
                data: {
                    ...createPanelDto,
                    isActive: createPanelDto.isActive ?? true,
                },
                include: {
                    tests: {
                        include: {
                            test: true,
                        },
                    },
                },
            });
            return this.mapToResponseDto(panel);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create lab panel');
        }
    }
    async getAllPanels(filters) {
        const panels = await this.prisma.labPanel.findMany({
            where: {
                ...(filters?.category && { category: filters.category }),
                ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
                ...(filters?.search && {
                    OR: [
                        { name: { contains: filters.search, mode: 'insensitive' } },
                        { description: { contains: filters.search, mode: 'insensitive' } },
                    ],
                }),
            },
            include: {
                tests: {
                    include: {
                        test: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
        return panels.map(panel => this.mapToResponseDto(panel));
    }
    async getPanelById(id) {
        const panel = await this.prisma.labPanel.findUnique({
            where: { id },
            include: {
                tests: {
                    include: {
                        test: true,
                    },
                },
            },
        });
        if (!panel) {
            throw new common_1.NotFoundException('Lab panel not found');
        }
        return this.mapToResponseDto(panel);
    }
    async updatePanel(id, updatePanelDto) {
        try {
            const panel = await this.prisma.labPanel.update({
                where: { id },
                data: updatePanelDto,
                include: {
                    tests: {
                        include: {
                            test: true,
                        },
                    },
                },
            });
            return this.mapToResponseDto(panel);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to update lab panel');
        }
    }
    async deletePanel(id) {
        try {
            await this.prisma.labPanel.delete({
                where: { id },
            });
            return { message: 'Lab panel deleted successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to delete lab panel');
        }
    }
    async addTestToPanel(panelId, testId) {
        try {
            const panel = await this.prisma.labPanel.update({
                where: { id: panelId },
                data: {
                    tests: {
                        create: {
                            testId,
                        },
                    },
                },
                include: {
                    tests: {
                        include: {
                            test: true,
                        },
                    },
                },
            });
            return this.mapToResponseDto(panel);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to add test to panel');
        }
    }
    async removeTestFromPanel(panelId, testId) {
        try {
            const panel = await this.prisma.labPanel.update({
                where: { id: panelId },
                data: {
                    tests: {
                        delete: {
                            testId_panelId: {
                                testId,
                                panelId,
                            },
                        },
                    },
                },
                include: {
                    tests: {
                        include: {
                            test: true,
                        },
                    },
                },
            });
            return this.mapToResponseDto(panel);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to remove test from panel');
        }
    }
    async getPanelsByCategory(category) {
        const panels = await this.prisma.labPanel.findMany({
            where: { category },
            include: {
                tests: {
                    include: {
                        test: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
        return panels.map(panel => this.mapToResponseDto(panel));
    }
    async getActivePanels() {
        const panels = await this.prisma.labPanel.findMany({
            where: { isActive: true },
            include: {
                tests: {
                    include: {
                        test: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
        return panels.map(panel => this.mapToResponseDto(panel));
    }
    mapToResponseDto(panel) {
        return {
            id: panel.id,
            name: panel.name,
            description: panel.description,
            category: panel.category,
            isActive: panel.isActive,
            createdAt: panel.createdAt,
            updatedAt: panel.updatedAt,
            tests: panel.tests?.map((panelTest) => ({
                id: panelTest.test.id,
                code: panelTest.test.code,
                name: panelTest.test.name,
                category: panelTest.test.category,
                unit: panelTest.test.unit,
                referenceRanges: panelTest.test.referenceRanges,
            })) || [],
        };
    }
};
exports.LabPanelsService = LabPanelsService;
exports.LabPanelsService = LabPanelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabPanelsService);
//# sourceMappingURL=lab-panels.service.js.map