import { ThrottlerModuleOptions } from '@nestjs/throttler';
export declare const throttlerConfig: ThrottlerModuleOptions;
export declare const THROTTLER_STRATEGY = "throttler";
export declare const THROTTLE_OPTIONS: {
    login: {
        prefix: string;
        ttl: number;
        limit: number;
    };
    global: {
        prefix: string;
        ttl: number;
        limit: number;
    };
};
