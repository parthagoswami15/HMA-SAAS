import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, Prisma } from '@prisma/client';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantResponseDto } from './dto/tenant-response.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';

@ApiTags('Tenants')
@ApiBearerAuth()
@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiResponse({ status: 404, description: 'Not Found' })
@ApiResponse({ status: 409, description: 'Conflict - Tenant with this slug already exists' })
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new tenant (hospital/clinic/lab)' })
  @ApiCreatedResponse({
    description: 'The tenant has been successfully created',
    type: TenantResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Insufficient permissions' })
  @ApiConflictResponse({ description: 'A tenant with this slug already exists' })
  async create(@Body() createTenantDto: CreateTenantDto): Promise<TenantResponseDto> {
    return this.tenantsService.create(createTenantDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN)
  @ApiOperation({ 
    summary: 'Get all tenants with pagination',
    description: 'Retrieves a paginated list of tenants. By default, only active tenants are returned.'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (1-based)',
    type: Number,
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
    example: 10
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for filtering tenants by name or slug',
    type: String,
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status',
    type: Boolean,
  })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    description: 'Include soft-deleted tenants in the results',
    type: Boolean,
    default: false
  })
  @ApiPaginatedResponse(TenantResponseDto)
  @ApiBadRequestResponse({ description: 'Invalid pagination parameters' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Insufficient permissions' })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('search') search?: string,
    @Query('isActive') isActive?: boolean,
    @Query('includeDeleted') includeDeleted = false,
  ): Promise<PaginatedResponseDto<TenantResponseDto>> {
    // Prevent too large page sizes
    const take = Math.min(100, limit);
    const skip = (page - 1) * take;

    const where: Prisma.TenantWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { slug: { contains: search } },
      ];
    }

    // Create base where clause
    const baseWhere: Prisma.TenantWhereInput = where;

    const [items, total] = await Promise.all([
      this.tenantsService.findAll({
        skip,
        take,
        where: baseWhere,
        includeDeleted: includeDeleted === true,
      }),
      this.tenantsService.count(baseWhere),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN)
  @ApiOperation({ 
    summary: 'Get a tenant by ID',
    description: 'Retrieves a tenant by ID. By default, only returns non-deleted tenants.'
  })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    description: 'Include soft-deleted tenant in the result',
    type: Boolean,
    default: false
  })
  @ApiOkResponse({ type: TenantResponseDto })
  @ApiNotFoundResponse({ description: 'Tenant not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Insufficient permissions' })
  async findOne(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted = false,
  ): Promise<TenantResponseDto> {
    return this.tenantsService.findOne(id, includeDeleted === true);
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a tenant' })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  @ApiOkResponse({ description: 'Tenant updated', type: TenantResponseDto })
  @ApiNotFoundResponse({ description: 'Tenant not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Insufficient permissions' })
  @ApiConflictResponse({ description: 'A tenant with this slug already exists' })
  async update(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ): Promise<TenantResponseDto> {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a tenant (soft delete)' })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  @ApiNoContentResponse({ description: 'Tenant deleted successfully' })
  @ApiNotFoundResponse({ description: 'Tenant not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Insufficient permissions' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.tenantsService.remove(id);
  }

  @Get('check-slug/:slug')
  @ApiOperation({ summary: 'Check if a slug is available' })
  @ApiParam({ name: 'slug', description: 'Slug to check' })
  @ApiQuery({
    name: 'excludeId',
    required: false,
    description: 'Exclude a tenant ID from the check (useful for updates)',
    type: String,
  })
  @ApiOkResponse({
    description: 'Slug availability check result',
    schema: {
      type: 'object',
      properties: {
        available: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async checkSlug(
    @Param('slug') slug: string,
    @Query('excludeId') excludeId?: string,
  ): Promise<{ available: boolean; message: string }> {
    const isTaken = await this.tenantsService.isSlugTaken(slug, excludeId);
    return {
      available: !isTaken,
      message: isTaken ? 'Slug is already taken' : 'Slug is available',
    };
  }
}
