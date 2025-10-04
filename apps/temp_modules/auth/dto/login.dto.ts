import { ApiProperty } from '@nestjs/swagger';
import { BaseAuthDto } from './base-auth.dto';

export class LoginDto extends BaseAuthDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  declare email: string;

  @ApiProperty({
    example: 'your-secure-password',
    description: 'User password (min 8 characters)',
    minLength: 8,
  })
  declare password: string;

  @ApiProperty({
    example: '192.168.1.1',
    description: 'IP address of the client',
    required: false,
  })
  ipAddress?: string;

  @ApiProperty({
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    description: 'User agent string of the client',
    required: false,
  })
  userAgent?: string;
}
