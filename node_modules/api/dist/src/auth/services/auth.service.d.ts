import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from '../dto/register.dto';
import { AuthTokens, AuthUser } from '../interfaces/auth.interface';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly SALT_ROUNDS;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<AuthUser>;
    validateUser(email: string, password: string): Promise<AuthUser>;
    login(user: AuthUser): Promise<AuthTokens>;
    private generateTokens;
    refreshTokens(refreshToken: string): Promise<AuthTokens>;
    logout(jti: string): Promise<void>;
    getProfile(userId: string): Promise<AuthUser>;
}
