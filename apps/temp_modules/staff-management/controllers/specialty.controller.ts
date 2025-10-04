import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  Put, 
  Delete, 
  UseGuards, 
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SpecialtyService } from '../services/specialty.service';
import { 
  SpecialtyResponseDto, 
  CreateSpecialtyDto, 
  UpdateSpecialtyDto, 
  SpecialtyFilterDto,
  SpecialtyListResponseDto,
  StaffSpecialtyResponseDto,
  CreateStaffSpecialtyDto,
  UpdateStaffSpecialtyDto,
  SpecialtyCountResponseDto,
} from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../user/enums';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { IUser } from '../../user/interfaces';
import { PaginatedResponse } from '../../common/interfaces';

@ApiTags('Specialty Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('specialties')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new specialty' })
  @ApiResponse({ status: 201, description: 'Specialty created successfully', type: SpecialtyResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'Specialty with this code already exists' })
  async create(
    @CurrentUser() user: IUser,
    @Body() createSpecialtyDto: CreateSpecialtyDto,
  ): Promise<SpecialtyResponseDto> {
    return this.specialtyService.create(user.tenantId, createSpecialtyDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get all specialties with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'List of specialties', type: SpecialtyListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @CurrentUser() user: IUser,
    @Query() filterDto: SpecialtyFilterDto,
  ): Promise<PaginatedResponse<SpecialtyResponseDto>> {
    return this.specialtyService.findAll(user.tenantId, filterDto);
  }

  @Get('count-by-specialty')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD)
  @ApiOperation({ summary: 'Get staff count by specialty' })
  @ApiResponse({ status: 200, description: 'Staff count by specialty', type: [SpecialtyCountResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async countBySpecialty(
    @CurrentUser() user: IUser,
  ): Promise<Array<{ specialtyId: string; specialtyName: string; count: number }>> {
    return this.specialtyService.getCountBySpecialty(user.tenantId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get a specialty by ID' })
  @ApiResponse({ status: 200, description: 'Specialty details', type: SpecialtyResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Specialty not found' })
  async findOne(
    @CurrentUser() user: IUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<SpecialtyResponseDto> {
    return this.specialtyService.findById(user.tenantId, id);
  }

  @Get('code/:code')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get a specialty by code' })
  @ApiResponse({ status: 200, description: 'Specialty details', type: SpecialtyResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Specialty not found' })
  async findByCode(
    @CurrentUser() user: IUser,
    @Param('code') code: string,
  ): Promise<SpecialtyResponseDto> {
    const specialty = await this.specialtyService.findByCode(user.tenantId, code);
    if (!specialty) {
      throw new Error(`Specialty with code '${code}' not found`);
    }
    return specialty;
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update a specialty' })
  @ApiResponse({ status: 200, description: 'Specialty updated', type: SpecialtyResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Specialty not found' })
  @ApiResponse({ status: 409, description: 'Specialty with this code already exists' })
  async update(
    @CurrentUser() user: IUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateSpecialtyDto: UpdateSpecialtyDto,
  ): Promise<SpecialtyResponseDto> {
    return this.specialtyService.update(user.tenantId, id, updateSpecialtyDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specialty (soft delete)' })
  @ApiResponse({ status: 204, description: 'Specialty deleted' })
  @ApiResponse({ status: 400, description: 'Cannot delete specialty assigned to staff' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Specialty not found' })
  async remove(
    @CurrentUser() user: IUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.specialtyService.delete(user.tenantId, id);
  }

  // Staff Specialty Endpoints

  @Post('staff/:staffId')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD)
  @ApiOperation({ summary: 'Assign specialties to a staff member' })
  @ApiResponse({ status: 200, description: 'Specialties assigned successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Staff member or specialty not found' })
  async assignSpecialties(
    @CurrentUser() user: IUser,
    @Param('staffId', new ParseUUIDPipe()) staffId: string,
    @Body() specialties: CreateStaffSpecialtyDto[],
  ): Promise<{ success: boolean }> {
    return this.specialtyService.assignSpecialtiesToStaff(user.tenantId, staffId, specialties);
  }

  @Put('staff/:staffId')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD)
  @ApiOperation({ summary: 'Update staff specialties (replaces all existing)' })
  @ApiResponse({ status: 200, description: 'Specialties updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Staff member or specialty not found' })
  async updateStaffSpecialties(
    @CurrentUser() user: IUser,
    @Param('staffId', new ParseUUIDPipe()) staffId: string,
    @Body() specialties: CreateStaffSpecialtyDto[],
  ): Promise<{ success: boolean }> {
    return this.specialtyService.updateStaffSpecialties(user.tenantId, staffId, specialties);
  }

  @Get('staff/:staffId')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get all specialties for a staff member' })
  @ApiResponse({ status: 200, description: 'List of staff specialties', type: [StaffSpecialtyResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  async getStaffSpecialties(
    @Param('staffId', new ParseUUIDPipe()) staffId: string,
  ): Promise<StaffSpecialtyResponseDto[]> {
    return this.specialtyService.getStaffSpecialties(staffId);
  }

  @Put('staff/:staffId/specialty/:specialtyId')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD)
  @ApiOperation({ summary: 'Update a staff member\'s specialty' })
  @ApiResponse({ status: 200, description: 'Staff specialty updated', type: StaffSpecialtyResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Staff member or specialty not found' })
  async updateStaffSpecialty(
    @CurrentUser() user: IUser,
    @Param('staffId', new ParseUUIDPipe()) staffId: string,
    @Param('specialtyId', new ParseUUIDPipe()) specialtyId: string,
    @Body() updateData: UpdateStaffSpecialtyDto,
  ): Promise<StaffSpecialtyResponseDto> {
    return this.specialtyService.updateStaffSpecialty(
      user.tenantId,
      staffId,
      specialtyId,
      updateData,
    );
  }

  @Delete('staff/:staffId/specialty/:specialtyId')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a specialty from a staff member' })
  @ApiResponse({ status: 204, description: 'Specialty removed from staff' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Staff member or specialty not found' })
  async removeStaffSpecialty(
    @Param('staffId', new ParseUUIDPipe()) staffId: string,
    @Param('specialtyId', new ParseUUIDPipe()) specialtyId: string,
  ): Promise<void> {
    await this.specialtyService.updateStaffSpecialty(
      '', // tenantId not needed for removal
      staffId,
      specialtyId,
      { remove: true },
    );
  }
}
