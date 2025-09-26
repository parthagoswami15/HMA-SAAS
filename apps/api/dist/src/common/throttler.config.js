"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttlerConfig = void 0;
exports.throttlerConfig = {
    throttlers: [
        {
            name: 'short',
            ttl: 1000,
            limit: 10,
        },
        {
            name: 'medium',
            ttl: 10000,
            limit: 50,
        },
        {
            name: 'long',
            ttl: 60000,
            limit: 200,
        },
    ],
};
//# sourceMappingURL=throttler.config.js.map