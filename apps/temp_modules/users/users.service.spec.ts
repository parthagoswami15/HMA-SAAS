import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

// Mock bcrypt
jest.mock('bcrypt');

// Mock PrismaService
const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test@1234',
        role: Role.USER,
        firstName: 'Test',
        lastName: 'User',
      };

      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        ...userData,
        id: '1',
        password: hashedPassword,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (prisma.user.create as jest.Mock).mockResolvedValue(createdUser);

      const result = await service.create(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...userData,
          password: hashedPassword,
          isActive: true,
        },
      });
      expect(result).toEqual(createdUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test@1234',
        role: Role.USER,
      };

      (prisma.user.create as jest.Mock).mockRejectedValue({
        code: 'P2002',
      });

      await expect(service.create(userData)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = '1';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        role: Role.USER,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findOne(userId);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: { tenant: true },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = '999';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update user information', async () => {
      const userId = '1';
      const updateData = { firstName: 'Updated' };
      const updatedUser = { id: userId, firstName: 'Updated' };

      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateData);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      });
      expect(result).toEqual(updatedUser);
    });

    it('should update password if new password is provided', async () => {
      const userId = '1';
      const currentPassword = 'oldPassword';
      const newPassword = 'NewP@ssw0rd';
      const hashedPassword = 'hashedNewPassword';
      
      const user = {
        id: userId,
        email: 'test@example.com',
        password: 'hashedOldPassword',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (prisma.user.update as jest.Mock).mockResolvedValue({ ...user, password: hashedPassword });

      const result = await service.update(userId, { 
        currentPassword, 
        newPassword,
        confirmNewPassword: newPassword 
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(currentPassword, user.password);
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { password: hashedPassword },
      });
    });

    it('should throw BadRequestException if current password is incorrect', async () => {
      const userId = '1';
      const currentPassword = 'wrongPassword';
      const newPassword = 'NewP@ssw0rd';
      
      const user = {
        id: userId,
        email: 'test@example.com',
        password: 'hashedOldPassword',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.update(userId, { currentPassword, newPassword, confirmNewPassword: newPassword })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should soft delete a user', async () => {
      const userId = '1';
      
      await service.remove(userId);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { isActive: false, deletedAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = '999';

      (prisma.user.update as jest.Mock).mockRejectedValue({
        code: 'P2025',
      });

      await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        { id: '1', email: 'test1@example.com' },
        { id: '2', email: 'test2@example.com' },
      ];

      (prisma.user.count as jest.Mock).mockResolvedValue(2);
      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(prisma.user.count).toHaveBeenCalled();
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        include: { tenant: true },
      });
      expect(result.data).toEqual(mockUsers);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });
  });
});