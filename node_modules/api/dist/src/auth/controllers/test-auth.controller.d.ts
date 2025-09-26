import { AuthUser } from '../decorators/current-user.decorator';
export declare class TestAuthController {
    publicEndpoint(): {
        message: string;
    };
    protectedEndpoint(user: AuthUser): {
        message: string;
        user: {
            id: string;
            email: string;
            role: string | undefined;
        };
    };
    adminEndpoint(user: AuthUser): Promise<{
        statusCode: number;
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: {
            id: string;
            email: string;
            role: string | undefined;
        };
        statusCode?: undefined;
    }>;
}
