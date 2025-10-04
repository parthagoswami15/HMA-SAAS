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
import { RoleService } from '../services/role.service';
import { 
  RoleResponseDto, 
  CreateRoleDto, 
  UpdateRoleDto, 
  RoleFilterDto,
  RoleListResponseDto,
  AssignRoleDto,
  PermissionResponseDto,
} from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../user/enums';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { IUser } from '../../user/interfaces';
import { PaginatedResponse } from '../../common/interfaces';

@ApiTags('Role Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully', type: RoleResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'Role with this name already exists' })
  async create(
    @CurrentUser() user: IUser,
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<RoleResponseDto> {
    return this.roleService.create(user.tenantId, createRoleDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get all roles with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'List of roles', type: RoleListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @CurrentUser() user: IUser,
    @Query() filterDto: RoleFilterDto,
  ): Promise<PaginatedResponse<RoleResponseDto>> {
    return this.roleService.findAll(user.tenantId, filterDto);
  }

  @Get('permissions')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get all available permissions' })
  @ApiResponse({ status: 200, description: 'List of permissions', type: [PermissionResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getPermissions(): Promise<PermissionResponseDto[]> {
    return this.roleService.getAllPermissions();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiResponse({ status: 200, description: 'Role details', type: RoleResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async findOne(
    @CurrentUser() user: IUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<RoleResponseDto> {
    return this.roleService.findById(user.tenantId, id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({ status: 200, description: 'Role updated', type: RoleResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 409, description: 'Role with this name already exists' })
  async update(
    @CurrentUser() user: IUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    return this.roleService.update(user.tenantId, id, updateRoleDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role (soft delete)' })
  @ApiResponse({ status: 204, description: 'Role deleted' })
  @ApiResponse({ status: 400, description: 'Cannot delete system role or role assigned to users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async remove(
    @CurrentUser() user: IUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.roleService.delete(user.tenantId, id);
  }

  @Post('assign')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Assign roles to a user' })
  @ApiResponse({ status: 200, description: 'Roles assigned successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  async assignRoles(
    @CurrentUser() user: IUser,
    @Body() assignRoleDto: AssignRoleDto,
  ): Promise<{ success: boolean }> {
    return this.roleService.assignRolesToUser(
      user.tenantId,
      assignRoleDto.userId,
      assignRoleDto.roleIds,
    );
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get all roles for a user' })
  @ApiResponse({ status: 200, description: 'List of user roles', type: [RoleResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserRoles(
    @CurrentUser() user: IUser,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<RoleResponseDto[]> {
    return this.roleService.getUserRoles(user.tenantId, userId);
  }

  @Get('me/permissions')
  @ApiOperation({ summary: 'Get current user permissions' })
  @ApiResponse({ status: 200, description: 'List of permissions', type: [String] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyPermissions(
    @CurrentUser() user: IUser,
  ): Promise<string[]> {
    return this.roleService.getUserPermissions(user.id);
  }

  @Post('check-permission')
  @ApiOperation({ summary: 'Check if current user has a specific permission' })
  @ApiResponse({ status: 200, description: 'Permission check result', type: Boolean })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkPermission(
    @CurrentUser() user: IUser,
    @Body('permission') permission: string,
  ): Promise<{ hasPermission: boolean }> {
    if (!permission) {
      return { hasPermission: false };
    }
    const hasPermission = await this.roleService.hasPermission(user.id, permission);
    return { hasPermission };
  }
}
