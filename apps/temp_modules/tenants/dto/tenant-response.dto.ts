import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Tenant } from '@prisma/client';
import { TenantType } from '../enums/tenant-type.enum';
import { Expose, Transform } from 'class-transformer';

@Expose()
export class TenantResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the tenant',
  })
  id: string;

  @ApiProperty({
    example: 'City General Hospital',
    description: 'Name of the tenant',
  })
  name: string;

  @ApiProperty({
    example: 'city-general',
    description: 'URL-friendly identifier for the tenant',
  })
  slug: string;

  @ApiProperty({
    enum: TenantType,
    example: TenantType.HOSPITAL,
    description: 'Type of healthcare facility',
  })
  type: TenantType;

  @ApiPropertyOptional({
    example: '123 Main St, City',
    description: 'Physical address of the facility',
    nullable: true,
  })
  address: string | null;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Contact phone number',
    nullable: true,
  })
  phone: string | null;

  @ApiPropertyOptional({
    example: 'contact@hospital.com',
    description: 'Contact email address',
    nullable: true,
  })
  email: string | null;

  @ApiPropertyOptional({
    example: 'https://example.com/logo.png',
    description: 'URL to the tenant\'s logo',
    nullable: true,
  })
  logo: string | null;

  @ApiProperty({
    description: 'Whether the tenant is active',
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'When the tenant was created',
    type: 'string',
    format: 'date-time',
  })
  @Transform(({ value }) => value?.toISOString())
  createdAt: Date;

  @ApiProperty({
    description: 'When the tenant was last updated',
    type: 'string',
    format: 'date-time',
  })
  @Transform(({ value }) => value?.toISOString())
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'When the tenant was soft deleted',
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  @Transform(({ value }) => value?.toISOString())
  deletedAt: Date | null;

  constructor(partial: Partial<Tenant>) {
    // Assign all properties from the partial object
    Object.assign(this, partial);
    
    // Ensure proper typing for date fields
    this.createdAt = partial.createdAt ? new Date(partial.createdAt) : new Date();
    this.updatedAt = partial.updatedAt ? new Date(partial.updatedAt) : new Date();
    this.deletedAt = partial.deletedAt ? new Date(partial.deletedAt) : null;
    
    // Ensure optional fields are properly set
    this.address = (partial as any).address ?? null;
    this.phone = (partial as any).phone ?? null;
    this.email = (partial as any).email ?? null;
    this.logo = (partial as any).logo ?? null;
  }
}
