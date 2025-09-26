"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('auth', () => ({
    jwt: {
        access: {
            secret: process.env.JWT_ACCESS_SECRET || 'your-access-secret',
            expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
        },
        refresh: {
            secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
            expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
        },
    },
    bcrypt: {
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
    },
    refreshToken: {
        cookieName: 'refreshToken',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    },
    rateLimit: {
        ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
        limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
    },
}));
//# sourceMappingURL=auth.config.js.map