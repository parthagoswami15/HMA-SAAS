import { JwtService } from '@nestjs/jwt';
import { CustomPrismaService } from '../prisma/custom-prisma.service';
export interface RegisterUserDto {
    organizationType: 'hospital' | 'clinic' | 'private_practice';
    organizationName: string;
    address: string;
    phone: string;
    email: string;
    adminFirstName: string;
    adminLastName: string;
    adminEmail: string;
    adminPhone: string;
    adminPassword: string;
    features: string[];
    preferences: {
        notifications: boolean;
        analytics: boolean;
        backups: boolean;
    };
}
export interface LoginDto {
    email: string;
    password: string;
}
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: CustomPrismaService, jwtService: JwtService);
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
    validateUser(userId: string): Promise<any>;
}
