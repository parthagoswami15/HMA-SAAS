import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CustomPrismaService } from '../../prisma/custom-prisma.service';
import { User, Role } from '@prisma/client';

export interface TokenPayload {
  sub: string; // user id
  email: string;
  role: Role;
  tenantId: string;
  jti: string;
  iat?: number;
  exp?: number;
  type?: 'access' | 'refresh';
}

type UserWithRequiredFields = {
  id: string;
  email: string;
  role: Role;
  tenantId: string;
  [key: string]: any; // Allow additional properties
};

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: CustomPrismaService,
  ) {}

  private readonly logger = new Logger(TokenService.name);

  async generateTokens(user: UserWithRequiredFields, jti: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(user, jti),
        this.generateRefreshToken(user, jti),
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(`Error generating tokens: ${error.message}`, error.stack);
      throw new Error('Failed to generate authentication tokens');
    }
  }

  private async generateAccessToken(user: UserWithRequiredFields, jti: string): Promise<string> {
    try {
      const payload: TokenPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        jti,
        type: 'access',
      };

      const token = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION', '15m'),
      });

      return token;
    } catch (error) {
      this.logger.error(`Error generating access token: ${error.message}`, error.stack);
      throw new Error('Failed to generate access token');
    }
  }

  private async generateRefreshToken(user: UserWithRequiredFields, jti: string): Promise<string> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      jti,
      type: 'refresh',
    } as const;

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
    });
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });

      // Verify token is not blacklisted
      const tokenEntry = await this.prisma.findTokenByJti(payload.jti);

      if (tokenEntry && tokenEntry.revoked) {
        throw new UnauthorizedException('Token has been revoked');
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload & { type?: string }>(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Verify this is a refresh token
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Verify token is not blacklisted
      const tokenEntry = await this.prisma.findTokenByJti(payload.jti);

      if (tokenEntry && tokenEntry.revoked) {
        throw new UnauthorizedException('Token has been revoked');
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async revokeToken(jti: string, userId: string, token: string, expiresAt: Date): Promise<void> {
    await this.prisma.upsertTokenBlacklist({
      jti,
      userId,
      token: await this.hashToken(token),
      expiresAt,
      revoked: true,
      reason: 'Token was explicitly revoked',
    });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    // Mark all user's refresh tokens as revoked
    await this.prisma.revokeAllUserTokens(userId);
  }

  private async hashToken(token: string): Promise<string> {
    // In a real implementation, you'd want to hash the token before storing it
    // For example, using bcrypt: return bcrypt.hash(token, 10);
    // For now, we'll just return a truncated hash for demonstration
    return Buffer.from(token).toString('base64').substring(0, 255);
  }
}
