import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

// Extended JWT payload with refresh token specific fields
interface RefreshTokenPayload extends JwtPayload {
  jti: string;
  iat: number;
  exp: number;
  type: 'refresh';
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const jwtConfig: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Try to get token from Authorization header
          const authHeader = request?.headers?.['authorization'];
          if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7); // Remove 'Bearer ' prefix
          }
          
          // Fall back to cookies if using httpOnly cookies
          return request?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET') || 'fallback-refresh-secret',
      ignoreExpiration: false,
    };

    super(jwtConfig);
  }

  async validate(
    req: Request,
    payload: RefreshTokenPayload,
  ): Promise<RefreshTokenPayload & { refreshToken: string }> {
    // Verify this is a refresh token
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    // Check if token is blacklisted
    const isBlacklisted = await this.prisma.tokenBlacklist.findUnique({
      where: { jti: payload.jti },
    });

    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been revoked');
    }

    // Check if user exists and is active
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Extract the refresh token from the request
    let refreshToken: string;
    const authHeader = req.headers?.['authorization'];
    if (authHeader && typeof authHeader === 'string') {
      refreshToken = authHeader.replace('Bearer', '').trim();
    } else if (req.cookies?.refreshToken) {
      refreshToken = req.cookies.refreshToken;
    } else {
      throw new UnauthorizedException('Refresh token not found');
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
