import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, HttpStatus, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { PatientsService } from './patients.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PatientRateLimiterGuard } from '../common/guards/patient-rate-limiter.guard';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('Patients')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), PatientRateLimiterGuard)
// Skip rate limiting for health checks and metrics endpoints
@SkipThrottle(false)
@Controller('patients')
export class PatientsController {
  constructor(private patients: PatientsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Throttle(5, 60) // 5 requests per minute
  @ApiOperation({ 
    summary: 'Create a new patient', 
    description: 'Creates a new patient record in the system. Required fields: firstName, lastName.'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Patient created successfully', 
    type: PatientResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Patient with this email or MRN already exists' 
  })
  async create(
    @CurrentUser() user: { tenantId: string },
    @Body() dto: CreatePatientDto
  ) {
    return this.patients.create(user.tenantId, dto);
      }

  @Get()
  @ApiOperation({ 
    summary: 'List patients', 
    description: 'Retrieves a paginated list of patients with optional search and filtering' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Paginated list of patients',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/PatientResponseDto' }
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 100 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 10 }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid query parameters' 
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number, 
    description: 'Page number (starts from 1)' 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Number of items per page (max 100)' 
  })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    type: String, 
    description: 'Search term to filter patients by name, email, or MRN' 
  })
  @ApiQuery({ 
    name: 'status', 
    required: false, 
    enum: ['active', 'inactive', 'all'],
    description: 'Filter by patient status' 
  })
  async list(
    @CurrentUser() user: { tenantId: string },
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('status') status: 'active' | 'inactive' | 'all' = 'active'
  ) {
    // Validate page and limit
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));
    
    return this.patients.list(
      user.tenantId,
      pageNum,
      limitNum,
      search,
      status
    );
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get patient by ID', 
    description: 'Retrieves detailed information about a specific patient' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Patient ID', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    type: Boolean,
    description: 'Include soft-deleted patients',
    example: false
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Patient details', 
    type: PatientResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Patient not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  async get(
    @CurrentUser() user: { tenantId: string },
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted: boolean = false
  ) {
    return this.patients.findOne(user.tenantId, id, includeDeleted);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, skipMissingProperties: true }))
  @ApiOperation({ 
    summary: 'Update patient', 
    description: 'Updates an existing patient record. Only non-deleted patients can be updated.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Patient ID', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Patient updated successfully', 
    type: PatientResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Patient not found or has been soft-deleted' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'A patient with this email already exists' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data' 
  })
  async update(
    @CurrentUser() user: { tenantId: string },
    @Param('id') id: string, 
    @Body() dto: UpdatePatientDto
  ) {
    return this.patients.update(user.tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete patient', 
    description: 'Soft deletes a patient record. Use the hardDelete query parameter to permanently delete.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Patient ID', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @ApiQuery({
    name: 'hardDelete',
    required: false,
    type: Boolean,
    description: 'Permanently delete the patient record (admin only)',
    example: false
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Patient deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Patient deleted successfully' }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Patient not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Insufficient permissions for hard delete' 
  })
  async remove(
    @CurrentUser() user: { tenantId: string },
    @Param('id') id: string,
    @Query('hardDelete') hardDelete: boolean = false
  ) {
    // In a real app, you would check user permissions here
    // For example: if (hardDelete && !req.user.isAdmin()) {
    //   throw new ForbiddenException('Only admins can perform hard deletes');
    // }
    
    const result = await this.patients.remove(user.tenantId, id, hardDelete);
    return {
      ...result,
      message: hardDelete 
        ? 'Patient permanently deleted successfully' 
        : 'Patient soft-deleted successfully'
    };
  }
}
