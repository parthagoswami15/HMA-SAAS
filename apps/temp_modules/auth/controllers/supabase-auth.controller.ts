import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SupabaseAuthService, SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '../services/supabase-auth.service';
import { SupabaseAuthGuard } from '../guards/supabase-auth.guard';
import { Public } from '../decorators/public.decorator';

@Controller('auth/supabase')
export class SupabaseAuthController {
  constructor(private readonly supabaseAuthService: SupabaseAuthService) {}

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() credentials: SignInWithPasswordCredentials) {
    return this.supabaseAuthService.signInWithEmail(credentials);
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() credentials: SignUpWithPasswordCredentials) {
    return this.supabaseAuthService.signUp(credentials);
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SupabaseAuthGuard)
  async signOut(@Req() req: Request, @Res() res: Response) {
    await this.supabaseAuthService.signOut();
    return res.send({ success: true });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.supabaseAuthService.refreshSession(refreshToken);
  }

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
