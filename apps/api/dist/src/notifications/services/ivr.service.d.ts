import { ConfigService } from '@nestjs/config';
export declare class IvrService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    makeCall(options: {
        to: string;
        message: string;
        priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
        voice?: 'male' | 'female';
        language?: string;
    }): Promise<{
        success: boolean;
        callId: string;
        provider: string;
        to: any;
        status: string;
        duration: number;
    }>;
    private makeTwilioCall;
    private makeAwsCall;
    private makeMockCall;
    makeTestCall(to: string, message: string): Promise<{
        success: boolean;
        callId: string;
        provider: string;
        to: any;
        status: string;
        duration: number;
    }>;
    getCallRecording(callId: string): Promise<{
        callId: string;
        recordingUrl: string;
        duration: number;
        size: number;
    }>;
    getCallAnalytics(callId: string): Promise<{
        callId: string;
        duration: number;
        status: string;
        sentiment: string;
        keywords: string[];
        transcript: string;
    }>;
    getIvrBalance(): Promise<{
        provider: string;
        minutesRemaining: number;
        currency: string;
        costPerMinute: number;
    }>;
    createIvrFlow(options: {
        name: string;
        steps: Array<{
            type: 'play' | 'gather' | 'record' | 'dial';
            data: any;
        }>;
    }): Promise<{
        flowId: string;
        name: string;
        status: string;
        createdAt: Date;
    }>;
    updateIvrFlow(flowId: string, options: any): Promise<{
        flowId: string;
        updatedAt: Date;
        status: string;
    }>;
    deleteIvrFlow(flowId: string): Promise<{
        flowId: string;
        deletedAt: Date;
    }>;
    getIvrFlows(): Promise<{
        flowId: string;
        name: string;
        status: string;
        createdAt: Date;
    }[]>;
}
