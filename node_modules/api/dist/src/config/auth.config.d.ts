declare const _default: (() => {
    jwt: {
        access: {
            secret: string;
            expiresIn: string;
        };
        refresh: {
            secret: string;
            expiresIn: string;
        };
    };
    bcrypt: {
        saltRounds: number;
    };
    refreshToken: {
        cookieName: string;
        httpOnly: boolean;
        maxAge: number;
        secure: boolean;
        sameSite: "strict";
    };
    rateLimit: {
        ttl: number;
        limit: number;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    jwt: {
        access: {
            secret: string;
            expiresIn: string;
        };
        refresh: {
            secret: string;
            expiresIn: string;
        };
    };
    bcrypt: {
        saltRounds: number;
    };
    refreshToken: {
        cookieName: string;
        httpOnly: boolean;
        maxAge: number;
        secure: boolean;
        sameSite: "strict";
    };
    rateLimit: {
        ttl: number;
        limit: number;
    };
}>;
export default _default;
