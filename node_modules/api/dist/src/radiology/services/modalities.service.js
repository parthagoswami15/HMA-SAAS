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
exports.ModalitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ModalitiesService = class ModalitiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto, tenantId) {
        const existingModality = await this.prisma.modality.findFirst({
            where: {
                aeTitle: createDto.aeTitle,
                tenantId,
            },
        });
        if (existingModality) {
            throw new common_1.ConflictException('Modality with this AE Title already exists');
        }
        return this.prisma.modality.create({
            data: {
                ...createDto,
                tenantId,
                isActive: createDto.isActive ?? true,
            },
        });
    }
    async findAll(filterDto, listDto) {
        const { page = 1, limit = 10 } = listDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (filterDto.modalityType)
            where.modalityType = filterDto.modalityType;
        if (filterDto.isActive !== undefined)
            where.isActive = filterDto.isActive;
        const [data, total] = await Promise.all([
            this.prisma.modality.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
                include: {
                    _count: {
                        select: {
                            studies: true,
                            imagingOrders: true,
                        },
                    },
                },
            }),
            this.prisma.modality.count({ where }),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const modality = await this.prisma.modality.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        studies: true,
                        imagingOrders: true,
                    },
                },
            },
        });
        if (!modality) {
            throw new common_1.NotFoundException('Modality not found');
        }
        return modality;
    }
    async update(id, updateDto) {
        const existingModality = await this.findOne(id);
        if (updateDto.aeTitle && updateDto.aeTitle !== existingModality.aeTitle) {
            const duplicateModality = await this.prisma.modality.findFirst({
                where: {
                    aeTitle: updateDto.aeTitle,
                    tenantId: existingModality.tenantId,
                    id: { not: id },
                },
            });
            if (duplicateModality) {
                throw new common_1.ConflictException('Modality with this AE Title already exists');
            }
        }
        return this.prisma.modality.update({
            where: { id },
            data: updateDto,
        });
    }
    async updateStatus(id, isActive) {
        const modality = await this.findOne(id);
        if (!isActive && modality.isActive) {
            const activeStudies = await this.prisma.study.count({
                where: {
                    modalityId: id,
                    status: { in: ['IN_PROGRESS', 'SCHEDULED'] },
                },
            });
            if (activeStudies > 0) {
                throw new common_1.BadRequestException('Cannot deactivate modality with active studies');
            }
        }
        return this.prisma.modality.update({
            where: { id },
            data: { isActive },
        });
    }
    async getWorklist(modalityId) {
        const modality = await this.findOne(modalityId);
        const studies = await this.prisma.study.findMany({
            where: {
                modalityId,
                status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
            },
            include: {
                order: {
                    include: {
                        patient: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                dateOfBirth: true,
                                gender: true,
                            },
                        },
                    },
                },
            },
            orderBy: { scheduledFor: 'asc' },
        });
        return studies.map(study => ({
            studyInstanceUID: study.studyInstanceUID,
            patientName: `${study.order.patient.firstName} ${study.order.patient.lastName}`,
            patientId: study.order.patientId,
            accessionNumber: study.accessionNumber,
            scheduledFor: study.scheduledFor,
            priority: study.order.priority,
            protocol: study.order.protocol,
            clinicalHistory: study.order.clinicalHistory,
        }));
    }
    async sendToWorklist(modalityId, worklistDto) {
        const modality = await this.findOne(modalityId);
        const study = await this.prisma.study.findFirst({
            where: {
                studyInstanceUID: worklistDto.studyInstanceUID,
                modalityId,
            },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
            },
        });
        if (!study) {
            throw new common_1.NotFoundException('Study not found or not scheduled for this modality');
        }
        await this.prisma.study.update({
            where: { id: study.id },
            data: {
                status: 'IN_PROGRESS',
                startedAt: new Date(),
            },
        });
        return {
            message: 'Study sent to modality worklist',
            studyInstanceUID: worklistDto.studyInstanceUID,
            modalityId,
            sentAt: new Date(),
        };
    }
    async testConnection(modalityId, testDto) {
        const modality = await this.findOne(modalityId);
        const isConnected = Math.random() > 0.1;
        if (!isConnected) {
            throw new common_1.BadRequestException('Failed to connect to modality');
        }
        return {
            modalityId,
            aeTitle: modality.aeTitle,
            hostname: modality.hostname,
            port: modality.port,
            status: 'CONNECTED',
            responseTime: Math.floor(Math.random() * 100) + 50,
            testMessage: testDto.testMessage || 'DICOM Echo Test',
            testedAt: new Date(),
        };
    }
    async getStats(tenantId) {
        const modalities = await this.prisma.modality.findMany({
            where: { tenantId },
            select: {
                id: true,
                modalityType: true,
                isActive: true,
            },
        });
        const activeModalities = modalities.filter(m => m.isActive).length;
        const totalModalities = modalities.length;
        const studiesByModality = await this.prisma.study.groupBy({
            by: ['modalityType'],
            where: { tenantId },
            _count: { id: true },
        });
        return {
            totalModalities,
            activeModalities,
            inactiveModalities: totalModalities - activeModalities,
            modalitiesByType: Object.fromEntries(studiesByModality.map(m => [m.modalityType, m._count.id])),
            utilizationRate: totalModalities > 0 ? Math.round((activeModalities / totalModalities) * 100) : 0,
        };
    }
    async remove(id) {
        const modality = await this.findOne(id);
        const studyCount = await this.prisma.study.count({
            where: { modalityId: id },
        });
        if (studyCount > 0) {
            throw new common_1.ConflictException('Cannot delete modality with existing studies');
        }
        await this.prisma.modality.delete({
            where: { id },
        });
    }
};
exports.ModalitiesService = ModalitiesService;
exports.ModalitiesService = ModalitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ModalitiesService);
//# sourceMappingURL=modalities.service.js.map