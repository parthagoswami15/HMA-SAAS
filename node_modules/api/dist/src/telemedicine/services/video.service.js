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
var VideoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const bandwidth_service_1 = require("./bandwidth.service");
const audit_service_1 = require("../../audit/audit.service");
let VideoService = VideoService_1 = class VideoService {
    prisma;
    configService;
    bandwidthService;
    auditService;
    logger = new common_1.Logger(VideoService_1.name);
    constructor(prisma, configService, bandwidthService, auditService) {
        this.prisma = prisma;
        this.configService = configService;
        this.bandwidthService = bandwidthService;
        this.auditService = auditService;
    }
    async createRoom(consultationId, options) {
        this.logger.log(`Creating video room for consultation ${consultationId}`);
        const videoProvider = this.configService.get('VIDEO_PROVIDER', 'agora');
        let roomId;
        let roomToken;
        switch (videoProvider) {
            case 'agora':
                const agoraResult = await this.createAgoraRoom(consultationId, options);
                roomId = agoraResult.roomId;
                roomToken = agoraResult.token;
                break;
            case 'twilio':
                const twilioResult = await this.createTwilioRoom(consultationId, options);
                roomId = twilioResult.roomId;
                roomToken = twilioResult.token;
                break;
            default:
                const mockResult = await this.createMockRoom(consultationId, options);
                roomId = mockResult.roomId;
                roomToken = mockResult.token;
        }
        const videoRoom = await this.prisma.videoRoom.create({
            data: {
                consultationId,
                roomId,
                roomToken,
                provider: videoProvider,
                maxParticipants: options.maxParticipants,
                enableRecording: options.enableRecording,
                enableScreenShare: options.enableScreenShare,
                quality: options.quality,
                status: 'CREATED',
            },
        });
        return videoRoom;
    }
    async createEmergencyRoom(consultationId) {
        this.logger.log(`Creating emergency video room for consultation ${consultationId}`);
        const videoRoom = await this.prisma.videoRoom.create({
            data: {
                consultationId,
                roomId: `emergency_${consultationId}_${Date.now()}`,
                roomToken: `emergency_token_${Date.now()}`,
                provider: 'emergency',
                maxParticipants: 2,
                enableRecording: true,
                enableScreenShare: true,
                quality: 'HD',
                status: 'ACTIVE',
                isEmergency: true,
            },
        });
        return videoRoom;
    }
    async joinRoom(joinDto, user) {
        this.logger.log(`User ${user.id} joining room for consultation ${joinDto.consultationId}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: joinDto.consultationId },
            include: { videoRoom: true },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        if (!consultation.videoRoom) {
            throw new common_1.NotFoundException('Video room not found for this consultation');
        }
        const isAuthorized = consultation.patientId === user.id ||
            consultation.doctorId === user.id ||
            user.roles?.includes('ADMIN');
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User not authorized to join this consultation');
        }
        await this.prisma.videoParticipant.upsert({
            where: {
                consultationId_userId: {
                    consultationId: joinDto.consultationId,
                    userId: user.id,
                },
            },
            update: {
                status: 'CONNECTED',
                joinedAt: new Date(),
                deviceInfo: joinDto.deviceInfo,
                networkInfo: joinDto.networkInfo,
            },
            create: {
                consultationId: joinDto.consultationId,
                userId: user.id,
                userType: joinDto.userType,
                status: 'CONNECTED',
                joinedAt: new Date(),
                deviceInfo: joinDto.deviceInfo,
                networkInfo: joinDto.networkInfo,
            },
        });
        await this.auditService.logActivity({
            action: 'VIDEO_ROOM_JOINED',
            entityType: 'VIDEO_ROOM',
            entityId: consultation.videoRoom.id,
            userId: user.id,
            details: { consultationId: joinDto.consultationId, userType: joinDto.userType },
        });
        return {
            roomId: consultation.videoRoom.roomId,
            roomToken: consultation.videoRoom.roomToken,
            quality: consultation.videoRoom.quality,
            enableRecording: consultation.videoRoom.enableRecording,
            enableScreenShare: consultation.videoRoom.enableScreenShare,
        };
    }
    async leaveRoom(leaveDto, user) {
        this.logger.log(`User ${user.id} leaving room for consultation ${leaveDto.consultationId}`);
        const participant = await this.prisma.videoParticipant.findUnique({
            where: {
                consultationId_userId: {
                    consultationId: leaveDto.consultationId,
                    userId: user.id,
                },
            },
        });
        if (participant) {
            await this.prisma.videoParticipant.update({
                where: {
                    consultationId_userId: {
                        consultationId: leaveDto.consultationId,
                        userId: user.id,
                    },
                },
                data: {
                    status: 'DISCONNECTED',
                    leftAt: new Date(),
                },
            });
            await this.auditService.logActivity({
                action: 'VIDEO_ROOM_LEFT',
                entityType: 'VIDEO_PARTICIPANT',
                entityId: participant.id,
                userId: user.id,
                details: { consultationId: leaveDto.consultationId },
            });
        }
        return { success: true };
    }
    async getRoomStatus(consultationId, user) {
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: consultationId },
            include: {
                videoRoom: true,
                participants: true,
            },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        const participants = await this.prisma.videoParticipant.findMany({
            where: { consultationId },
        });
        return {
            consultationId,
            roomStatus: consultation.videoRoom?.status || 'NOT_CREATED',
            participants: participants.map(p => ({
                userId: p.userId,
                userType: p.userType,
                status: p.status,
                joinedAt: p.joinedAt,
                leftAt: p.leftAt,
            })),
            settings: {
                enableRecording: consultation.videoRoom?.enableRecording,
                enableScreenShare: consultation.videoRoom?.enableScreenShare,
                quality: consultation.videoRoom?.quality,
            },
        };
    }
    async startScreenShare(consultationId, screenShareDto, user) {
        this.logger.log(`User ${user.id} starting screen share for consultation ${consultationId}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: consultationId },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        const participant = await this.prisma.videoParticipant.findUnique({
            where: {
                consultationId_userId: {
                    consultationId,
                    userId: user.id,
                },
            },
        });
        if (!participant) {
            throw new common_1.BadRequestException('User not in consultation');
        }
        await this.prisma.videoParticipant.update({
            where: {
                consultationId_userId: {
                    consultationId,
                    userId: user.id,
                },
            },
            data: {
                isScreenSharing: true,
                screenShareStartedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'SCREEN_SHARE_STARTED',
            entityType: 'VIDEO_PARTICIPANT',
            entityId: participant.id,
            userId: user.id,
            details: { consultationId },
        });
        return { success: true, streamId: `screen_${user.id}_${Date.now()}` };
    }
    async stopScreenShare(consultationId, user) {
        this.logger.log(`User ${user.id} stopping screen share for consultation ${consultationId}`);
        const participant = await this.prisma.videoParticipant.findUnique({
            where: {
                consultationId_userId: {
                    consultationId,
                    userId: user.id,
                },
            },
        });
        if (participant) {
            await this.prisma.videoParticipant.update({
                where: {
                    consultationId_userId: {
                        consultationId,
                        userId: user.id,
                    },
                },
                data: {
                    isScreenSharing: false,
                    screenShareEndedAt: new Date(),
                },
            });
            await this.auditService.logActivity({
                action: 'SCREEN_SHARE_STOPPED',
                entityType: 'VIDEO_PARTICIPANT',
                entityId: participant.id,
                userId: user.id,
                details: { consultationId },
            });
        }
        return { success: true };
    }
    async openRoom(consultationId) {
        this.logger.log(`Opening video room for consultation ${consultationId}`);
        const videoRoom = await this.prisma.videoRoom.findUnique({
            where: { consultationId },
        });
        if (!videoRoom) {
            throw new common_1.NotFoundException('Video room not found');
        }
        await this.prisma.videoRoom.update({
            where: { consultationId },
            data: {
                status: 'ACTIVE',
                openedAt: new Date(),
            },
        });
        return { success: true };
    }
    async closeRoom(consultationId) {
        this.logger.log(`Closing video room for consultation ${consultationId}`);
        const videoRoom = await this.prisma.videoRoom.findUnique({
            where: { consultationId },
        });
        if (videoRoom) {
            await this.prisma.videoRoom.update({
                where: { consultationId },
                data: {
                    status: 'CLOSED',
                    closedAt: new Date(),
                },
            });
            await this.prisma.videoParticipant.updateMany({
                where: { consultationId },
                data: {
                    status: 'DISCONNECTED',
                    leftAt: new Date(),
                },
            });
        }
        return { success: true };
    }
    async startRecording(consultationId, user) {
        this.logger.log(`Starting recording for consultation ${consultationId}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: consultationId },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        const recording = await this.prisma.videoRecording.create({
            data: {
                consultationId,
                startedBy: user.id,
                startedAt: new Date(),
                status: 'RECORDING',
            },
        });
        await this.auditService.logActivity({
            action: 'RECORDING_STARTED',
            entityType: 'VIDEO_RECORDING',
            entityId: recording.id,
            userId: user.id,
            details: { consultationId },
        });
        return recording;
    }
    async stopRecording(consultationId, user) {
        this.logger.log(`Stopping recording for consultation ${consultationId}`);
        const recording = await this.prisma.videoRecording.findFirst({
            where: {
                consultationId,
                status: 'RECORDING',
            },
        });
        if (!recording) {
            throw new common_1.NotFoundException('No active recording found');
        }
        const updatedRecording = await this.prisma.videoRecording.update({
            where: { id: recording.id },
            data: {
                status: 'STOPPED',
                stoppedAt: new Date(),
                stoppedBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'RECORDING_STOPPED',
            entityType: 'VIDEO_RECORDING',
            entityId: recording.id,
            userId: user.id,
            details: { consultationId },
        });
        return updatedRecording;
    }
    async getRecording(consultationId, user) {
        const recordings = await this.prisma.videoRecording.findMany({
            where: { consultationId },
            orderBy: { startedAt: 'desc' },
        });
        return recordings;
    }
    async createAgoraRoom(consultationId, options) {
        this.logger.log('Creating Agora video room');
        return {
            roomId: `agora_${consultationId}_${Date.now()}`,
            token: `agora_token_${Date.now()}`,
        };
    }
    async createTwilioRoom(consultationId, options) {
        this.logger.log('Creating Twilio video room');
        return {
            roomId: `twilio_${consultationId}_${Date.now()}`,
            token: `twilio_token_${Date.now()}`,
        };
    }
    async createMockRoom(consultationId, options) {
        this.logger.log('Creating mock video room');
        return {
            roomId: `mock_${consultationId}_${Date.now()}`,
            token: `mock_token_${Date.now()}`,
        };
    }
    async updateRoomQuality(consultationId, quality) {
        this.logger.log(`Updating room quality for consultation ${consultationId} to ${quality}`);
        const videoRoom = await this.prisma.videoRoom.findUnique({
            where: { consultationId },
        });
        if (!videoRoom) {
            throw new common_1.NotFoundException('Video room not found');
        }
        await this.prisma.videoRoom.update({
            where: { consultationId },
            data: {
                quality: quality,
                qualityUpdatedAt: new Date(),
            },
        });
        return { success: true };
    }
    async getRoomParticipants(consultationId) {
        const participants = await this.prisma.videoParticipant.findMany({
            where: { consultationId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return participants;
    }
    async sendRoomMessage(consultationId, messageDto, user) {
        this.logger.log(`Sending room message for consultation ${consultationId}`);
        const message = await this.prisma.videoMessage.create({
            data: {
                consultationId,
                senderId: user.id,
                message: messageDto.message,
                messageType: messageDto.messageType || 'TEXT',
                timestamp: new Date(),
            },
        });
        return message;
    }
    async getRoomMessages(consultationId, user) {
        const messages = await this.prisma.videoMessage.findMany({
            where: { consultationId },
            orderBy: { timestamp: 'asc' },
        });
        return messages;
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = VideoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        bandwidth_service_1.BandwidthService,
        audit_service_1.AuditService])
], VideoService);
//# sourceMappingURL=video.service.js.map