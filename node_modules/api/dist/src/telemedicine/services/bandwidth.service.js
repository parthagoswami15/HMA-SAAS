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
var BandwidthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BandwidthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let BandwidthService = BandwidthService_1 = class BandwidthService {
    prisma;
    auditService;
    logger = new common_1.Logger(BandwidthService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async testBandwidth(user) {
        this.logger.log(`Testing bandwidth for user ${user.id}`);
        const downloadSpeed = Math.random() * 50 + 5;
        const uploadSpeed = Math.random() * 20 + 2;
        const latency = Math.random() * 100 + 20;
        const connectionType = this.determineConnectionType(downloadSpeed);
        const testResult = {
            downloadSpeed,
            uploadSpeed,
            latency,
            connectionType,
            timestamp: new Date(),
            quality: this.determineQuality(downloadSpeed, latency),
        };
        await this.prisma.bandwidthTest.create({
            data: {
                userId: user.id,
                downloadSpeed,
                uploadSpeed,
                latency,
                connectionType,
                quality: testResult.quality,
                testedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'BANDWIDTH_TESTED',
            entityType: 'BANDWIDTH_TEST',
            userId: user.id,
            details: testResult,
        });
        return testResult;
    }
    async updateVideoQuality(consultationId, qualityDto, user) {
        this.logger.log(`Updating video quality for consultation ${consultationId}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: consultationId },
        });
        if (!consultation) {
            throw new Error('Consultation not found');
        }
        await this.prisma.telemedicineConsultation.update({
            where: { id: consultationId },
            data: {
                videoQuality: qualityDto.quality,
                maxBitrate: qualityDto.maxBitrate,
                maxFrameRate: qualityDto.maxFrameRate,
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        const videoRoom = await this.prisma.videoRoom.findUnique({
            where: { consultationId },
        });
        if (videoRoom && videoRoom.status === 'ACTIVE') {
            await this.prisma.videoRoom.update({
                where: { consultationId },
                data: {
                    quality: qualityDto.quality,
                    qualityUpdatedAt: new Date(),
                },
            });
        }
        await this.auditService.logActivity({
            action: 'VIDEO_QUALITY_UPDATED',
            entityType: 'TELEMEDICINE_CONSULTATION',
            entityId: consultationId,
            userId: user.id,
            details: qualityDto,
        });
        return { success: true, quality: qualityDto.quality };
    }
    async getQualitySettings(user) {
        const recentTests = await this.prisma.bandwidthTest.findMany({
            where: { userId: user.id },
            orderBy: { testedAt: 'desc' },
            take: 5,
        });
        const avgDownload = recentTests.reduce((sum, test) => sum + test.downloadSpeed, 0) / recentTests.length;
        const avgLatency = recentTests.reduce((sum, test) => sum + test.latency, 0) / recentTests.length;
        const recommendedQuality = this.determineQuality(avgDownload, avgLatency);
        const qualityPresets = this.getQualityPresets();
        return {
            recentTests,
            averageDownload: avgDownload,
            averageLatency: avgLatency,
            recommendedQuality,
            qualityPresets,
        };
    }
    async adaptToBandwidth(consultationId, bandwidthInfo) {
        this.logger.log(`Adapting to bandwidth for consultation ${consultationId}`);
        const quality = this.determineQuality(bandwidthInfo.downloadSpeed, bandwidthInfo.latency);
        await this.updateVideoQuality(consultationId, { quality }, { id: 'system' });
        await this.prisma.bandwidthAdaptation.create({
            data: {
                consultationId,
                originalQuality: 'HD',
                adaptedQuality: quality,
                downloadSpeed: bandwidthInfo.downloadSpeed,
                latency: bandwidthInfo.latency,
                adaptedAt: new Date(),
            },
        });
        return { adaptedQuality: quality };
    }
    async getBandwidthHistory(user) {
        const history = await this.prisma.bandwidthTest.findMany({
            where: { userId: user.id },
            orderBy: { testedAt: 'desc' },
            take: 50,
        });
        return history;
    }
    async getBandwidthAnalytics(user) {
        const tests = await this.prisma.bandwidthTest.findMany({
            where: { userId: user.id },
        });
        if (tests.length === 0) {
            return { message: 'No bandwidth tests found' };
        }
        const avgDownload = tests.reduce((sum, test) => sum + test.downloadSpeed, 0) / tests.length;
        const avgUpload = tests.reduce((sum, test) => sum + test.uploadSpeed, 0) / tests.length;
        const avgLatency = tests.reduce((sum, test) => sum + test.latency, 0) / tests.length;
        const qualityDistribution = tests.reduce((acc, test) => {
            acc[test.quality] = (acc[test.quality] || 0) + 1;
            return acc;
        }, {});
        const connectionTypes = tests.reduce((acc, test) => {
            acc[test.connectionType] = (acc[test.connectionType] || 0) + 1;
            return acc;
        }, {});
        return {
            totalTests: tests.length,
            averageDownload: avgDownload,
            averageUpload: avgUpload,
            averageLatency: avgLatency,
            qualityDistribution,
            connectionTypes,
            bestQuality: Math.max(...tests.map(t => this.qualityToNumber(t.quality))),
            worstQuality: Math.min(...tests.map(t => this.qualityToNumber(t.quality))),
        };
    }
    determineConnectionType(downloadSpeed) {
        if (downloadSpeed >= 25)
            return 'BROADBAND';
        if (downloadSpeed >= 10)
            return 'DSL';
        if (downloadSpeed >= 5)
            return 'CABLE';
        if (downloadSpeed >= 1)
            return 'WIRELESS';
        return 'SLOW';
    }
    determineQuality(downloadSpeed, latency) {
        if (downloadSpeed >= 25 && latency <= 50)
            return 'UHD';
        if (downloadSpeed >= 15 && latency <= 80)
            return 'FHD';
        if (downloadSpeed >= 8 && latency <= 100)
            return 'HD';
        if (downloadSpeed >= 3 && latency <= 150)
            return 'SD';
        return 'AUDIO_ONLY';
    }
    getQualityPresets() {
        return {
            UHD: {
                resolution: '3840x2160',
                bitrate: 8000,
                frameRate: 30,
                minBandwidth: 25,
            },
            FHD: {
                resolution: '1920x1080',
                bitrate: 4000,
                frameRate: 30,
                minBandwidth: 15,
            },
            HD: {
                resolution: '1280x720',
                bitrate: 2000,
                frameRate: 30,
                minBandwidth: 8,
            },
            SD: {
                resolution: '640x480',
                bitrate: 1000,
                frameRate: 24,
                minBandwidth: 3,
            },
            AUDIO_ONLY: {
                resolution: '0x0',
                bitrate: 128,
                frameRate: 0,
                minBandwidth: 0.1,
            },
        };
    }
    qualityToNumber(quality) {
        const qualityMap = { AUDIO_ONLY: 0, SD: 1, HD: 2, FHD: 3, UHD: 4 };
        return qualityMap[quality] || 0;
    }
    async getOptimalQuality(bandwidthInfo) {
        const downloadSpeed = bandwidthInfo.downloadSpeed;
        const latency = bandwidthInfo.latency;
        if (downloadSpeed >= 25 && latency <= 50)
            return 'UHD';
        if (downloadSpeed >= 15 && latency <= 80)
            return 'FHD';
        if (downloadSpeed >= 8 && latency <= 100)
            return 'HD';
        if (downloadSpeed >= 3 && latency <= 150)
            return 'SD';
        return 'AUDIO_ONLY';
    }
    async monitorBandwidth(consultationId) {
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: consultationId },
        });
        if (!consultation || consultation.status !== 'IN_PROGRESS') {
            return;
        }
        const mockBandwidth = {
            downloadSpeed: Math.random() * 20 + 5,
            latency: Math.random() * 100 + 20,
        };
        const optimalQuality = await this.getOptimalQuality(mockBandwidth);
        if (optimalQuality !== consultation.videoQuality) {
            await this.adaptToBandwidth(consultationId, mockBandwidth);
        }
        return mockBandwidth;
    }
    async getQualityRecommendations(user) {
        const recentTests = await this.prisma.bandwidthTest.findMany({
            where: { userId: user.id },
            orderBy: { testedAt: 'desc' },
            take: 10,
        });
        if (recentTests.length === 0) {
            return { recommendations: ['Test your bandwidth to get quality recommendations'] };
        }
        const avgDownload = recentTests.reduce((sum, test) => sum + test.downloadSpeed, 0) / recentTests.length;
        const avgLatency = recentTests.reduce((sum, test) => sum + test.latency, 0) / recentTests.length;
        const recommendations = [];
        if (avgDownload < 3) {
            recommendations.push('Your internet speed is low. Consider upgrading for better video quality.');
        }
        if (avgLatency > 100) {
            recommendations.push('High latency detected. This may cause audio/video sync issues.');
        }
        if (avgDownload >= 25 && avgLatency <= 50) {
            recommendations.push('Your connection supports Ultra HD quality.');
        }
        if (recommendations.length === 0) {
            recommendations.push('Your connection quality is good for telemedicine consultations.');
        }
        return { recommendations };
    }
};
exports.BandwidthService = BandwidthService;
exports.BandwidthService = BandwidthService = BandwidthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], BandwidthService);
//# sourceMappingURL=bandwidth.service.js.map