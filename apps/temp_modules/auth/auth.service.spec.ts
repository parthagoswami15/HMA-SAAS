import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './services/token.service';
import * as bcrypt from 'bcryptjs';
import { Role, User } from '@prisma/client';
import { ConflictException, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let tokenService: TokenService;

  const mockPrisma = {
    user: { 
      findUnique: jest.fn(), 
      create: jest.fn(), 
      update: jest.fn() 
    },
    tenant: { 
      create: jest.fn() 
    },
    refreshToken: { 
      create: jest.fn(), 
      findFirst: jest.fn(), 
      updateMany: jest.fn() 
    },
  };

  const mockJwtService = { 
    signAsync: jest.fn() 
  };
  
  const mockTokenService = { 
    generateTokens: jest.fn(), 
    verifyRefreshToken: jest.fn() 
  };
  
  const mockConfigService = { 
    get: jest.fn().mockImplementation((key: string) => {
      switch (key) {
        case 'JWT_ACCESS_SECRET':
          return 'test-secret';
        case 'JWT_ACCESS_EXPIRATION':
          return '15m';
        default:
          return null;
      }
    }) 
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    tokenService = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    const mockTenant = {
      id: 'tenant-1',
      name: 'Test Organization',
      slug: 'test-org',
    };

    const mockUser = {
      id: 'user-1',
      ...registerDto,
      role: 'PATIENT' as Role,
      isActive: true,
      tenantId: mockTenant.id,
      tenant: mockTenant,
      passwordHash: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should register a new user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.tenant.create.mockResolvedValue(mockTenant);
      mockPrisma.user.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(prisma.tenant.create).toHaveBeenCalled();
      expect(prisma.user.create).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
      expect(result.email).toBe(registerDto.email);
      expect(result.role).toBe('PATIENT');
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ email: registerDto.email });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(prisma.tenant.create).not.toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = { 
      email: 'test@example.com', 
      password: 'password123',
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent'
    };

    const mockUser = {
      id: 'user-1',
      email: loginDto.email,
      passwordHash: '', // Will be set in the test
      firstName: 'Test',
      lastName: 'User',
      role: 'PATIENT' as Role,
      isActive: true,
      tenantId: 'tenant-1',
      tenant: {
        id: 'tenant-1',
        name: 'Test Organization',
        slug: 'test-org',
      },
    };

    beforeEach(async () => {
      mockUser.passwordHash = await bcrypt.hash(loginDto.password, 10);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockTokenService.generateTokens.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      mockPrisma.refreshToken.create.mockResolvedValue({});
      mockPrisma.user.update.mockResolvedValue({});
    });

    it('should login with valid credentials', async () => {
      const result = await service.login(loginDto);
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
        include: { tenant: true },
      });
      expect(tokenService.generateTokens).toHaveBeenCalled();
      expect(prisma.refreshToken.create).toHaveBeenCalled();
      expect(prisma.user.update).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe(loginDto.email);
    });

    it('should throw UnauthorizedException with invalid password', async () => {
      const invalidLoginDto = { ...loginDto, password: 'wrong-password' };
      
      await expect(service.login(invalidLoginDto)).rejects.toThrow(UnauthorizedException);
      expect(tokenService.generateTokens).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(tokenService.generateTokens).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });
      
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(tokenService.generateTokens).not.toHaveBeenCalled();
    });

    it('should handle missing ipAddress and userAgent', async () => {
      const loginWithoutMetadata = { email: loginDto.email, password: loginDto.password };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      
      const result = await service.login(loginWithoutMetadata as LoginDto);
      
      expect(result).toBeDefined();
      expect(prisma.refreshToken.create).toHaveBeenCalled();
    });
  });

  describe('refreshTokens', () => {
    const refreshToken = 'valid-refresh-token';
    const payload = {
      sub: 'user-1',
      jti: 'jti-123',
      email: 'test@example.com',
      role: 'PATIENT',
      tenantId: 'tenant-1',
      firstName: 'Test',
      lastName: 'User',
      isActive: true
    };

    const mockUser = {
      id: payload.sub,
      email: payload.email,
      role: payload.role as Role,
      tenantId: payload.tenantId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      isActive: payload.isActive,
      tenant: {
        id: payload.tenantId,
        name: 'Test Organization',
        slug: 'test-org'
      }
    };

    beforeEach(() => {
      mockTokenService.verifyRefreshToken.mockResolvedValue(payload);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.refreshToken.findFirst.mockResolvedValue({
        id: 'refresh-token-1',
        jti: payload.jti,
        userId: payload.sub,
        token: 'hashed-token',
        isRevoked: false,
        expiresAt: new Date(Date.now() + 1000000),
        tenantId: payload.tenantId
      });
      mockTokenService.generateTokens.mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      });
      mockPrisma.refreshToken.create.mockResolvedValue({});
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
    });

    it('should refresh tokens with valid refresh token', async () => {
      const result = await service.refreshTokens(refreshToken);
      
      expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: payload.sub },
        include: { tenant: true }
      });
      expect(tokenService.generateTokens).toHaveBeenCalled();
      expect(prisma.refreshToken.create).toHaveBeenCalled();
      expect(prisma.refreshToken.updateMany).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      mockTokenService.verifyRefreshToken.mockRejectedValue(new Error('Invalid token'));
      
      await expect(service.refreshTokens('invalid-token'))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      
      await expect(service.refreshTokens(refreshToken))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        isActive: false
      });
      
      await expect(service.refreshTokens(refreshToken))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for revoked token', async () => {
      mockPrisma.refreshToken.findFirst.mockResolvedValue({
        ...mockPrisma.refreshToken.findFirst.mock.results[0].value,
        isRevoked: true
      });
      
      await expect(service.refreshTokens(refreshToken))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    const userId = 'user-1';
    const jti = 'jti-123';

    beforeEach(() => {
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
    });

    it('should revoke the refresh token', async () => {
      await service.logout(userId, jti);
      
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: {
          jti,
          userId,
          isRevoked: false
        },
        data: {
          isRevoked: true,
          revokedAt: expect.any(Date)
        }
      });
    });

    it('should handle non-existent token gracefully', async () => {
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 0 });
      
      await expect(service.logout(userId, 'non-existent-jti'))
        .resolves
        .not.toThrow();
    });
  });

  describe('logoutAllDevices', () => {
    const userId = 'user-1';

    beforeEach(() => {
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 2 });
    });

    it('should revoke all refresh tokens for the user', async () => {
      await service.logoutAllDevices(userId);
      
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: {
          userId,
          isRevoked: false
        },
        data: {
          isRevoked: true,
          revokedAt: expect.any(Date)
        }
      });
    });
  });
});
