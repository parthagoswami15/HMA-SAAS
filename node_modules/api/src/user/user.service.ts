import { Injectable } from '@nestjs/common';
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

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async bulkDeactivateUsers(userIds: string[]) {
    return this.prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { isActive: false },
    });
  }
}
