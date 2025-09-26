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
exports.ImagingOrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ImagingOrdersService = class ImagingOrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto, userId) {
        const orderNumber = await this.generateOrderNumber();
        const patient = await this.prisma.patient.findUnique({
            where: { id: createDto.patientId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        if (createDto.modalityId) {
            const modality = await this.prisma.modality.findUnique({
                where: { id: createDto.modalityId },
            });
            if (!modality) {
                throw new common_1.NotFoundException('Modality not found');
            }
        }
        if (createDto.contrastAllergy && createDto.contrastType !== client_1.ContrastType.NONE) {
            await this.handleContrastAllergy(createDto.patientId, createDto.contrastType);
        }
        if (createDto.isPregnant) {
            await this.handlePregnancyProtocol(createDto.modalityType);
        }
        return this.prisma.imagingOrder.create({
            data: {
                orderNumber,
                patientId: createDto.patientId,
                visitId: createDto.visitId,
                modalityType: createDto.modalityType,
                modalityId: createDto.modalityId,
                protocol: createDto.protocol,
                bodyPart: createDto.bodyPart,
                clinicalHistory: createDto.clinicalHistory,
                priority: createDto.priority || client_1.ImagingPriority.ROUTINE,
                status: client_1.ImagingOrderStatus.DRAFTED,
                contrastType: createDto.contrastType || client_1.ContrastType.NONE,
                contrastAgent: createDto.contrastAgent,
                contrastVolume: createDto.contrastVolume,
                contrastAllergy: createDto.contrastAllergy || false,
                allergyDetails: createDto.allergyDetails,
                isPregnant: createDto.isPregnant || false,
                pregnancyDetails: createDto.pregnancyDetails,
                isInpatient: createDto.isInpatient || false,
                isolationRequired: createDto.isolationRequired || false,
                specialInstructions: createDto.specialInstructions,
                previousStudies: createDto.previousStudies,
                cumulativeDose: createDto.cumulativeDose,
                orderedBy: userId,
                tenantId: patient.tenantId,
            },
            include: {
                patient: true,
                modality: true,
                orderingUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }
    async findAll(filterDto, listDto) {
        const { page = 1, limit = 10, sortBy = 'orderedAt', sortOrder = false } = listDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (filterDto.status)
            where.status = filterDto.status;
        if (filterDto.modalityType)
            where.modalityType = filterDto.modalityType;
        if (filterDto.priority)
            where.priority = filterDto.priority;
        if (filterDto.patientId)
            where.patientId = filterDto.patientId;
        if (filterDto.contrastAllergy !== undefined)
            where.contrastAllergy = filterDto.contrastAllergy;
        if (filterDto.isPregnant !== undefined)
            where.isPregnant = filterDto.isPregnant;
        if (filterDto.dateFrom || filterDto.dateTo) {
            where.orderedAt = {};
            if (filterDto.dateFrom)
                where.orderedAt.gte = new Date(filterDto.dateFrom);
            if (filterDto.dateTo)
                where.orderedAt.lte = new Date(filterDto.dateTo);
        }
        const [data, total] = await Promise.all([
            this.prisma.imagingOrder.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder ? 'desc' : 'asc' },
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
                    modality: {
                        select: {
                            id: true,
                            name: true,
                            modalityType: true,
                            location: true,
                        },
                    },
                    orderingUser: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    scheduledUser: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            }),
            this.prisma.imagingOrder.count({ where }),
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
        const order = await this.prisma.imagingOrder.findUnique({
            where: { id },
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        dateOfBirth: true,
                        gender: true,
                        phone: true,
                        email: true,
                    },
                },
                visit: {
                    select: {
                        id: true,
                        visitNumber: true,
                        visitType: true,
                        visitDate: true,
                    },
                },
                modality: {
                    select: {
                        id: true,
                        name: true,
                        modalityType: true,
                        location: true,
                        aeTitle: true,
                        hostname: true,
                    },
                },
                orderingUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                scheduledUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                studies: {
                    select: {
                        id: true,
                        studyInstanceUID: true,
                        studyDate: true,
                        modalityType: true,
                        status: true,
                    },
                },
                reports: {
                    select: {
                        id: true,
                        reportNumber: true,
                        status: true,
                        signedAt: true,
                        signingUser: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
                doseRecords: {
                    select: {
                        id: true,
                        modalityType: true,
                        effectiveDose: true,
                        recordedAt: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Imaging order not found');
        }
        return order;
    }
    async update(id, updateDto) {
        const existingOrder = await this.findOne(id);
        if (updateDto.contrastType && updateDto.contrastType !== client_1.ContrastType.NONE) {
            if (updateDto.contrastAllergy) {
                await this.handleContrastAllergy(existingOrder.patientId, updateDto.contrastType);
            }
        }
        if (updateDto.isPregnant) {
            await this.handlePregnancyProtocol(existingOrder.modalityType);
        }
        return this.prisma.imagingOrder.update({
            where: { id },
            data: {
                ...updateDto,
                scheduledFor: updateDto.scheduledFor ? new Date(updateDto.scheduledFor) : undefined,
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                modality: {
                    select: {
                        id: true,
                        name: true,
                        modalityType: true,
                    },
                },
            },
        });
    }
    async schedule(id, scheduleDto) {
        const order = await this.findOne(id);
        if (order.status !== client_1.ImagingOrderStatus.DRAFTED && order.status !== client_1.ImagingOrderStatus.ORDERED) {
            throw new common_1.BadRequestException('Order cannot be scheduled in current status');
        }
        if (scheduleDto.modalityId) {
            const modality = await this.prisma.modality.findUnique({
                where: { id: scheduleDto.modalityId },
            });
            if (!modality) {
                throw new common_1.NotFoundException('Modality not found');
            }
        }
        return this.prisma.imagingOrder.update({
            where: { id },
            data: {
                scheduledFor: new Date(scheduleDto.scheduledFor),
                scheduledBy: scheduleDto.scheduledBy,
                modalityId: scheduleDto.modalityId,
                status: client_1.ImagingOrderStatus.SCHEDULED,
            },
            include: {
                patient: true,
                modality: true,
                scheduledUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }
    async cancel(id, reason) {
        const order = await this.findOne(id);
        if (order.status === client_1.ImagingOrderStatus.COMPLETED || order.status === client_1.ImagingOrderStatus.SIGNED) {
            throw new common_1.BadRequestException('Cannot cancel completed or signed order');
        }
        return this.prisma.imagingOrder.update({
            where: { id },
            data: {
                status: client_1.ImagingOrderStatus.CANCELLED,
                specialInstructions: `${order.specialInstructions || ''}\nCancelled: ${reason}`,
            },
        });
    }
    async complete(id) {
        const order = await this.findOne(id);
        if (order.status !== client_1.ImagingOrderStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException('Order must be in progress to complete');
        }
        return this.prisma.imagingOrder.update({
            where: { id },
            data: {
                status: client_1.ImagingOrderStatus.COMPLETED,
                completedAt: new Date(),
            },
        });
    }
    async generateOrderNumber() {
        const currentYear = new Date().getFullYear();
        const count = await this.prisma.imagingOrder.count({
            where: {
                orderedAt: {
                    gte: new Date(currentYear, 0, 1),
                    lt: new Date(currentYear + 1, 0, 1),
                },
            },
        });
        return `IMG-${currentYear}-${(count + 1).toString().padStart(4, '0')}`;
    }
    async handleContrastAllergy(patientId, contrastType) {
        const allergy = await this.prisma.contrastAllergy.findFirst({
            where: {
                patientId,
                contrastType,
                requiresAlert: true,
            },
        });
        if (allergy) {
            await this.prisma.notification.create({
                data: {
                    type: 'ALERT',
                    title: 'Contrast Allergy Alert',
                    message: `Patient has known ${contrastType} contrast allergy. Review protocol.`,
                    userId: patientId,
                    metadata: {
                        patientId,
                        allergyId: allergy.id,
                        contrastType,
                    },
                },
            });
        }
    }
    async handlePregnancyProtocol(modalityType) {
        const ionizingModalities = [client_1.ModalityType.XR, client_1.ModalityType.CT, client_1.ModalityType.FL, client_1.ModalityType.ANGIO];
        if (ionizingModalities.includes(modalityType)) {
        }
    }
    async getPatientHistory(patientId) {
        return this.prisma.imagingOrder.findMany({
            where: { patientId },
            orderBy: { orderedAt: 'desc' },
            include: {
                modality: {
                    select: {
                        id: true,
                        name: true,
                        modalityType: true,
                    },
                },
                reports: {
                    select: {
                        id: true,
                        reportNumber: true,
                        impression: true,
                        signedAt: true,
                    },
                },
            },
        });
    }
    async getStats(tenantId) {
        const total = await this.prisma.imagingOrder.count({ where: { tenantId } });
        const byStatus = await this.prisma.imagingOrder.groupBy({
            by: ['status'],
            where: { tenantId },
            _count: { id: true },
        });
        const byModality = await this.prisma.imagingOrder.groupBy({
            by: ['modalityType'],
            where: { tenantId },
            _count: { id: true },
        });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = await this.prisma.imagingOrder.count({
            where: {
                tenantId,
                orderedAt: { gte: today },
            },
        });
        return {
            total,
            today: todayCount,
            byStatus: Object.fromEntries(byStatus.map(s => [s.status, s._count.id])),
            byModality: Object.fromEntries(byModality.map(m => [m.modalityType, m._count.id])),
        };
    }
};
exports.ImagingOrdersService = ImagingOrdersService;
exports.ImagingOrdersService = ImagingOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImagingOrdersService);
//# sourceMappingURL=imaging-orders.service.js.map