import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    refreshTokens(userId: string, jti: string): Promise<AuthResponseDto>;
    register(registerDto: RegisterDto): Promise<import("./auth.service").UserWithRequiredFields>;
    : any;
}
