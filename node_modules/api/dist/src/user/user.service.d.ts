import { PrismaService } from '../prisma/prisma.service';
export interface CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phone?: string;
    isActive?: boolean;
    tenantId: string;
}
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    createUser(data: CreateUserDto): Promise<any>;
    deleteUser(id: string): Promise<any>;
    bulkDeactivateUsers(userIds: string[]): Promise<any>;
}
