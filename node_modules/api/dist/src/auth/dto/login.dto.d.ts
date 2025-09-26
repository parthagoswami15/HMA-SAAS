import { BaseAuthDto } from './base-auth.dto';
export declare class LoginDto extends BaseAuthDto {
    email: string;
    password: string;
    ipAddress?: string;
    userAgent?: string;
}
