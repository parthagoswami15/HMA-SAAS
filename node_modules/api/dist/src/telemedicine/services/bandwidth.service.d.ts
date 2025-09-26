import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class BandwidthService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    testBandwidth(user: any): Promise<{
        downloadSpeed: number;
        uploadSpeed: number;
        latency: number;
        connectionType: string;
        timestamp: Date;
        quality: string;
    }>;
    updateVideoQuality(consultationId: string, qualityDto: any, user: any): Promise<{
        success: boolean;
        quality: any;
    }>;
    getQualitySettings(user: any): Promise<{
        recentTests: any;
        averageDownload: number;
        averageLatency: number;
        recommendedQuality: string;
        qualityPresets: {
            UHD: {
                resolution: string;
                bitrate: number;
                frameRate: number;
                minBandwidth: number;
            };
            FHD: {
                resolution: string;
                bitrate: number;
                frameRate: number;
                minBandwidth: number;
            };
            HD: {
                resolution: string;
                bitrate: number;
                frameRate: number;
                minBandwidth: number;
            };
            SD: {
                resolution: string;
                bitrate: number;
                frameRate: number;
                minBandwidth: number;
            };
            AUDIO_ONLY: {
                resolution: string;
                bitrate: number;
                frameRate: number;
                minBandwidth: number;
            };
        };
    }>;
    adaptToBandwidth(consultationId: string, bandwidthInfo: any): Promise<{
        adaptedQuality: string;
    }>;
    getBandwidthHistory(user: any): Promise<any>;
    getBandwidthAnalytics(user: any): Promise<{
        message: string;
        totalTests?: undefined;
        averageDownload?: undefined;
        averageUpload?: undefined;
        averageLatency?: undefined;
        qualityDistribution?: undefined;
        connectionTypes?: undefined;
        bestQuality?: undefined;
        worstQuality?: undefined;
    } | {
        totalTests: any;
        averageDownload: number;
        averageUpload: number;
        averageLatency: number;
        qualityDistribution: any;
        connectionTypes: any;
        bestQuality: number;
        worstQuality: number;
        message?: undefined;
    }>;
    private determineConnectionType;
    private determineQuality;
    private getQualityPresets;
    private qualityToNumber;
    getOptimalQuality(bandwidthInfo: any): Promise<"HD" | "UHD" | "FHD" | "SD" | "AUDIO_ONLY">;
    monitorBandwidth(consultationId: string): Promise<{
        downloadSpeed: number;
        latency: number;
    } | undefined>;
    getQualityRecommendations(user: any): Promise<{
        recommendations: string[];
    }>;
}
