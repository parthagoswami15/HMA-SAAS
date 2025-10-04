import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminTenantService } from '../services/admin-tenant.service';
import {
  CreateTenantDto,
  UpdateTenantDto,
  TenantProvisioningDto,
  ModuleToggleDto,
  SubscriptionPlanDto,
  TenantFilterDto,
  TenantListDto,
  StorageQuotaDto,
  UserSeatsDto,
  DataExportDto,
  BackupScheduleDto,
  EnvironmentConfigDto,
  MeteringDataDto,
  InvoiceGenerationDto,
} from '../dto/admin-tenant.dto';

@ApiTags('Admin & Tenant Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/tenants')
export class AdminTenantController {
  constructor(private readonly adminTenantService: AdminTenantService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiResponse({ status: 201, description: 'Tenant created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Tenant slug already exists' })
  async create(@Body() createDto: CreateTenantDto, @Request() req) {
    return this.adminTenantService.createTenant(createDto, req.user.id);
  }

  @Post(':id/provision')
  @ApiOperation({ summary: 'Provision tenant with template' })
  @ApiResponse({ status: 200, description: 'Tenant provisioned successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async provision(@Param('id') tenantId: string, @Body() provisioningDto: TenantProvisioningDto) {
    return this.adminTenantService.provisionTenant(tenantId, provisioningDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tenants with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Tenants retrieved successfully' })
  async findAll(
    @Query() filterDto: TenantFilterDto,
    @Query() listDto: TenantListDto,
  ) {
    return this.adminTenantService.findAll(filterDto, listDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tenant by ID' })
  @ApiResponse({ status: 200, description: 'Tenant retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async findOne(@Param('id') id: string) {
    return this.adminTenantService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tenant' })
  @ApiResponse({ status: 200, description: 'Tenant updated successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateTenantDto) {
    return this.adminTenantService.updateTenant(id, updateDto);
  }

  @Post(':id/modules/toggle')
  @ApiOperation({ summary: 'Toggle module for tenant' })
  @ApiResponse({ status: 200, description: 'Module toggled successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async toggleModule(@Param('id') tenantId: string, @Body() moduleToggleDto: ModuleToggleDto) {
    return this.adminTenantService.toggleModule(tenantId, moduleToggleDto);
  }

  @Put(':id/subscription')
  @ApiOperation({ summary: 'Update tenant subscription plan' })
  @ApiResponse({ status: 200, description: 'Subscription updated successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async updateSubscription(@Param('id') tenantId: string, @Body() subscriptionDto: SubscriptionPlanDto) {
    return this.adminTenantService.updateSubscriptionPlan(tenantId, subscriptionDto);
  }

  @Put(':id/storage-quota')
  @ApiOperation({ summary: 'Update tenant storage quota' })
  @ApiResponse({ status: 200, description: 'Storage quota updated successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async updateStorageQuota(@Param('id') tenantId: string, @Body() quotaDto: StorageQuotaDto) {
    return this.adminTenantService.updateStorageQuota(tenantId, quotaDto);
  }

  @Put(':id/user-seats')
  @ApiOperation({ summary: 'Update tenant user seats' })
  @ApiResponse({ status: 200, description: 'User seats updated successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async updateUserSeats(@Param('id') tenantId: string, @Body() seatsDto: UserSeatsDto) {
    return this.adminTenantService.updateUserSeats(tenantId, seatsDto);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get tenant statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats(@Param('id') tenantId: string) {
    return this.adminTenantService.getTenantStats(tenantId);
  }

  @Post(':id/export')
  @ApiOperation({ summary: 'Export tenant data' })
  @ApiResponse({ status: 200, description: 'Data export initiated successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async exportData(@Param('id') tenantId: string, @Body() exportDto: DataExportDto) {
    return this.adminTenantService.exportTenantData(tenantId, exportDto);
  }

  @Put(':id/backup-schedule')
  @ApiOperation({ summary: 'Configure backup schedule' })
  @ApiResponse({ status: 200, description: 'Backup schedule configured successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async configureBackupSchedule(@Param('id') tenantId: string, @Body() scheduleDto: BackupScheduleDto) {
    return this.adminTenantService.configureBackupSchedule(tenantId, scheduleDto);
  }

  @Put(':id/environment')
  @ApiOperation({ summary: 'Configure tenant environment' })
  @ApiResponse({ status: 200, description: 'Environment configured successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async configureEnvironment(@Param('id') tenantId: string, @Body() configDto: EnvironmentConfigDto) {
    return this.adminTenantService.configureEnvironment(tenantId, configDto);
  }

  @Post('metering')
  @ApiOperation({ summary: 'Record metering data' })
  @ApiResponse({ status: 201, description: 'Metering data recorded successfully' })
  async recordMetering(@Body() meteringDto: MeteringDataDto) {
    return this.adminTenantService.recordMeteringData(meteringDto);
  }

  @Post('invoice/generate')
  @ApiOperation({ summary: 'Generate invoice' })
  @ApiResponse({ status: 201, description: 'Invoice generated successfully' })
  async generateInvoice(@Body() invoiceDto: InvoiceGenerationDto) {
    return this.adminTenantService.generateInvoice(invoiceDto);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate tenant' })
  @ApiResponse({ status: 200, description: 'Tenant activated successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async activate(@Param('id') id: string) {
    return this.adminTenantService.updateTenant(id, { isActive: true });
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate tenant' })
  @ApiResponse({ status: 200, description: 'Tenant deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async deactivate(@Param('id') id: string) {
    return this.adminTenantService.updateTenant(id, { isActive: false });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete tenant' })
  @ApiResponse({ status: 204, description: 'Tenant deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async remove(@Param('id') id: string) {
    // This would typically soft delete or archive the tenant
    await this.adminTenantService.updateTenant(id, { isActive: false });
  }
}
