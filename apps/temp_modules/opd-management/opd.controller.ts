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
  ParseIntPipe,
  DefaultValuePipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';
import { OPDService } from './opd.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('opd')
@ApiTags('OPD Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
export class OPDController {
  constructor(private readonly opdService: OPDService) {}

  // Visit Endpoints
  @Post('visits')
  @ApiOperation({ summary: 'Create a new visit' })
  @ApiResponse({ status: 201, description: 'Visit created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async createVisit(@Body() createVisitDto: any) {
    return this.opdService.createVisit(createVisitDto);
  }

  @Get('visits/:id')
  @ApiOperation({ summary: 'Get visit by ID' })
  @ApiResponse({ status: 200, description: 'Visit found' })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  async getVisitById(@Param('id') id: string) {
    return this.opdService.getVisitById(id);
  }

  @Put('visits/:id')
  @ApiOperation({ summary: 'Update a visit' })
  @ApiResponse({ status: 200, description: 'Visit updated successfully' })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async updateVisit(@Param('id') id: string, @Body() updateVisitDto: any) {
    return this.opdService.updateVisit(id, updateVisitDto);
  }

  @Delete('visits/:id')
  @ApiOperation({ summary: 'Delete a visit' })
  @ApiResponse({ status: 200, description: 'Visit deleted successfully' })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async deleteVisit(@Param('id') id: string) {
    return this.opdService.deleteVisit(id);
  }

  // Encounter Endpoints
  @Post('encounters')
  @ApiOperation({ summary: 'Create a new encounter' })
  @ApiResponse({ status: 201, description: 'Encounter created successfully' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async createEncounter(@Body() createEncounterDto: any) {
    return this.opdService.createEncounter(createEncounterDto);
  }

  @Get('encounters/:id')
  @ApiOperation({ summary: 'Get encounter by ID' })
  @ApiResponse({ status: 200, description: 'Encounter found' })
  async getEncounterById(@Param('id') id: string) {
    return this.opdService.getEncounterById(id);
  }

  @Put('encounters/:id')
  @ApiOperation({ summary: 'Update an encounter' })
  @ApiResponse({ status: 200, description: 'Encounter updated successfully' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async updateEncounter(@Param('id') id: string, @Body() updateEncounterDto: any) {
    return this.opdService.updateEncounter(id, updateEncounterDto);
  }

  @Post('encounters/:id/complete')
  @ApiOperation({ summary: 'Complete an encounter' })
  @ApiResponse({ status: 200, description: 'Encounter completed successfully' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async completeEncounter(@Param('id') id: string) {
    return this.opdService.completeEncounter(id);
  }

  // Prescription Endpoints
  @Post('prescriptions')
  @ApiOperation({ summary: 'Create a new prescription' })
  @ApiResponse({ status: 201, description: 'Prescription created successfully' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async createPrescription(@Body() createPrescriptionDto: any) {
    return this.opdService.createPrescription(createPrescriptionDto);
  }

  @Get('patients/:patientId/prescriptions')
  @ApiOperation({ summary: 'Get all prescriptions for a patient' })
  @ApiResponse({ status: 200, description: 'Prescriptions retrieved successfully' })
  async getPatientPrescriptions(@Param('patientId') patientId: string) {
    return this.opdService.getPrescriptionsByPatient(patientId);
  }

  @Get('patients/:patientId/prescriptions/active')
  @ApiOperation({ summary: 'Get active prescriptions for a patient' })
  @ApiResponse({ status: 200, description: 'Active prescriptions retrieved' })
  async getActivePrescriptions(@Param('patientId') patientId: string) {
    return this.opdService.getActivePrescriptions(patientId);
  }

  // Queue Management Endpoints
  @Post('queue/token')
  @ApiOperation({ summary: 'Generate a new queue token' })
  @ApiResponse({ status: 201, description: 'Token generated successfully' })
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async generateToken(@Body() generateTokenDto: any) {
    return this.opdService.generateToken(generateTokenDto);
  }

  @Get('queue/current')
  @ApiOperation({ summary: 'Get current token' })
  @ApiResponse({ status: 200, description: 'Current token retrieved' })
  async getCurrentToken(@Query('doctorId') doctorId?: string) {
    return this.opdService.getCurrentToken(doctorId);
  }

  @Post('queue/next')
  @ApiOperation({ summary: 'Call next token' })
  @ApiResponse({ status: 200, description: 'Next token called' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async callNextToken(@Body('doctorId') doctorId: string) {
    return this.opdService.callNextToken(doctorId);
  }

  // Order Endpoints
  @Post('orders')
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async createOrder(@Body() createOrderDto: any) {
    return this.opdService.createOrder(createOrderDto);
  }

  @Get('encounters/:encounterId/orders')
  @ApiOperation({ summary: 'Get orders for an encounter' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  async getEncounterOrders(@Param('encounterId') encounterId: string) {
    return this.opdService.getOrdersByEncounter(encounterId);
  }

  // Document Endpoints
  @Post('documents')
  @ApiOperation({ summary: 'Upload a document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        patientId: { type: 'string' },
        documentType: { type: 'string' },
        notes: { type: 'string', required: false },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDocumentDto: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.opdService.uploadDocument(uploadDocumentDto, file);
  }

  @Get('patients/:patientId/documents')
  @ApiOperation({ summary: 'Get all documents for a patient' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  async getPatientDocuments(@Param('patientId') patientId: string) {
    return this.opdService.getPatientDocuments(patientId);
  }

  // Billing Endpoints
  @Post('bills/generate')
  @ApiOperation({ summary: 'Generate a bill for an encounter' })
  @ApiResponse({ status: 201, description: 'Bill generated successfully' })
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async generateBill(@Body('encounterId') encounterId: string) {
    return this.opdService.generateBill(encounterId);
  }

  @Post('bills/:billId/pay')
  @ApiOperation({ summary: 'Process a payment for a bill' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  @Roles(UserRole.ADMIN, UserRole.BILLING)
  async processPayment(
    @Param('billId') billId: string,
    @Body() paymentDetails: any,
  ) {
    return this.opdService.processPayment(billId, paymentDetails);
  }

  // ICD-10 and Diagnosis Endpoints
  @Get('icd10')
  @ApiOperation({ summary: 'Search ICD-10 codes' })
  @ApiResponse({ status: 200, description: 'ICD-10 codes retrieved' })
  @ApiQuery({ name: 'query', required: true, type: String })
  async searchIcd10Codes(@Query('query') query: string) {
    if (!query || query.length < 3) {
      throw new BadRequestException('Query must be at least 3 characters long');
    }
    return this.opdService.searchIcd10Codes(query);
  }

  @Post('diagnoses')
  @ApiOperation({ summary: 'Create a new diagnosis' })
  @ApiResponse({ status: 201, description: 'Diagnosis created successfully' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async createDiagnosis(@Body() createDiagnosisDto: any) {
    return this.opdService.createDiagnosis(createDiagnosisDto);
  }

  @Get('patients/:patientId/diagnoses')
  @ApiOperation({ summary: 'Get all diagnoses for a patient' })
  @ApiResponse({ status: 200, description: 'Diagnoses retrieved successfully' })
  async getPatientDiagnoses(@Param('patientId') patientId: string) {
    return this.opdService.getPatientDiagnoses(patientId);
  }

  // Vitals Endpoints
  @Post('vitals')
  @ApiOperation({ summary: 'Record patient vitals' })
  @ApiResponse({ status: 201, description: 'Vitals recorded successfully' })
  @Roles(UserRole.ADMIN, UserRole.NURSE, UserRole.DOCTOR)
  async recordVitals(@Body() recordVitalsDto: any) {
    return this.opdService.recordVitals(recordVitalsDto);
  }

  @Get('patients/:patientId/vitals')
  @ApiOperation({ summary: 'Get vitals history for a patient' })
  @ApiResponse({ status: 200, description: 'Vitals history retrieved' })
  async getPatientVitals(@Param('patientId') patientId: string) {
    return this.opdService.getPatientVitals(patientId);
  }
}
