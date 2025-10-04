import { Body, Controller, Get, Headers, Post, Put, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import {
  CreatePlanDto, UpdatePlanDto, CreatePolicyDto, UpdatePolicyDto, CreateTPADto, UpdateTPADto,
  CreatePreAuthDto, UpdatePreAuthDto, SubmitPreAuthDto, CreateAuthorizationDto, UpdateAuthorizationDto,
  CreateClaimDto, UpdateClaimDto, SubmitClaimDto, CreateEOBDto, CreatePayerConfigDto, UpdatePayerConfigDto,
  EligibilityCheckDto, BillSplitDto, RoomUpgradeDto, PreAuthQueryDto, ClaimQueryDto, AuthorizationQueryDto, ClaimSettlementDto
} from './insurance.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('insurance')
export class InsuranceController {
  constructor(private svc: InsuranceService) {}

  // ==================== PLAN MANAGEMENT ====================

  @Post('plans')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createPlan(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreatePlanDto) {
    return this.svc.createPlan(tenantId, dto);
  }

  @Get('plans')
  async getPlans(@Headers('x-tenant-id') tenantId: string, @Query('payerId') payerId?: string) {
    return this.svc.getPlans(tenantId, payerId);
  }

  @Get('plans/:id')
  async getPlan(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.getPlanById(tenantId, id);
  }

  @Put('plans/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updatePlan(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.svc.updatePlan(tenantId, id, dto);
  }

  @Delete('plans/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async deletePlan(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deletePlan(tenantId, id);
  }

  // ==================== POLICY MANAGEMENT ====================

  @Post('policies')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createPolicy(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreatePolicyDto) {
    return this.svc.createPolicy(tenantId, dto);
  }

  @Get('policies')
  async getPolicies(@Headers('x-tenant-id') tenantId: string, @Query('patientId') patientId?: string) {
    return this.svc.getPolicies(tenantId, patientId);
  }

  @Get('policies/:id')
  async getPolicy(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.getPolicyById(tenantId, id);
  }

  @Put('policies/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updatePolicy(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdatePolicyDto) {
    return this.svc.updatePolicy(tenantId, id, dto);
  }

  @Delete('policies/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async deletePolicy(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deletePolicy(tenantId, id);
  }

  // ==================== TPA MANAGEMENT ====================

  @Post('tpas')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createTPA(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateTPADto) {
    return this.svc.createTPA(tenantId, dto);
  }

  @Get('tpas')
  async getTPAs(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getTPAs(tenantId);
  }

  @Get('tpas/:id')
  async getTPA(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.getTPAById(tenantId, id);
  }

  @Put('tpas/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updateTPA(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateTPADto) {
    return this.svc.updateTPA(tenantId, id, dto);
  }

  @Delete('tpas/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async deleteTPA(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deleteTPA(tenantId, id);
  }

  // ==================== PRE-AUTH MANAGEMENT ====================

  @Post('pre-auths')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.RECEPTIONIST)
  async createPreAuth(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreatePreAuthDto) {
    return this.svc.createPreAuth(tenantId, dto);
  }

  @Get('pre-auths')
  async getPreAuths(@Headers('x-tenant-id') tenantId: string, @Query() query: PreAuthQueryDto) {
    return this.svc.getPreAuths(tenantId, query);
  }

  @Get('pre-auths/:id')
  async getPreAuth(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.getPreAuthById(tenantId, id);
  }

  @Put('pre-auths/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.RECEPTIONIST)
  async updatePreAuth(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdatePreAuthDto) {
    return this.svc.updatePreAuth(tenantId, id, dto);
  }

  @Post('pre-auths/:id/submit')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.RECEPTIONIST)
  async submitPreAuth(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: SubmitPreAuthDto) {
    return this.svc.submitPreAuth(tenantId, { ...dto, preAuthId: id });
  }

  @Delete('pre-auths/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async deletePreAuth(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deletePreAuth(tenantId, id);
  }

  // ==================== AUTHORIZATION MANAGEMENT ====================

  @Post('authorizations')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createAuthorization(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateAuthorizationDto) {
    return this.svc.createAuthorization(tenantId, dto);
  }

  @Get('authorizations')
  async getAuthorizations(@Headers('x-tenant-id') tenantId: string, @Query() query: AuthorizationQueryDto) {
    return this.svc.getAuthorizations(tenantId, query);
  }

  @Get('authorizations/:id')
  async getAuthorization(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.getAuthorizationById(tenantId, id);
  }

  @Put('authorizations/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updateAuthorization(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateAuthorizationDto) {
    return this.svc.updateAuthorization(tenantId, id, dto);
  }

  @Delete('authorizations/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async deleteAuthorization(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deleteAuthorization(tenantId, id);
  }

  // ==================== CLAIM MANAGEMENT ====================

  @Post('claims')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createClaim(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateClaimDto) {
    return this.svc.createClaim(tenantId, dto);
  }

  @Get('claims')
  async getClaims(@Headers('x-tenant-id') tenantId: string, @Query() query: ClaimQueryDto) {
    return this.svc.getClaims(tenantId, query);
  }

  @Get('claims/:id')
  async getClaim(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.getClaimById(tenantId, id);
  }

  @Put('claims/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updateClaim(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateClaimDto) {
    return this.svc.updateClaim(tenantId, id, dto);
  }

  @Post('claims/:id/submit')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async submitClaim(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: SubmitClaimDto) {
    return this.svc.submitClaim(tenantId, { ...dto, claimId: id });
  }

  @Post('claims/:id/settle')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async processClaimSettlement(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: ClaimSettlementDto) {
    return this.svc.processClaimSettlement(tenantId, { ...dto, claimId: id });
  }

  // ==================== EOB MANAGEMENT ====================

  @Post('eobs')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createEOB(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateEOBDto) {
    return this.svc.createEOB(tenantId, dto);
  }

  @Get('eobs/:id')
  async getEOB(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.getEOBById(tenantId, id);
  }

  // ==================== PAYER CONFIG MANAGEMENT ====================

  @Post('payer-configs')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createPayerConfig(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreatePayerConfigDto) {
    return this.svc.createPayerConfig(tenantId, dto);
  }

  @Get('payer-configs')
  async getPayerConfigs(@Headers('x-tenant-id') tenantId: string, @Query('payerId') payerId?: string) {
    return this.svc.getPayerConfigs(tenantId, payerId);
  }

  @Put('payer-configs/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updatePayerConfig(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdatePayerConfigDto) {
    return this.svc.updatePayerConfig(tenantId, id, dto);
  }

  @Delete('payer-configs/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async deletePayerConfig(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deletePayerConfig(tenantId, id);
  }

  // ==================== CORE WORKFLOWS ====================

  @Post('eligibility-check')
  async checkEligibility(@Headers('x-tenant-id') tenantId: string, @Body() dto: EligibilityCheckDto) {
    return this.svc.checkEligibility(tenantId, dto);
  }

  @Post('bill-split')
  async splitBill(@Headers('x-tenant-id') tenantId: string, @Body() dto: BillSplitDto) {
    return this.svc.splitBill(tenantId, dto);
  }

  @Post('room-upgrade')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async processRoomUpgrade(@Headers('x-tenant-id') tenantId: string, @Body() dto: RoomUpgradeDto) {
    return this.svc.processRoomUpgrade(tenantId, dto);
  }

  @Get('policy-balance/:policyId')
  async getPolicyBalance(@Headers('x-tenant-id') tenantId: string, @Param('policyId') policyId: string) {
    return this.svc.getPolicyBalance(tenantId, policyId);
  }

  // ==================== REPORTING ====================

  @Get('summary')
  async getInsuranceSummary(
    @Headers('x-tenant-id') tenantId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.svc.getInsuranceSummary(
      tenantId,
      fromDate ? new Date(fromDate) : undefined,
      toDate ? new Date(toDate) : undefined,
    );
  }

  // ==================== EDGE CASES ====================

  @Post('pre-auths/:id/partial-approval')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async handlePartialApproval(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() { approvedAmount, reason }: { approvedAmount: number; reason: string },
  ) {
    return this.svc.handlePartialApproval(tenantId, id, approvedAmount, reason);
  }

  @Post('policies/:id/exhausted-limit')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async handleExhaustedLimit(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.handleExhaustedLimit(tenantId, id);
  }
}
