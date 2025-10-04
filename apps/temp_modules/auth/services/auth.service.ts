import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { TokenPayload, AuthTokens, AuthUser } from '../interfaces/auth.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<AuthUser> {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(registerDto.password, this.SALT_ROUNDS);

      // Create user with default PATIENT role if not specified
      const userRole = registerDto.role || 'PATIENT';

      // Create user in the database
      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          passwordHash,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          role: userRole as any, // Cast to any to match Prisma's generated types
          isActive: true,
          tenant: {
            create: {
              name: `${registerDto.firstName}'s Tenant`,
              slug: `${registerDto.firstName.toLowerCase()}-${Date.now()}`,
            },
          },
        },
        include: {
          tenant: true,
        },
      });

      // Map to AuthUser interface
      return {
        id: user.id,
        sub: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  /**
   * Validate user credentials
   */
  async validateUser(email: string, password: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Account is deactivated');
    }

    // Map to AuthUser interface
    return {
      id: user.id,
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Login user and generate tokens
   */
  async login(user: AuthUser): Promise<AuthTokens> {
    return this.generateTokens(user);
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(user: AuthUser): Promise<AuthTokens> {
    const jti = uuidv4();
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as any,
      tenantId: user.tenantId,
      jti,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
      }),
    ]);

    // Store refresh token in database for validation
    await this.prisma.refreshToken.create({
      data: {
        jti,
        userId: user.id,
        token: await bcrypt.hash(refreshToken, this.SALT_ROUNDS),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        isRevoked: false,
      },
    });

    return { accessToken, refreshToken };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Check if token is blacklisted
      const tokenRecord = await this.prisma.refreshToken.findUnique({
        where: { jti: payload.jti },
      });

      if (!tokenRecord || tokenRecord.isRevoked) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Get user from database
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Revoke the old refresh token
      await this.prisma.refreshToken.update({
        where: { jti: payload.jti },
        data: { isRevoked: true },
      });

      // Generate new tokens
      return this.generateTokens({
        id: user.id,
        sub: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId || undefined,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user by revoking refresh token
   */
  async logout(jti: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { jti },
      data: { isRevoked: true },
    });
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Map to AuthUser interface
    return {
      id: user.id,
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
