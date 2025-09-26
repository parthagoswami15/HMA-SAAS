import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

// Extended JWT payload with our custom claims
interface ExtendedJwtPayload extends JwtPayload {
  jti: string; // JWT ID
  iat: number; // Issued at
  exp: number; // Expiration time
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const jwtConfig: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Try to get token from Authorization header first
          const authHeader = request?.headers?.['authorization'];
          if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7); // Remove 'Bearer ' prefix
          }
          
          // Fall back to cookies if using httpOnly cookies
          return request?.cookies?.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') || 'fallback-secret',
    };

    super(jwtConfig);
  }

  async validate(
    req: Request,
    payload: ExtendedJwtPayload,
  ): Promise<{ userId: string; email: string; role: string; tenantId: string; jti: string }> {
    // Type assertion to ensure the payload has the required fields
    const tokenPayload = payload as ExtendedJwtPayload;

    // Check if token is blacklisted
    const isBlacklisted = await this.prisma.tokenBlacklist.findUnique({
      where: { jti: tokenPayload.jti },
    });

    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been revoked');
    }

    // Check if user exists and is active
    const user = await this.prisma.user.findUnique({
      where: { id: tokenPayload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        tenantId: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Verify tenant access if tenantId is provided in the request
    const tenantId = this.getTenantIdFromRequest(req) || tokenPayload.tenantId;
    if (tenantId && user.tenantId !== tenantId) {
      throw new UnauthorizedException('Invalid tenant access');
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
jti: tokenPayload.jti,
    };
  }

  private getTenantIdFromRequest(req: Request): string | undefined {
    // Try to get tenantId from headers
    const tenantHeader = req.headers?.['x-tenant-id'];
    if (tenantHeader) {
      return Array.isArray(tenantHeader) ? tenantHeader[0] : tenantHeader;
    }
    
    // Try to get from query params
    const query = req.query as { tenantId?: string };
    if (query?.tenantId) {
      return query.tenantId;
    }
    
    // Try to get from request body
    const body = req.body as { tenantId?: string };
    if (body?.tenantId) {
      return body.tenantId;
    }
    
    return undefined;
  }
}
