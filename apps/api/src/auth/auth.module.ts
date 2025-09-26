import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { SupabaseJwtStrategy } from './strategies/supabase-jwt.strategy';
import { SupabaseAuthService } from './services/supabase-auth.service';
import { SupabaseAuthController } from './controllers/supabase-auth.controller';
import { TestAuthController } from './controllers/test-auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TokenModule } from './services/token.module';
import { DeviceFingerprintModule } from './device-fingerprint.module';
import { IpRateLimitGuard } from './guards/ip-rate-limit.guard';
import { PublicRouteGuard } from './guards/public-route.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    TokenModule,
    CacheModule.register(),
    PassportModule.register({ 
      defaultStrategy: 'jwt',
      session: false, // We're using JWT, not sessions
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: 1000, // 1 second
            limit: 10, // 10 requests per second
          },
          // Login specific rate limiting (5 requests per minute)
          {
            name: 'login',
            ttl: 60000, // 1 minute
            limit: 5, // 5 requests per minute
          },
        ],
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION', '15m'),
        },
      }),
    }),
  ],
  controllers: [AuthController, SupabaseAuthController, TestAuthController],
  providers: [
    AuthService, 
    JwtStrategy,
    JwtAuthGuard,
    JwtRefreshStrategy,
    SupabaseJwtStrategy,
    SupabaseAuthService,
    JwtRefreshStrategy,
    {
      provide: APP_GUARD,
      useClass: PublicRouteGuard,
    },
    {
      provide: APP_GUARD,
      useClass: IpRateLimitGuard,
    },
  ],
  exports: [
    AuthService, 
    JwtModule, 
    PassportModule,
  ],
})
export class AuthModule {}
