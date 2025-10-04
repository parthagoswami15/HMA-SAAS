import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { User, Role } from '@prisma/client';
import { AuthResponseDto } from './dto/auth-response.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'hashedpassword',
    role: Role.PATIENT,
    tenantId: 'tenant-1',
    isActive: true,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTokens = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };

  const mockAuthService = {
    register: jest.fn().mockResolvedValue(mockUser),
    validateUser: jest.fn().mockResolvedValue(mockUser),
    getTokens: jest.fn().mockResolvedValue(mockTokens),
    updateRefreshToken: jest.fn().mockResolvedValue(undefined),
    updateLastLogin: jest.fn().mockResolvedValue(undefined),
    getUserIfRefreshTokenMatches: jest.fn().mockResolvedValue(mockUser),
    logout: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(JwtRefreshGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'Test@1234',
        firstName: 'Test',
        lastName: 'User',
        role: Role.PATIENT,
      };

      const result = await controller.register(registerDto);
      expect(result).toBeInstanceOf(AuthResponseDto);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(authService.getTokens).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.email,
        mockUser.role,
        mockUser.tenantId,
      );
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Test@1234',
      };

      const result = await controller.login(loginDto, {} as Request);
      expect(result).toBeInstanceOf(AuthResponseDto);
      expect(authService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(authService.updateLastLogin).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('refreshTokens', () => {
    it('should refresh access token', async () => {
      const userId = '1';
      const refreshToken = 'valid-refresh-token';

      const result = await controller.refreshTokens(userId, refreshToken);
      expect(result).toBeInstanceOf(AuthResponseDto);
      expect(authService.getUserIfRefreshTokenMatches).toHaveBeenCalledWith(
        userId,
        refreshToken,
      );
    });
  });

  describe('logout', () => {
    it('should logout a user', async () => {
      const userId = '1';
      const result = await controller.logout(userId);
      expect(result).toEqual({ message: 'Successfully logged out' });
      expect(authService.logout).toHaveBeenCalledWith(userId);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const result = await controller.getProfile(mockUser);
      expect(result).toEqual(mockUser);
    });
  });
});
