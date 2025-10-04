import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { Role } from '@prisma/client';
import { IsStrongPassword } from '../../common/validators/is-strong-password.decorator';
import { IsValidRole } from '../../common/validators/is-valid-role.decorator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ 
    example: 'StrongP@ssw0rd',
    description: 'Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)'
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword()
  password: string;

  @ApiProperty({ 
    enum: Role,
    example: 'USER',
    description: 'User role'
  })
  @IsValidRole()
  @IsNotEmpty({ message: 'Role is required' })
  role: Role;

  @ApiProperty({ example: 'John', required: false })
  @IsString({ message: 'First name must be a string' })
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsString({ message: 'Tenant ID must be a string' })
  @IsOptional()
  tenantId?: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean({ message: 'isActive must be a boolean' })
  @IsOptional()
  isActive: boolean = true;
}