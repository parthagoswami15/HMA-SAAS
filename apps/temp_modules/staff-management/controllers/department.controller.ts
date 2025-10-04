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
import { DepartmentService } from '../services/department.service';
import { 
  DepartmentResponseDto, 
  CreateDepartmentDto, 
  UpdateDepartmentDto, 
  DepartmentFilterDto,
  DepartmentListResponseDto,
  DepartmentCountResponseDto,
} from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../user/enums';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { IUser } from '../../user/interfaces';
import { PaginatedResponse } from '../../common/interfaces';

@ApiTags('Department Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({ status: 201, description: 'Department created successfully', type: DepartmentResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'Department with this code already exists' })
  async create(
    @CurrentUser() user: IUser,
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    return this.departmentService.create(user.tenantId, createDepartmentDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get all departments with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'List of departments', type: DepartmentListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @CurrentUser() user: IUser,
    @Query() filterDto: DepartmentFilterDto,
  ): Promise<PaginatedResponse<DepartmentResponseDto>> {
    return this.departmentService.findAll(user.tenantId, filterDto);
  }

  @Get('hierarchy')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD)
  @ApiOperation({ summary: 'Get department hierarchy' })
  @ApiResponse({ status: 200, description: 'Department hierarchy', type: [DepartmentResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getHierarchy(
    @CurrentUser() user: IUser,
  ): Promise<DepartmentResponseDto[]> {
    return this.departmentService.getDepartmentHierarchy(user.tenantId);
  }

  @Get('count-by-department')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD)
  @ApiOperation({ summary: 'Get staff count by department' })
  @ApiResponse({ status: 200, description: 'Staff count by department', type: [DepartmentCountResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async countByDepartment(
    @CurrentUser() user: IUser,
  ): Promise<Array<{ departmentId: string; departmentName: string; count: number }>> {
    return this.departmentService.getStaffCountByDepartment(user.tenantId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get a department by ID' })
  @ApiResponse({ status: 200, description: 'Department details', type: DepartmentResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async findOne(
    @CurrentUser() user: IUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<DepartmentResponseDto> {
    return this.departmentService.findById(user.tenantId, id);
  }

  @Get('code/:code')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get a department by code' })
  @ApiResponse({ status: 200, description: 'Department details', type: DepartmentResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async findByCode(
    @CurrentUser() user: IUser,
    @Param('code') code: string,
  ): Promise<DepartmentResponseDto> {
    const department = await this.departmentService.findByCode(user.tenantId, code);
    if (!department) {
      throw new Error(`Department with code '${code}' not found`);
    }
    return department;
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update a department' })
  @ApiResponse({ status: 200, description: 'Department updated', type: DepartmentResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  @ApiResponse({ status: 409, description: 'Department with this code already exists' })
  async update(
    @CurrentUser() user: IUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    return this.departmentService.update(user.tenantId, id, updateDepartmentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a department (soft delete)' })
  @ApiResponse({ status: 204, description: 'Department deleted' })
  @ApiResponse({ status: 400, description: 'Cannot delete department with staff or child departments' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async remove(
    @CurrentUser() user: IUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.departmentService.delete(user.tenantId, id);
  }

  @Post(':id/assign-head')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a department head' })
  @ApiResponse({ status: 200, description: 'Department head assigned' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Department or staff member not found' })
  async assignDepartmentHead(
    @CurrentUser() user: IUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('staffId', new ParseUUIDPipe()) staffId: string,
  ): Promise<{ success: boolean }> {
    return this.departmentService.assignDepartmentHead(user.tenantId, id, staffId);
  }

  @Post(':id/remove-head')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove department head' })
  @ApiResponse({ status: 200, description: 'Department head removed' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async removeDepartmentHead(
    @CurrentUser() user: IUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ success: boolean }> {
    return this.departmentService.removeDepartmentHead(user.tenantId, id);
  }

  @Get(':id/staff')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD)
  @ApiOperation({ summary: 'Get all staff in a department' })
  @ApiResponse({ status: 200, description: 'List of staff in department' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async getDepartmentStaff(
    @CurrentUser() user: IUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('includeSubDepartments') includeSubDepartments: boolean = false,
  ): Promise<any> {
    return this.departmentService.getDepartmentStaff(user.tenantId, id, includeSubDepartments);
  }
}
