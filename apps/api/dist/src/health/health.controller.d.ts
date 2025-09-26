import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private prisma;
    constructor(prisma: PrismaService);
    health(): {
        status: string;
    };
    ready(): Promise<{
        status: string;
        error?: undefined;
    } | {
        status: string;
        error: string;
    }>;
}
