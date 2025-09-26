import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';
import { Request as ExpressRequest } from 'express';
interface RequestWithUser extends ExpressRequest {
    user: {
        userId: string;
        roles: Role[];
    };
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<User>;
    getProfile(req: RequestWithUser): Promise<Prisma.UserGetPayload<{
        include: {
            tenant: true;
        };
    }>>;
    findAll(): Promise<Prisma.UserGetPayload<{
        include: {
            tenant: true;
        };
    }>[]>;
    findOne(id: string): Promise<Prisma.UserGetPayload<{
        include: {
            tenant: true;
        };
    }>>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<User>;
}
export {};
