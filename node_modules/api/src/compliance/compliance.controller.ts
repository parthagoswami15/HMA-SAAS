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
import { ComplianceService } from './compliance.service';
import { AadhaarService } from './services/aadhaar.service';
import { AuditService } from './services/audit.service';
import { BirthDeathService } from './services/birth-death.service';
import { PcpndtService } from './services/pcpndt.service';
import { PrescriptionService } from './services/prescription.service';
import { DataLocalizationService } from './services/data-localization.service';
import { ComplianceGuard } from './guards/compliance.guard';
import { PcpndtGuard } from './guards/pcpndt.guard';
import { PrescriptionGuard } from './guards/prescription.guard';
import {
  CreateAadhaarDto,
  UpdateAadhaarDto,
  AadhaarConsentDto,
} from './dto/aadhaar.dto';
import {
  CreateBirthRegistrationDto,
  CreateDeathRegistrationDto,
  UpdateBirthRegistrationDto,
  UpdateDeathRegistrationDto,
  BirthRegistrationApprovalDto,
  DeathRegistrationApprovalDto,
} from './dto/birth-death.dto';
import {
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
  NarcoticsRegisterDto,
} from './dto/prescription.dto';
import {
  AuditLogDto,
  AuditQueryDto,
  ComplianceReportDto,
} from './dto/compliance.dto';

@Controller('compliance')
@UseGuards(ComplianceGuard)
export class ComplianceController {
  constructor(
    private readonly complianceService: ComplianceService,
    private readonly aadhaarService: AadhaarService,
    private readonly auditService: AuditService,
    private readonly birthDeathService: BirthDeathService,
    private readonly pcpndtService: PcpndtService,
    private readonly prescriptionService: PrescriptionService,
    private readonly dataLocalizationService: DataLocalizationService,
  ) {}

  // Aadhaar Management
  @Post('aadhaar')
  @HttpCode(HttpStatus.CREATED)
  async createAadhaar(@Body() createAadhaarDto: CreateAadhaarDto, @Request() req) {
    return this.aadhaarService.createAadhaar(createAadhaarDto, req.user);
  }

  @Put('aadhaar/:id')
  async updateAadhaar(
    @Param('id') id: string,
    @Body() updateAadhaarDto: UpdateAadhaarDto,
    @Request() req,
  ) {
    return this.aadhaarService.updateAadhaar(id, updateAadhaarDto, req.user);
  }

  @Post('aadhaar/:id/consent')
  async recordAadhaarConsent(
    @Param('id') id: string,
    @Body() consentDto: AadhaarConsentDto,
    @Request() req,
  ) {
    return this.aadhaarService.recordConsent(id, consentDto, req.user);
  }

  @Get('aadhaar/:id')
  async getAadhaar(@Param('id') id: string, @Request() req) {
    return this.aadhaarService.getAadhaar(id, req.user);
  }

  // Birth & Death Registration
  @Post('birth-registration')
  @HttpCode(HttpStatus.CREATED)
  async createBirthRegistration(
    @Body() createDto: CreateBirthRegistrationDto,
    @Request() req,
  ) {
    return this.birthDeathService.createBirthRegistration(createDto, req.user);
  }

  @Put('birth-registration/:id')
  async updateBirthRegistration(
    @Param('id') id: string,
    @Body() updateDto: UpdateBirthRegistrationDto,
    @Request() req,
  ) {
    return this.birthDeathService.updateBirthRegistration(id, updateDto, req.user);
  }

  @Post('birth-registration/:id/approve')
  async approveBirthRegistration(
    @Param('id') id: string,
    @Body() approvalDto: BirthRegistrationApprovalDto,
    @Request() req,
  ) {
    return this.birthDeathService.approveBirthRegistration(id, approvalDto, req.user);
  }

  @Post('death-registration')
  @HttpCode(HttpStatus.CREATED)
  async createDeathRegistration(
    @Body() createDto: CreateDeathRegistrationDto,
    @Request() req,
  ) {
    return this.birthDeathService.createDeathRegistration(createDto, req.user);
  }

  @Put('death-registration/:id')
  async updateDeathRegistration(
    @Param('id') id: string,
    @Body() updateDto: UpdateDeathRegistrationDto,
    @Request() req,
  ) {
    return this.birthDeathService.updateDeathRegistration(id, updateDto, req.user);
  }

  @Post('death-registration/:id/approve')
  async approveDeathRegistration(
    @Param('id') id: string,
    @Body() approvalDto: DeathRegistrationApprovalDto,
    @Request() req,
  ) {
    return this.birthDeathService.approveDeathRegistration(id, approvalDto, req.user);
  }

  // PC-PNDT Compliance
  @Post('pcpndt/access-request')
  @UseGuards(PcpndtGuard)
  async requestPcpndtAccess(@Body() requestDto: any, @Request() req) {
    return this.pcpndtService.requestAccess(requestDto, req.user);
  }

  @Get('pcpndt/access-logs')
  @UseGuards(PcpndtGuard)
  async getPcpndtAccessLogs(@Query() query: any, @Request() req) {
    return this.pcpndtService.getAccessLogs(query, req.user);
  }

  // Prescription Compliance
  @Post('prescription')
  @UseGuards(PrescriptionGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPrescription(
    @Body() createDto: CreatePrescriptionDto,
    @Request() req,
  ) {
    return this.prescriptionService.createPrescription(createDto, req.user);
  }

  @Put('prescription/:id')
  @UseGuards(PrescriptionGuard)
  async updatePrescription(
    @Param('id') id: string,
    @Body() updateDto: UpdatePrescriptionDto,
    @Request() req,
  ) {
    return this.prescriptionService.updatePrescription(id, updateDto, req.user);
  }

  @Post('narcotics-register')
  async recordNarcoticsDispense(
    @Body() registerDto: NarcoticsRegisterDto,
    @Request() req,
  ) {
    return this.prescriptionService.recordNarcoticsDispense(registerDto, req.user);
  }

  // Audit Logs
  @Get('audit-logs')
  async getAuditLogs(@Query() query: AuditQueryDto, @Request() req) {
    return this.auditService.getAuditLogs(query, req.user);
  }

  @Post('audit-logs')
  @HttpCode(HttpStatus.CREATED)
  async createAuditLog(@Body() auditDto: AuditLogDto, @Request() req) {
    return this.auditService.createAuditLog(auditDto, req.user);
  }

  // Compliance Reports
  @Get('reports')
  async getComplianceReports(@Query() query: ComplianceReportDto, @Request() req) {
    return this.complianceService.generateComplianceReport(query, req.user);
  }

  // Data Localization
  @Get('data-localization/status')
  async getDataLocalizationStatus(@Request() req) {
    return this.dataLocalizationService.getLocalizationStatus(req.user);
  }

  @Post('data-localization/comply')
  async complyWithDataLocalization(@Body() complianceDto: any, @Request() req) {
    return this.dataLocalizationService.ensureCompliance(complianceDto, req.user);
  }
}
