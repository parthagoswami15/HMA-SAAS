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
exports.RadReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let RadReportsService = class RadReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto, userId) {
        const study = await this.prisma.study.findUnique({
            where: { id: createDto.studyId },
        });
        if (!study) {
            throw new common_1.NotFoundException('Study not found');
        }
        if (createDto.orderId) {
            const order = await this.prisma.imagingOrder.findUnique({
                where: { id: createDto.orderId },
            });
            if (!order) {
                throw new common_1.NotFoundException('Imaging order not found');
            }
        }
        const reportNumber = await this.generateReportNumber();
        if (createDto.dictatedBy) {
            const user = await this.prisma.user.findUnique({
                where: { id: createDto.dictatedBy },
            });
            if (!user) {
                throw new common_1.NotFoundException('Dictating user not found');
            }
        }
        if (createDto.primaryReadBy) {
            const user = await this.prisma.user.findUnique({
                where: { id: createDto.primaryReadBy },
            });
            if (!user) {
                throw new common_1.NotFoundException('Primary reader not found');
            }
        }
        if (createDto.secondReadBy) {
            const user = await this.prisma.user.findUnique({
                where: { id: createDto.secondReadBy },
            });
            if (!user) {
                throw new common_1.NotFoundException('Second reader not found');
            }
        }
        let turnaroundTime;
        if (study.completedAt) {
            turnaroundTime = Math.round((Date.now() - study.completedAt.getTime()) / (1000 * 60));
        }
        return this.prisma.radReport.create({
            data: {
                reportNumber,
                studyId: createDto.studyId,
                orderId: createDto.orderId,
                reportType: createDto.reportType || 'Final',
                status: client_1.ReportStatus.DRAFT,
                clinicalHistory: createDto.clinicalHistory,
                comparison: createDto.comparison,
                technique: createDto.technique,
                findingsText: createDto.findingsText,
                impression: createDto.impression,
                recommendations: createDto.recommendations,
                conclusion: createDto.conclusion,
                findings: createDto.findings,
                biRadsScore: createDto.biRadsScore,
                lungRadsScore: createDto.lungRadsScore,
                otherScores: createDto.otherScores,
                dictatedBy: createDto.dictatedBy,
                primaryReadBy: createDto.primaryReadBy,
                secondReadBy: createDto.secondReadBy,
                signedBy: createDto.signedBy,
                sharedWithPatient: createDto.sharedWithPatient || false,
                sharedWithDoctor: createDto.sharedWithDoctor || false,
                requiresSecondRead: createDto.requiresSecondRead || false,
                peerReviewRequired: createDto.peerReviewRequired || false,
                turnaroundTime,
                isStat: study.order?.priority === 'STAT',
                tenantId: study.tenantId,
            },
            include: {
                study: {
                    select: {
                        id: true,
                        studyInstanceUID: true,
                        studyDate: true,
                        modalityType: true,
                    },
                },
                dictatingUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                primaryReader: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                secondReader: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                signingUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }
    async findAll(filterDto, listDto) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = false } = listDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (filterDto.status)
            where.status = filterDto.status;
        if (filterDto.biRadsScore)
            where.biRadsScore = filterDto.biRadsScore;
        if (filterDto.lungRadsScore)
            where.lungRadsScore = filterDto.lungRadsScore;
        if (filterDto.studyId)
            where.studyId = filterDto.studyId;
        if (filterDto.dictatedBy)
            where.dictatedBy = filterDto.dictatedBy;
        if (filterDto.primaryReadBy)
            where.primaryReadBy = filterDto.primaryReadBy;
        if (filterDto.signedBy)
            where.signedBy = filterDto.signedBy;
        if (filterDto.requiresSecondRead !== undefined)
            where.requiresSecondRead = filterDto.requiresSecondRead;
        if (filterDto.peerReviewRequired !== undefined)
            where.peerReviewRequired = filterDto.peerReviewRequired;
        if (filterDto.dateFrom || filterDto.dateTo) {
            where.createdAt = {};
            if (filterDto.dateFrom)
                where.createdAt.gte = new Date(filterDto.dateFrom);
            if (filterDto.dateTo)
                where.createdAt.lte = new Date(filterDto.dateTo);
        }
        const [data, total] = await Promise.all([
            this.prisma.radReport.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder ? 'desc' : 'asc' },
                include: {
                    study: {
                        select: {
                            id: true,
                            studyInstanceUID: true,
                            studyDate: true,
                            modalityType: true,
                            order: {
                                select: {
                                    id: true,
                                    orderNumber: true,
                                    patientId: true,
                                    modalityType: true,
                                    protocol: true,
                                },
                            },
                        },
                    },
                    dictatingUser: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    primaryReader: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    secondReader: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    signingUser: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            }),
            this.prisma.radReport.count({ where }),
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
        const report = await this.prisma.radReport.findUnique({
            where: { id },
            include: {
                study: {
                    select: {
                        id: true,
                        studyInstanceUID: true,
                        studyDate: true,
                        modalityType: true,
                        order: {
                            select: {
                                id: true,
                                orderNumber: true,
                                patientId: true,
                                modalityType: true,
                                protocol: true,
                                clinicalHistory: true,
                                contrastType: true,
                            },
                        },
                    },
                },
                dictatingUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                primaryReader: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                secondReader: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                signingUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        if (!report) {
            throw new common_1.NotFoundException('Radiology report not found');
        }
        return report;
    }
    async update(id, updateDto) {
        const existingReport = await this.findOne(id);
        if (updateDto.dictatedBy) {
            const user = await this.prisma.user.findUnique({
                where: { id: updateDto.dictatedBy },
            });
            if (!user) {
                throw new common_1.NotFoundException('Dictating user not found');
            }
        }
        if (updateDto.primaryReadBy) {
            const user = await this.prisma.user.findUnique({
                where: { id: updateDto.primaryReadBy },
            });
            if (!user) {
                throw new common_1.NotFoundException('Primary reader not found');
            }
        }
        if (updateDto.secondReadBy) {
            const user = await this.prisma.user.findUnique({
                where: { id: updateDto.secondReadBy },
            });
            if (!user) {
                throw new common_1.NotFoundException('Second reader not found');
            }
        }
        if (updateDto.signedBy) {
            const user = await this.prisma.user.findUnique({
                where: { id: updateDto.signedBy },
            });
            if (!user) {
                throw new common_1.NotFoundException('Signing user not found');
            }
        }
        if (updateDto.peerReviewedBy) {
            const user = await this.prisma.user.findUnique({
                where: { id: updateDto.peerReviewedBy },
            });
            if (!user) {
                throw new common_1.NotFoundException('Peer reviewer not found');
            }
        }
        return this.prisma.radReport.update({
            where: { id },
            data: {
                ...updateDto,
                peerReviewedAt: updateDto.peerReviewedBy ? new Date() : existingReport.peerReviewedAt,
            },
            include: {
                study: {
                    select: {
                        id: true,
                        studyInstanceUID: true,
                        studyDate: true,
                        modalityType: true,
                    },
                },
                signingUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }
    async signReport(id, signDto, userId) {
        const report = await this.findOne(id);
        if (report.status === client_1.ReportStatus.SIGNED) {
            throw new common_1.BadRequestException('Report is already signed');
        }
        const signingUser = await this.prisma.user.findUnique({
            where: { id: signDto.signedBy },
        });
        if (!signingUser) {
            throw new common_1.NotFoundException('Signing user not found');
        }
        const updatedReport = await this.prisma.radReport.update({
            where: { id },
            data: {
                signedBy: signDto.signedBy,
                signedAt: new Date(),
                status: client_1.ReportStatus.FINAL,
                impression: signDto.finalImpression || report.impression,
                recommendations: signDto.finalRecommendations || report.recommendations,
            },
            include: {
                study: {
                    select: {
                        id: true,
                        studyInstanceUID: true,
                        studyDate: true,
                        modalityType: true,
                        order: {
                            select: {
                                id: true,
                                orderNumber: true,
                                patientId: true,
                            },
                        },
                    },
                },
                signingUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        await this.prisma.study.update({
            where: { id: report.studyId },
            data: { reportedAt: new Date() },
        });
        if (report.sharedWithPatient || report.sharedWithDoctor) {
            await this.prisma.notification.create({
                data: {
                    type: 'INFO',
                    title: 'Radiology Report Available',
                    message: `Report ${report.reportNumber} is now available`,
                    userId: report.study.order?.patientId || userId,
                    metadata: {
                        reportId: report.id,
                        reportNumber: report.reportNumber,
                        studyId: report.studyId,
                    },
                },
            });
        }
        return updatedReport;
    }
    async getReportsByStudy(studyId) {
        return this.prisma.radReport.findMany({
            where: { studyId },
            orderBy: { createdAt: 'desc' },
            include: {
                dictatingUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                primaryReader: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                secondReader: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                signingUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }
    async getReportsByPatient(patientId) {
        const reports = await this.prisma.radReport.findMany({
            where: {
                study: {
                    order: {
                        patientId: patientId,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            include: {
                study: {
                    select: {
                        id: true,
                        studyInstanceUID: true,
                        studyDate: true,
                        modalityType: true,
                        order: {
                            select: {
                                id: true,
                                orderNumber: true,
                                modalityType: true,
                                protocol: true,
                            },
                        },
                    },
                },
                signingUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        return reports;
    }
    async getStats(tenantId) {
        const total = await this.prisma.radReport.count({ where: { tenantId } });
        const byStatus = await this.prisma.radReport.groupBy({
            by: ['status'],
            where: { tenantId },
            _count: { id: true },
        });
        const byBiRads = await this.prisma.radReport.groupBy({
            by: ['biRadsScore'],
            where: { tenantId, biRadsScore: { not: null } },
            _count: { id: true },
        });
        const byLungRads = await this.prisma.radReport.groupBy({
            by: ['lungRadsScore'],
            where: { tenantId, lungRadsScore: { not: null } },
            _count: { id: true },
        });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = await this.prisma.radReport.count({
            where: {
                tenantId,
                createdAt: { gte: today },
            },
        });
        return {
            total,
            today: todayCount,
            byStatus: Object.fromEntries(byStatus.map(s => [s.status, s._count.id])),
            byBiRads: Object.fromEntries(byBiRads.map(b => [b.biRadsScore, b._count.id])),
            byLungRads: Object.fromEntries(byLungRads.map(l => [l.lungRadsScore, l._count.id])),
        };
    }
    async generateReportNumber() {
        const currentYear = new Date().getFullYear();
        const count = await this.prisma.radReport.count({
            where: {
                createdAt: {
                    gte: new Date(currentYear, 0, 1),
                    lt: new Date(currentYear + 1, 0, 1),
                },
            },
        });
        return `RAD-${currentYear}-${(count + 1).toString().padStart(4, '0')}`;
    }
    async getStructuredReportData(reportId) {
        const report = await this.findOne(reportId);
        return {
            reportId: report.id,
            reportNumber: report.reportNumber,
            study: report.study,
            findings: report.findings,
            biRadsScore: report.biRadsScore,
            lungRadsScore: report.lungRadsScore,
            otherScores: report.otherScores,
            recommendations: report.recommendations,
            impression: report.impression,
        };
    }
    async updateStructuredFindings(id, findings) {
        const report = await this.findOne(id);
        return this.prisma.radReport.update({
            where: { id },
            data: { findings },
        });
    }
};
exports.RadReportsService = RadReportsService;
exports.RadReportsService = RadReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RadReportsService);
//# sourceMappingURL=rad-reports.service.js.map