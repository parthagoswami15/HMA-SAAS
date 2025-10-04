import { 
  Injectable, 
  NotFoundException, 
  ConflictException,
  BadRequestException,
  forwardRef,
  Inject
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

// Fixed type definition
type UserWithTenant = Prisma.UserGetPayload<{
  include: { tenant: true };
}> & { roles?: Role[] };

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {}

  async create(createUserDto: any): Promise<User> {
    const { password, ...userData } = createUserDto;
    
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
      return await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          isActive: userData.isActive !== undefined ? userData.isActive : true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async findOne(id: string): Promise<UserWithTenant> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { tenant: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    if (updateUserDto.validate) {
      updateUserDto.validate();
    }
  
    const { currentPassword, newPassword, confirmNewPassword, ...updateData } = updateUserDto;
    
    if (newPassword) {
      if (!currentPassword) {
        throw new BadRequestException('Current password is required to update password');
      }
  
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isPasswordValid) {
        throw new BadRequestException('Current password is incorrect');
      }
  
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }
  
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Email already in use');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id },
        data: { 
          isActive: false
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<PaginatedResult<User>> {
    const { page = 1, limit = 10, where, orderBy } = params;
    const skip = (page - 1) * limit;
    const take = limit;

    const [total, data] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        skip,
        take,
        where,
        orderBy,
        include: { tenant: true },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }
}