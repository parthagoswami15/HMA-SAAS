import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiBody, 
  ApiCookieAuth 
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Public } from './decorators/public.decorator';
import { GetCurrentUserId, GetCurrentUser } from './get-current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import type { User } from '@prisma/client';


@ApiTags('Authentication')
@Controller('auth')
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiResponse({ status: 404, description: 'Not Found' })
@ApiResponse({ status: 429, description: 'Too Many Requests' })
@ApiResponse({ status: 500, description: 'Internal Server Error' })
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Public()
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Token successfully refreshed', 
    type: AuthResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid refresh token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid refresh token',
        error: 'Unauthorized'
      }
    }
  })
  async refreshTokens(
    @GetCurrentUserId() userId: string, 
    @GetCurrentUser('jti') jti: string
  ): Promise<AuthResponseDto> {
    // Get user with tenant
    const user = await this.authService.getProfile(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate new tokens
    const tokens = await this.authService.getTokens(
      user.id, 
      user.email, 
      user.role, 
      user.tenantId
    );
    
    // Invalidate old refresh token and store new one
    await this.authService.updateRefreshToken(userId, tokens.refreshToken, jti);
    
    // Create a proper user object with all required fields
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tenantId: user.tenantId,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt
    };
    
    return new AuthResponseDto(userResponse, tokens);
  }


  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with the provided details. The user will be assigned the PATIENT role by default.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully',
    type: AuthResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: 'Bad Request',
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - Email already in use',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email already in use',
        error: 'Conflict'
      }
    }
  })
  @ApiBody({
    description: 'User registration data',
    type: RegisterDto,
    examples: {
      basic: {
        summary: 'Basic registration',
        value: {
          email: 'user@example.com',
          password: 'securePassword123!',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890'
        } as RegisterDto
      },
      full: {
        summary: 'Full registration with all fields',
        value: {
          email: 'user@example.com',
          password: 'securePassword123!',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
          dateOfBirth: '1990-01-01',
          gender: 'MALE',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          postalCode: '10001'
        } as RegisterDto
      }
    }
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user and returns access and refresh tokens. Rate limited to 5 requests per minute.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Missing or invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: 'Email and password are required',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Account is deactivated',
    schema: {
      example: {
        statusCode: 403,
        message: 'Account is deactivated',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({ 
    status: 429, 
    description: 'Too Many Requests - Rate limit exceeded',
    schema: {
      example: {
        statusCode: 429,
        message: 'ThrottlerException: Too Many Requests',
        error: 'Too Many Requests'
      }
    }
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseDto> {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.authService.getTokens(user.id, user.email, user.role, user.tenantId);
    
    // Store refresh token
    await this.authService.updateRefreshToken(user.id, tokens.refreshToken, tokens.jti);
    
    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Create a proper user response object with only the fields needed for the client
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tenantId: user.tenantId,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt
    };
    
    return new AuthResponseDto(userResponse, tokens);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'User logout',
    description: 'Logs out the current user and invalidates the refresh token.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully logged out',
    schema: {
      example: {
        message: 'Successfully logged out'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized'
      }
    }
  })
  async logout(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('jti') jti: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ message: string }> {
    await this.authService.logout(userId, jti);
    
    // Clear cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    
    return { message: 'Successfully logged out' };
  }

  @Post('logout/all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout from all devices' })
  @ApiResponse({ status: 200, description: 'Successfully logged out from all devices' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  async logoutAllDevices(
    @GetCurrentUserId() userId: string,
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.logoutAllDevices(userId);
    
    // Clear the refresh token cookie
    res.clearCookie('refresh_token', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { success: true };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  async getProfile(
    @GetCurrentUserId() userId: string
  ) {
    return this.authService.getProfile(userId);
  }

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  healthCheck() {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0'
    };
  }
}
