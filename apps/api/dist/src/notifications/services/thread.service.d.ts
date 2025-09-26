import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications.service';
export declare class NotificationThreadService {
    private readonly prisma;
    private readonly notificationsService;
    private readonly logger;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    createThread(threadDto: any, user: any): Promise<any>;
    getThreads(query: any, user: any): Promise<{
        threads: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    getThread(id: string, user: any): Promise<any>;
    sendMessage(threadId: string, messageDto: any, user: any): Promise<any>;
    closeThread(id: string, user: any): Promise<any>;
    addParticipant(threadId: string, participantId: string, user: any): Promise<any>;
    removeParticipant(threadId: string, participantId: string, user: any): Promise<any>;
    markThreadAsRead(threadId: string, userId: string): Promise<{
        success: boolean;
    }>;
    getUnreadCount(userId: string): Promise<{
        unreadThreads: any;
    }>;
    private createNotificationFromMessage;
    searchThreads(query: string, user: any): Promise<any>;
}
