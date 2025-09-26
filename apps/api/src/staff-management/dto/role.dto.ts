import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsBoolean, 
  IsOptional, 
  IsArray, 
  IsUUID,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoleDto {
  @ApiProperty({ description: 'Name of the role (must be unique within tenant)' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the role' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Whether this is a system role (cannot be modified)',
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isSystem?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Whether the role is active',
    default: true 
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({ 
    description: 'Array of permission keys to assign to this role',
    type: [String],
    example: ['staff:create', 'staff:read'] 
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[] = [];
}

export class UpdateRoleDto {
  @ApiPropertyOptional({ description: 'New name for the role' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Updated description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Whether the role is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'Array of permission keys to assign to this role',
    type: [String],
    example: ['staff:create', 'staff:read'] 
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];
}

export class AssignRoleDto {
  @ApiProperty({ 
    description: 'ID of the staff member',
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @IsUUID()
  @IsNotEmpty()
  staffId: string;

  @ApiProperty({ 
    description: 'ID of the role to assign',
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @ApiPropertyOptional({ 
    description: 'Whether this should be the primary role',
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean = false;
}

export class RoleResponseDto {
  @ApiProperty({ description: 'Role ID' })
  id: string;

  @ApiProperty({ description: 'Tenant ID' })
  tenantId: string;

  @ApiProperty({ description: 'Role name' })
  name: string;

  @ApiPropertyOptional({ description: 'Role description' })
  description?: string;

  @ApiProperty({ description: 'Whether this is a system role' })
  isSystem: boolean;

  @ApiProperty({ description: 'Whether the role is active' })
  isActive: boolean;

  @ApiProperty({ 
    description: 'List of permissions assigned to this role',
    type: [String],
    example: ['staff:create', 'staff:read'] 
  })
  permissions: string[];

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class RoleWithPermissionsDto extends RoleResponseDto {
  @ApiProperty({ 
    description: 'Detailed permission objects',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        key: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        module: { type: 'string' },
        isActive: { type: 'boolean' }
      }
    }
  })
  permissionDetails: Array<{
    id: string;
    key: string;
    name: string;
    description?: string;
    module: string;
    isActive: boolean;
  }>;
}
