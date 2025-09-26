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
exports.ModalityWorklistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ModalityWorklistService = class ModalityWorklistService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWorklist(modalityId) {
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
                                patientId: true,
                            },
                        },
                    },
                },
            },
            orderBy: { scheduledFor: 'asc' },
        });
        return studies.map(study => ({
            studyInstanceUID: study.studyInstanceUID,
            accessionNumber: study.accessionNumber,
            patientName: `${study.order.patient.firstName} ${study.order.patient.lastName}`,
            patientId: study.order.patient.patientId,
            patientBirthDate: study.order.patient.dateOfBirth,
            patientSex: study.order.patient.gender,
            scheduledFor: study.scheduledFor,
            priority: study.order.priority,
            protocol: study.order.protocol,
            clinicalHistory: study.order.clinicalHistory,
            bodyPart: study.order.bodyPart,
            contrastType: study.order.contrastType,
            contrastAllergy: study.order.contrastAllergy,
            isPregnant: study.order.isPregnant,
            specialInstructions: study.order.specialInstructions,
        }));
    }
    async sendToWorklist(modalityId, worklistDto) {
        const study = await this.prisma.study.findFirst({
            where: {
                studyInstanceUID: worklistDto.studyInstanceUID,
                modalityId,
            },
        });
        if (!study) {
            throw new common_1.NotFoundException('Study not found or not assigned to this modality');
        }
        await this.prisma.study.update({
            where: { id: study.id },
            data: {
                status: 'IN_PROGRESS',
                startedAt: new Date(),
            },
        });
        const worklistEntry = await this.prisma.modalityWorklist.create({
            data: {
                modalityId,
                studyId: study.id,
                patientName: worklistDto.patientName,
                patientId: worklistDto.patientId,
                accessionNumber: worklistDto.accessionNumber,
                studyInstanceUID: worklistDto.studyInstanceUID,
                worklistData: worklistDto.worklistData,
                sentAt: new Date(),
                status: 'SENT',
            },
        });
        return {
            worklistEntry,
            message: 'Study sent to modality worklist',
        };
    }
    async updateWorklistStatus(worklistEntryId, status) {
        const worklistEntry = await this.prisma.modalityWorklist.findUnique({
            where: { id: worklistEntryId },
        });
        if (!worklistEntry) {
            throw new common_1.NotFoundException('Worklist entry not found');
        }
        return this.prisma.modalityWorklist.update({
            where: { id: worklistEntryId },
            data: {
                status,
                updatedAt: new Date(),
            },
        });
    }
    async getWorklistByModality(modalityId, date) {
        const where = { modalityId };
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            where.scheduledFor = {
                gte: startOfDay,
                lte: endOfDay,
            };
        }
        const worklistEntries = await this.prisma.modalityWorklist.findMany({
            where,
            include: {
                study: {
                    include: {
                        order: {
                            include: {
                                patient: true,
                            },
                        },
                    },
                },
                modality: true,
            },
            orderBy: { sentAt: 'desc' },
        });
        return worklistEntries.map(entry => ({
            id: entry.id,
            modalityId: entry.modalityId,
            studyInstanceUID: entry.studyInstanceUID,
            patientName: entry.patientName,
            patientId: entry.patientId,
            accessionNumber: entry.accessionNumber,
            status: entry.status,
            sentAt: entry.sentAt,
            study: entry.study,
            modality: entry.modality,
        }));
    }
    async getPendingWorklistItems(tenantId) {
        const pendingEntries = await this.prisma.modalityWorklist.findMany({
            where: {
                status: { in: ['SENT', 'PENDING'] },
                modality: {
                    tenantId,
                    isActive: true,
                },
            },
            include: {
                study: {
                    include: {
                        order: {
                            include: {
                                patient: true,
                            },
                        },
                    },
                },
                modality: true,
            },
            orderBy: { sentAt: 'asc' },
        });
        return pendingEntries.map(entry => ({
            id: entry.id,
            modalityId: entry.modalityId,
            modalityName: entry.modality.name,
            modalityType: entry.modality.modalityType,
            studyInstanceUID: entry.studyInstanceUID,
            patientName: entry.patientName,
            patientId: entry.patientId,
            accessionNumber: entry.accessionNumber,
            status: entry.status,
            sentAt: entry.sentAt,
            scheduledFor: entry.study?.scheduledFor,
            priority: entry.study?.order?.priority,
        }));
    }
    async cleanupOldWorklistEntries(daysOld = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        const oldEntries = await this.prisma.modalityWorklist.findMany({
            where: {
                sentAt: { lt: cutoffDate },
                status: { in: ['COMPLETED', 'CANCELLED'] },
            },
        });
        const deletedCount = await this.prisma.modalityWorklist.deleteMany({
            where: {
                sentAt: { lt: cutoffDate },
                status: { in: ['COMPLETED', 'CANCELLED'] },
            },
        });
        return {
            deletedCount: deletedCount.count,
            deletedEntries: oldEntries.map(entry => entry.id),
        };
    }
};
exports.ModalityWorklistService = ModalityWorklistService;
exports.ModalityWorklistService = ModalityWorklistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ModalityWorklistService);
//# sourceMappingURL=modality-worklist.service.js.map