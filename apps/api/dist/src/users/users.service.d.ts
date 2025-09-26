import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
type UserWithTenant = Prisma.UserGetPayload<{
    include: {
        tenant: true;
    };
}>;
export type FindAllUsersParams = {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
};
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(id: string): Promise<UserWithTenant>;
    findByEmail(email: string): Promise<UserWithTenant | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    remove(id: string): Promise<User>;
    findAll(params?: FindAllUsersParams): Promise<UserWithTenant[]>;
    updateLastLogin(userId: string): Promise<void>;
}
export {};
