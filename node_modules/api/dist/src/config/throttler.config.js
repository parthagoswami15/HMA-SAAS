"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THROTTLE_OPTIONS = exports.THROTTLER_STRATEGY = exports.throttlerConfig = void 0;
exports.throttlerConfig = {
    throttlers: [
        {
            name: 'login',
            ttl: 60000,
            limit: 5,
        },
        {
            name: 'global',
            ttl: 1000,
            limit: 10,
        },
    ],
};
exports.THROTTLER_STRATEGY = 'throttler';
exports.THROTTLE_OPTIONS = {
    login: {
        prefix: 'login_',
        ttl: 60000,
        limit: 5,
    },
    global: {
        prefix: 'global_',
        ttl: 1000,
        limit: 10,
    },
};
//# sourceMappingURL=throttler.config.js.map