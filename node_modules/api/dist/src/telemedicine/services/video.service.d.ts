import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { BandwidthService } from './bandwidth.service';
import { AuditService } from '../../audit/audit.service';
export declare class VideoService {
    private readonly prisma;
    private readonly configService;
    private readonly bandwidthService;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService, bandwidthService: BandwidthService, auditService: AuditService);
    createRoom(consultationId: string, options: {
        maxParticipants: number;
        enableRecording: boolean;
        enableScreenShare: boolean;
        quality: 'SD' | 'HD' | 'FHD' | 'UHD';
    }): Promise<any>;
    createEmergencyRoom(consultationId: string): Promise<any>;
    joinRoom(joinDto: any, user: any): Promise<{
        roomId: any;
        roomToken: any;
        quality: any;
        enableRecording: any;
        enableScreenShare: any;
    }>;
    leaveRoom(leaveDto: any, user: any): Promise<{
        success: boolean;
    }>;
    getRoomStatus(consultationId: string, user: any): Promise<{
        consultationId: string;
        roomStatus: any;
        participants: any;
        settings: {
            enableRecording: any;
            enableScreenShare: any;
            quality: any;
        };
    }>;
    startScreenShare(consultationId: string, screenShareDto: any, user: any): Promise<{
        success: boolean;
        streamId: string;
    }>;
    stopScreenShare(consultationId: string, user: any): Promise<{
        success: boolean;
    }>;
    openRoom(consultationId: string): Promise<{
        success: boolean;
    }>;
    closeRoom(consultationId: string): Promise<{
        success: boolean;
    }>;
    startRecording(consultationId: string, user: any): Promise<any>;
    stopRecording(consultationId: string, user: any): Promise<any>;
    getRecording(consultationId: string, user: any): Promise<any>;
    private createAgoraRoom;
    private createTwilioRoom;
    private createMockRoom;
    updateRoomQuality(consultationId: string, quality: string): Promise<{
        success: boolean;
    }>;
    getRoomParticipants(consultationId: string): Promise<any>;
    sendRoomMessage(consultationId: string, messageDto: any, user: any): Promise<any>;
    getRoomMessages(consultationId: string, user: any): Promise<any>;
}
