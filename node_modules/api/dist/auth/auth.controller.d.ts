import { AuthService, RegisterUserDto, LoginDto } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterUserDto): Promise<{
        success: boolean;
        message: string;
        data: {
            userId: string;
            tenantId: string;
            email: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            tenantId: string;
            tenant: {
                id: string;
                name: string;
                type: import(".prisma/client").$Enums.TenantType;
            };
        };
    }>;
    getProfile(req: any): Promise<any>;
    health(): Promise<{
        status: string;
        service: string;
    }>;
}
