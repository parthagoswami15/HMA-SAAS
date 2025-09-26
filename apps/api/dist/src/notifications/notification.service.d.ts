import { OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { RegistrationType } from '@prisma/client';
type WelcomeNotificationData = {
    patientId: string;
    name: string;
    email?: string;
    phone?: string;
    mrn: string;
    registrationType: RegistrationType;
    tenantId: string;
};
type AppointmentReminderData = {
    patientId: string;
    appointmentId: string;
    patientName: string;
    doctorName: string;
    appointmentDate: Date;
    location: string;
    email?: string;
    phone?: string;
};
type TestResultsNotificationData = {
    patientId: string;
    testName: string;
    testDate: Date;
    resultsUrl: string;
    email?: string;
    phone?: string;
};
export declare class NotificationService implements OnModuleInit {
    private readonly eventEmitter;
    private readonly configService;
    private readonly logger;
    private isEnabled;
    constructor(eventEmitter: EventEmitter2, configService: ConfigService);
    onModuleInit(): void;
    private setupEventListeners;
    sendPatientWelcome(data: WelcomeNotificationData): Promise<void>;
    sendAppointmentReminder(data: AppointmentReminderData): Promise<void>;
    sendTestResults(data: TestResultsNotificationData): Promise<void>;
    private getWelcomeMessage;
    setEnabled(enabled: boolean): void;
}
export {};
