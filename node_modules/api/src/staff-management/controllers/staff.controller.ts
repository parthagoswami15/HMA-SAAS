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
import { StaffService } from '../services/staff.service';
import { 
  StaffResponseDto, 
  CreateStaffDto, 
  UpdateStaffDto, 
  StaffFilterDto,
  StaffListResponseDto,
  StaffCountResponseDto,
  RecentStaffResponseDto,
} from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../user/enums';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { IUser } from '../../user/interfaces';
import { PaginatedResponse } from '../../common/interfaces';

@ApiTags('Staff Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new staff member' })
  @ApiResponse({ status: 201, description: 'Staff member created successfully', type: StaffResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'Conflict - Employee ID or email already in use' })
  async create(
    @CurrentUser() user: IUser,
    @Body() createStaffDto: CreateStaffDto,
  ): Promise<StaffResponseDto> {
    return this.staffService.create(user.tenantId, createStaffDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD)
  @ApiOperation({ summary: 'Get all staff members with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'List of staff members', type: StaffListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @CurrentUser() user: IUser,
    @Query() filterDto: StaffFilterDto,
  ): Promise<PaginatedResponse<StaffResponseDto>> {
    return this.staffService.findAll(user.tenantId, filterDto);
  }

  @Get('recent')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD)
  @ApiOperation({ summary: 'Get recently added staff members' })
  @ApiResponse({ status: 200, description: 'List of recent staff members', type: [RecentStaffResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findRecent(
    @CurrentUser() user: IUser,
    @Query('limit') limit = 5,
  ): Promise<RecentStaffResponseDto[]> {
    return this.staffService.getRecent(user.tenantId, Number(limit));
  }

  @Get('count-by-type')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD)
  @ApiOperation({ summary: 'Get staff count by type' })
  @ApiResponse({ status: 200, description: 'Staff count by type', type: [StaffCountResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async countByType(
    @CurrentUser() user: IUser,
  ): Promise<{ type: string; count: number }[]> {
    return this.staffService.getCountByType(user.tenantId);
  }

  @Get('count-by-department')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD)
  @ApiOperation({ summary: 'Get staff count by department' })
  @ApiResponse({ status: 200, description: 'Staff count by department', type: [StaffCountResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async countByDepartment(
    @CurrentUser() user: IUser,
  ): Promise<{ departmentId: string | null; departmentName: string; count: number }[]> {
    return this.staffService.getCountByDepartment(user.tenantId);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current staff profile' })
  @ApiResponse({ status: 200, description: 'Staff profile', type: StaffResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyProfile(
    @CurrentUser() user: IUser,
  ): Promise<StaffResponseDto> {
    return this.staffService.findByUserId(user.tenantId, user.id);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD)
  @ApiOperation({ summary: 'Get a staff member by ID' })
  @ApiResponse({ status: 200, description: 'Staff member details', type: StaffResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  async findOne(
    @CurrentUser() user: IUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<StaffResponseDto> {
    return this.staffService.findById(user.tenantId, id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update a staff member' })
  @ApiResponse({ status: 200, description: 'Staff member updated', type: StaffResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  @ApiResponse({ status: 409, description: 'Conflict - Employee ID already in use' })
  async update(
    @CurrentUser() user: IUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ): Promise<StaffResponseDto> {
    return this.staffService.update(user.tenantId, id, updateStaffDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a staff member (soft delete)' })
  @ApiResponse({ status: 204, description: 'Staff member deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  async remove(
    @CurrentUser() user: IUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.staffService.delete(user.tenantId, id);
  }

  @Post('bulk/status')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk update staff status' })
  @ApiResponse({ status: 200, description: 'Staff status updated', type: Object })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async bulkUpdateStatus(
    @CurrentUser() user: IUser,
    @Body('ids') ids: string[],
    @Body('status') status: string,
  ): Promise<{ count: number }> {
    if (!ids || !ids.length) {
      throw new Error('No staff IDs provided');
    }
    
    if (!status) {
      throw new Error('Status is required');
    }

    return this.staffService.bulkUpdateStatus(user.tenantId, ids, status);
  }

  @Get('check/employee-id/:employeeId')
  @ApiOperation({ summary: 'Check if an employee ID is available' })
  @ApiResponse({ status: 200, description: 'Employee ID availability', type: Boolean })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkEmployeeIdAvailable(
    @CurrentUser() user: IUser,
    @Param('employeeId') employeeId: string,
  ): Promise<{ available: boolean }> {
    const exists = await this.staffService.employeeIdExists(user.tenantId, employeeId);
    return { available: !exists };
  }
}
