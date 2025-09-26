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
exports.PACSService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PACSService = class PACSService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async storeDicom(storeDto) {
        let study = await this.prisma.study.findUnique({
            where: { studyInstanceUID: storeDto.studyInstanceUID },
        });
        if (!study) {
            study = await this.prisma.study.create({
                data: {
                    studyInstanceUID: storeDto.studyInstanceUID,
                    studyDate: new Date(),
                    modalityType: 'OTHER',
                    status: 'IN_PROGRESS',
                    tenantId: 'default',
                },
            });
        }
        let series = await this.prisma.series.findUnique({
            where: { seriesInstanceUID: storeDto.seriesInstanceUID },
        });
        if (!series) {
            series = await this.prisma.series.create({
                data: {
                    seriesInstanceUID: storeDto.seriesInstanceUID,
                    studyId: study.id,
                    seriesNumber: 1,
                    modality: 'OT',
                    tenantId: study.tenantId,
                },
            });
        }
        let image = await this.prisma.image.findUnique({
            where: { sopInstanceUID: storeDto.sopInstanceUID },
        });
        if (!image) {
            image = await this.prisma.image.create({
                data: {
                    sopInstanceUID: storeDto.sopInstanceUID,
                    seriesId: series.id,
                    instanceNumber: 1,
                    imageType: ['ORIGINAL', 'PRIMARY'],
                    tenantId: study.tenantId,
                },
            });
        }
        await this.prisma.image.update({
            where: { id: image.id },
            data: {
                dicomMetadata: storeDto.metadata,
                fileSize: storeDto.dicomData.length,
            },
        });
        return { study, series, image };
    }
    async queryDicom(queryDto) {
        const where = {};
        switch (queryDto.queryLevel) {
            case 'PATIENT':
                if (queryDto.patientId)
                    where.patientId = queryDto.patientId;
                if (queryDto.patientName)
                    where.patientName = { contains: queryDto.patientName };
                break;
            case 'STUDY':
                if (queryDto.studyInstanceUID)
                    where.studyInstanceUID = queryDto.studyInstanceUID;
                if (queryDto.accessionNumber)
                    where.accessionNumber = queryDto.accessionNumber;
                if (queryDto.studyDate)
                    where.studyDate = { gte: new Date(queryDto.studyDate) };
                if (queryDto.modality)
                    where.modality = queryDto.modality;
                break;
            case 'SERIES':
                if (queryDto.seriesInstanceUID)
                    where.seriesInstanceUID = queryDto.seriesInstanceUID;
                break;
            case 'IMAGE':
                if (queryDto.sopInstanceUID)
                    where.sopInstanceUID = queryDto.sopInstanceUID;
                break;
        }
        where.tenantId = 'default';
        switch (queryDto.queryLevel) {
            case 'STUDY':
                return this.prisma.study.findMany({
                    where,
                    select: {
                        id: true,
                        studyInstanceUID: true,
                        accessionNumber: true,
                        studyDate: true,
                        studyDescription: true,
                        modalityType: true,
                        patientId: true,
                    },
                });
            case 'SERIES':
                return this.prisma.series.findMany({
                    where,
                    select: {
                        id: true,
                        seriesInstanceUID: true,
                        seriesNumber: true,
                        modality: true,
                        seriesDescription: true,
                        studyId: true,
                    },
                });
            case 'IMAGE':
                return this.prisma.image.findMany({
                    where,
                    select: {
                        id: true,
                        sopInstanceUID: true,
                        instanceNumber: true,
                        imageType: true,
                        seriesId: true,
                    },
                });
            default:
                return [];
        }
    }
    async retrieveDicom(retrieveDto) {
        if (retrieveDto.studyInstanceUID) {
            const study = await this.prisma.study.findUnique({
                where: { studyInstanceUID: retrieveDto.studyInstanceUID },
                include: {
                    series: {
                        include: {
                            images: true,
                        },
                    },
                },
            });
            if (!study) {
                throw new common_1.NotFoundException('Study not found');
            }
            return study;
        }
        if (retrieveDto.seriesInstanceUID) {
            const series = await this.prisma.series.findUnique({
                where: { seriesInstanceUID: retrieveDto.seriesInstanceUID },
                include: {
                    images: true,
                    study: true,
                },
            });
            if (!series) {
                throw new common_1.NotFoundException('Series not found');
            }
            return series;
        }
        if (retrieveDto.sopInstanceUID) {
            const image = await this.prisma.image.findUnique({
                where: { sopInstanceUID: retrieveDto.sopInstanceUID },
                include: {
                    series: {
                        include: {
                            study: true,
                        },
                    },
                },
            });
            if (!image) {
                throw new common_1.NotFoundException('Image not found');
            }
            return image;
        }
        throw new common_1.BadRequestException('Must provide studyInstanceUID, seriesInstanceUID, or sopInstanceUID');
    }
    async getStudyHierarchy(studyInstanceUID) {
        const study = await this.prisma.study.findUnique({
            where: { studyInstanceUID },
            include: {
                series: {
                    orderBy: { seriesNumber: 'asc' },
                    include: {
                        images: {
                            orderBy: { instanceNumber: 'asc' },
                            select: {
                                id: true,
                                sopInstanceUID: true,
                                instanceNumber: true,
                                imageType: true,
                                rows: true,
                                columns: true,
                                bitsAllocated: true,
                                photometricInterpretation: true,
                                fileSize: true,
                            },
                        },
                    },
                },
                reports: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: {
                        id: true,
                        reportNumber: true,
                        impression: true,
                        recommendations: true,
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
            },
        });
        if (!study) {
            throw new common_1.NotFoundException('Study not found');
        }
        return {
            study: {
                studyInstanceUID: study.studyInstanceUID,
                studyDate: study.studyDate,
                studyDescription: study.studyDescription,
                modalityType: study.modalityType,
                accessionNumber: study.accessionNumber,
                numberOfSeries: study.series.length,
                numberOfInstances: study.series.reduce((total, series) => total + series.images.length, 0),
            },
            series: study.series.map(series => ({
                seriesInstanceUID: series.seriesInstanceUID,
                seriesNumber: series.seriesNumber,
                modality: series.modality,
                seriesDescription: series.seriesDescription,
                numberOfImages: series.images.length,
                images: series.images,
            })),
            latestReport: study.reports[0] || null,
        };
    }
    async getPatientStudies(patientId) {
        const studies = await this.prisma.study.findMany({
            where: {
                order: {
                    patientId: patientId,
                },
            },
            orderBy: { studyDate: 'desc' },
            include: {
                series: {
                    select: {
                        id: true,
                        seriesInstanceUID: true,
                        seriesNumber: true,
                        modality: true,
                        seriesDescription: true,
                    },
                },
                reports: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: {
                        id: true,
                        reportNumber: true,
                        impression: true,
                        signedAt: true,
                    },
                },
            },
        });
        return studies.map(study => ({
            studyInstanceUID: study.studyInstanceUID,
            studyDate: study.studyDate,
            studyDescription: study.studyDescription,
            modalityType: study.modalityType,
            accessionNumber: study.accessionNumber,
            numberOfSeries: study.series.length,
            hasReport: study.reports.length > 0,
            latestReport: study.reports[0] || null,
        }));
    }
    async searchStudies(searchTerm) {
        const studies = await this.prisma.study.findMany({
            where: {
                OR: [
                    { studyInstanceUID: { contains: searchTerm } },
                    { accessionNumber: { contains: searchTerm } },
                    { studyDescription: { contains: searchTerm } },
                ],
            },
            include: {
                series: {
                    select: {
                        id: true,
                        seriesInstanceUID: true,
                        modality: true,
                    },
                },
            },
            take: 50,
        });
        return studies.map(study => ({
            studyInstanceUID: study.studyInstanceUID,
            studyDate: study.studyDate,
            studyDescription: study.studyDescription,
            modalityType: study.modalityType,
            accessionNumber: study.accessionNumber,
            numberOfSeries: study.series.length,
        }));
    }
    async getStorageStats(tenantId) {
        const studies = await this.prisma.study.count({ where: { tenantId } });
        const series = await this.prisma.series.count({ where: { tenantId } });
        const images = await this.prisma.image.count({ where: { tenantId } });
        const totalImages = await this.prisma.image.aggregate({
            where: { tenantId },
            _sum: { fileSize: true },
        });
        const storageSizeMB = Math.round((totalImages._sum.fileSize || 0) / (1024 * 1024));
        return {
            studies,
            series,
            images,
            storageSizeMB,
            averageImagesPerStudy: studies > 0 ? Math.round(images / studies) : 0,
        };
    }
    async cleanupOrphanedData() {
        const orphanedStudies = await this.prisma.study.findMany({
            where: {
                order: null,
            },
            select: {
                id: true,
                studyInstanceUID: true,
            },
        });
        const orphanedSeries = await this.prisma.series.findMany({
            where: {
                study: null,
            },
            select: {
                id: true,
                seriesInstanceUID: true,
            },
        });
        const orphanedImages = await this.prisma.image.findMany({
            where: {
                series: null,
            },
            select: {
                id: true,
                sopInstanceUID: true,
            },
        });
        return {
            orphanedStudies: orphanedStudies.length,
            orphanedSeries: orphanedSeries.length,
            orphanedImages: orphanedImages.length,
            studies: orphanedStudies,
            series: orphanedSeries,
            images: orphanedImages,
        };
    }
};
exports.PACSService = PACSService;
exports.PACSService = PACSService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PACSService);
//# sourceMappingURL=pacs.service.js.map