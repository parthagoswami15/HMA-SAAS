import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
import * as crypto from 'crypto';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createSession(userId: string, deviceInfo: any, ipAddress: string) {
    this.logger.log(`Creating session for user: ${userId}`);

    const sessionId = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes default

    const session = await this.prisma.session.create({
      data: {
        id: sessionId,
        userId,
        ipAddress,
        userAgent: deviceInfo?.userAgent || '',
        deviceInfo: JSON.stringify(deviceInfo),
        expiresAt,
      },
    });

    return session;
  }

  async getSession(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isActive: true,
            mfaEnabled: true,
            roles: true,
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return session;
  }

  async extendSession(sessionId: string) {
    this.logger.log(`Extending session: ${sessionId}`);

    const session = await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        lastActivity: new Date(),
      },
    });

    return session;
  }

  async revokeSession(sessionId: string, user: any) {
    this.logger.log(`Revoking session: ${sessionId}`);

    const session = await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        revokedAt: new Date(),
        revokedBy: user.id,
      },
    });

    // Log session revocation
    await this.auditService.logActivity({
      action: 'SESSION_REVOKED',
      entityType: 'SESSION',
      entityId: sessionId,
      userId: user.id,
    });

    return session;
  }

  async revokeAllSessions(user: any) {
    this.logger.log(`Revoking all sessions for user: ${user.id}`);

    const sessions = await this.prisma.session.updateMany({
      where: { userId: user.id },
      data: {
        revokedAt: new Date(),
        revokedBy: user.id,
      },
    });

    // Log bulk session revocation
    await this.auditService.logActivity({
      action: 'ALL_SESSIONS_REVOKED',
      entityType: 'USER',
      entityId: user.id,
      userId: user.id,
    });

    return { revokedCount: sessions.count };
  }

  async getUserSessions(user: any) {
    const sessions = await this.prisma.session.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return sessions.map(session => ({
      id: session.id,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      deviceInfo: JSON.parse(session.deviceInfo || '{}'),
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      lastActivity: session.lastActivity,
      isActive: session.expiresAt > new Date() && !session.revokedAt,
    }));
  }

  async cleanupExpiredSessions() {
    this.logger.log('Cleaning up expired sessions');

    const expiredSessions = await this.prisma.session.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    return { deletedCount: expiredSessions.count };
  }

  async getActiveSessionsCount(user: any) {
    const count = await this.prisma.session.count({
      where: {
        userId: user.id,
        expiresAt: { gt: new Date() },
        revokedAt: null,
      },
    });

    return { userId: user.id, activeSessions: count };
  }
}
