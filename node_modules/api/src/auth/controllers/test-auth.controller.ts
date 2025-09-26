import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../guards/supabase-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthUser } from '../decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth/test')
export class TestAuthController {
  @Get('public')
  @ApiOperation({ summary: 'Public test endpoint' })
  @ApiResponse({ status: 200, description: 'Public endpoint works' })
  publicEndpoint() {
    return { message: 'This is a public endpoint' };
  }

  @Get('protected')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Protected test endpoint' })
  @ApiResponse({ status: 200, description: 'Protected endpoint works' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  protectedEndpoint(@CurrentUser() user: AuthUser) {
    return { 
      message: 'This is a protected endpoint',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    };
  }

  @Get('admin')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin test endpoint' })
  @ApiResponse({ status: 200, description: 'Admin endpoint works' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async adminEndpoint(@CurrentUser() user: AuthUser) {
    // This is just an example - in a real app, you'd want to check the user's role
    // from your database or from the JWT claims
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';
    
    if (!isAdmin) {
      return {
        statusCode: 403,
        message: 'Forbidden - Admin access required',
      };
    }

    return { 
      message: 'This is an admin-only endpoint',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    };
  }
}
