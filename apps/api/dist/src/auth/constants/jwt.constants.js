"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_CONSTANTS = void 0;
exports.JWT_CONSTANTS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    BEARER: 'Bearer',
    AUTH_HEADER: 'authorization',
    COOKIE_OPTIONS: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};
//# sourceMappingURL=jwt.constants.js.map