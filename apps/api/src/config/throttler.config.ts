import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttlerConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      name: 'login',
      ttl: 60000, // 1 minute
      limit: 5, // 5 requests per minute
    },
    {
      name: 'global',
      ttl: 1000, // 1 second
      limit: 10, // 10 requests per second
    },
  ],
};

export const THROTTLER_STRATEGY = 'throttler';

export const THROTTLE_OPTIONS = {
  login: {
    prefix: 'login_',
    ttl: 60000, // 1 minute
    limit: 5, // 5 requests per minute
  },
  global: {
    prefix: 'global_',
    ttl: 1000, // 1 second
    limit: 10, // 10 requests per second
  },
};
