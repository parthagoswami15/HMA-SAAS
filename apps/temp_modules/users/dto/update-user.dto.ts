import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, IsBoolean, Validate } from 'class-validator';
import { IsStrongPassword } from '../../common/validators/is-strong-password.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: false, description: 'Current password (required when changing password)' })
  @IsString({ message: 'Current password must be a string' })
  @IsOptional()
  currentPassword?: string;

  @ApiProperty({ 
    required: false,
    description: 'New password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)'
  })
  @IsString({ message: 'New password must be a string' })
  @IsOptional()
  @IsStrongPassword()
  newPassword?: string;

  @ApiProperty({ required: false, description: 'Confirm new password' })
  @IsString({ message: 'Confirm password must be a string' })
  @IsOptional()
  confirmNewPassword?: string;

  @ApiProperty({ required: false })
  @IsBoolean({ message: 'isActive must be a boolean' })
  @IsOptional()
  isActive?: boolean;

  // Add validation method
  validate?(): void {
    if (this.newPassword && this.newPassword !== this.confirmNewPassword) {
      throw new Error('New password and confirm password do not match');
    }
  }
}