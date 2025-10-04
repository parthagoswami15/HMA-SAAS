import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { BandwidthService } from './bandwidth.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly bandwidthService: BandwidthService,
    private readonly auditService: AuditService,
  ) {}

  async createRoom(consultationId: string, options: {
    maxParticipants: number;
    enableRecording: boolean;
    enableScreenShare: boolean;
    quality: 'SD' | 'HD' | 'FHD' | 'UHD';
  }) {
    this.logger.log(`Creating video room for consultation ${consultationId}`);

    // In production, integrate with video providers like Agora, Twilio Video, WebRTC
    const videoProvider = this.configService.get<string>('VIDEO_PROVIDER', 'agora');

    let roomId: string;
    let roomToken: string;

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

  async createEmergencyRoom(consultationId: string) {
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

  async joinRoom(joinDto: any, user: any) {
    this.logger.log(`User ${user.id} joining room for consultation ${joinDto.consultationId}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: joinDto.consultationId },
      include: { videoRoom: true },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (!consultation.videoRoom) {
      throw new NotFoundException('Video room not found for this consultation');
    }

    // Check if user is authorized to join
    const isAuthorized = consultation.patientId === user.id ||
                        consultation.doctorId === user.id ||
                        user.roles?.includes('ADMIN');

    if (!isAuthorized) {
      throw new BadRequestException('User not authorized to join this consultation');
    }

    // Update participant status
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

    // Log the join
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

  async leaveRoom(leaveDto: any, user: any) {
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

      // Log the leave
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

  async getRoomStatus(consultationId: string, user: any) {
    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: consultationId },
      include: {
        videoRoom: true,
        participants: true,
      },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
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

  async startScreenShare(consultationId: string, screenShareDto: any, user: any) {
    this.logger.log(`User ${user.id} starting screen share for consultation ${consultationId}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: consultationId },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
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
      throw new BadRequestException('User not in consultation');
    }

    // Update participant screen share status
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

    // Log the screen share start
    await this.auditService.logActivity({
      action: 'SCREEN_SHARE_STARTED',
      entityType: 'VIDEO_PARTICIPANT',
      entityId: participant.id,
      userId: user.id,
      details: { consultationId },
    });

    return { success: true, streamId: `screen_${user.id}_${Date.now()}` };
  }

  async stopScreenShare(consultationId: string, user: any) {
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

      // Log the screen share stop
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

  async openRoom(consultationId: string) {
    this.logger.log(`Opening video room for consultation ${consultationId}`);

    const videoRoom = await this.prisma.videoRoom.findUnique({
      where: { consultationId },
    });

    if (!videoRoom) {
      throw new NotFoundException('Video room not found');
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

  async closeRoom(consultationId: string) {
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

      // Update all participants as disconnected
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

  async startRecording(consultationId: string, user: any) {
    this.logger.log(`Starting recording for consultation ${consultationId}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: consultationId },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    const recording = await this.prisma.videoRecording.create({
      data: {
        consultationId,
        startedBy: user.id,
        startedAt: new Date(),
        status: 'RECORDING',
      },
    });

    // Log the recording start
    await this.auditService.logActivity({
      action: 'RECORDING_STARTED',
      entityType: 'VIDEO_RECORDING',
      entityId: recording.id,
      userId: user.id,
      details: { consultationId },
    });

    return recording;
  }

  async stopRecording(consultationId: string, user: any) {
    this.logger.log(`Stopping recording for consultation ${consultationId}`);

    const recording = await this.prisma.videoRecording.findFirst({
      where: {
        consultationId,
        status: 'RECORDING',
      },
    });

    if (!recording) {
      throw new NotFoundException('No active recording found');
    }

    const updatedRecording = await this.prisma.videoRecording.update({
      where: { id: recording.id },
      data: {
        status: 'STOPPED',
        stoppedAt: new Date(),
        stoppedBy: user.id,
      },
    });

    // Log the recording stop
    await this.auditService.logActivity({
      action: 'RECORDING_STOPPED',
      entityType: 'VIDEO_RECORDING',
      entityId: recording.id,
      userId: user.id,
      details: { consultationId },
    });

    return updatedRecording;
  }

  async getRecording(consultationId: string, user: any) {
    const recordings = await this.prisma.videoRecording.findMany({
      where: { consultationId },
      orderBy: { startedAt: 'desc' },
    });

    return recordings;
  }

  private async createAgoraRoom(consultationId: string, options: any) {
    // Agora RTC integration would go here
    this.logger.log('Creating Agora video room');

    // Mock implementation
    return {
      roomId: `agora_${consultationId}_${Date.now()}`,
      token: `agora_token_${Date.now()}`,
    };
  }

  private async createTwilioRoom(consultationId: string, options: any) {
    // Twilio Video integration would go here
    this.logger.log('Creating Twilio video room');

    // Mock implementation
    return {
      roomId: `twilio_${consultationId}_${Date.now()}`,
      token: `twilio_token_${Date.now()}`,
    };
  }

  private async createMockRoom(consultationId: string, options: any) {
    // Mock implementation for development
    this.logger.log('Creating mock video room');

    return {
      roomId: `mock_${consultationId}_${Date.now()}`,
      token: `mock_token_${Date.now()}`,
    };
  }

  async updateRoomQuality(consultationId: string, quality: string) {
    this.logger.log(`Updating room quality for consultation ${consultationId} to ${quality}`);

    const videoRoom = await this.prisma.videoRoom.findUnique({
      where: { consultationId },
    });

    if (!videoRoom) {
      throw new NotFoundException('Video room not found');
    }

    await this.prisma.videoRoom.update({
      where: { consultationId },
      data: {
        quality: quality as any,
        qualityUpdatedAt: new Date(),
      },
    });

    return { success: true };
  }

  async getRoomParticipants(consultationId: string) {
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

  async sendRoomMessage(consultationId: string, messageDto: any, user: any) {
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

  async getRoomMessages(consultationId: string, user: any) {
    const messages = await this.prisma.videoMessage.findMany({
      where: { consultationId },
      orderBy: { timestamp: 'asc' },
    });

    return messages;
  }
}
