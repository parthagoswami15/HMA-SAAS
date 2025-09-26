import { 
  Body, 
  Controller, 
  Post, 
  UseGuards, 
  HttpStatus, 
  HttpCode,
  Param,
  Query,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../auth/current-user.decorator';
import { PatientRegistrationDto } from '../dto/patient-registration.dto';
import { PatientsService } from '../patients.service';
import { PatientResponseDto } from '../dto/patient-response.dto';
import { RegistrationType } from '@prisma/client';
import { FileUploadDto } from '../../common/dto/file-upload.dto';

@ApiTags('Patient Registration')
@Controller('patient-registration')
@UseInterceptors(ClassSerializerInterceptor)
export class PatientRegistrationController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post('walk-in')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new walk-in patient' })
  @ApiResponse({ status: HttpStatus.CREATED, type: PatientResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Patient with this email/phone already exists' })
  async registerWalkInPatient(
    @CurrentUser() user: { tenantId: string, id: string },
    @Body() data: PatientRegistrationDto
  ): Promise<PatientResponseDto> {
    return this.patientsService.registerPatient(
      user.tenantId, 
      { ...data, registrationType: 'WALK_IN' },
      user.id
    );
  }

  @Post('online')
  @ApiOperation({ summary: 'Register a new patient via online portal' })
  @ApiResponse({ status: HttpStatus.CREATED, type: PatientResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Patient with this email/phone already exists' })
  async registerOnlinePatient(
    @Query('tenant') tenantSlug: string,
    @Body() data: PatientRegistrationDto
  ): Promise<PatientResponseDto> {
    // For online registration, we need to get tenantId from slug
    const tenant = await this.patientsService.getTenantBySlug(tenantSlug);
    if (!tenant) {
      throw new NotFoundException('Hospital/Clinic not found');
    }

    return this.patientsService.registerPatient(
      tenant.id,
      { 
        ...data, 
        registrationType: 'ONLINE',
        // Auto-verify based on email/phone verification
        autoVerify: false 
      }
    );
  }

  @Post('referral')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a patient via referral' })
  @ApiResponse({ status: HttpStatus.CREATED, type: PatientResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Patient with this email/phone already exists' })
  async registerReferredPatient(
    @CurrentUser() user: { tenantId: string, id: string },
    @Body() data: PatientRegistrationDto
  ): Promise<PatientResponseDto> {
    return this.patientsService.registerPatient(
      user.tenantId, 
      { 
        ...data, 
        registrationType: 'REFERRAL',
        // Auto-verify referred patients
        autoVerify: true 
      },
      user.id
    );
  }

  @Post('upload-document/:patientId')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Patient document upload',
    type: FileUploadDto,
  })
  @ApiOperation({ summary: 'Upload a document for a patient' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Document uploaded successfully' })
  async uploadDocument(
    @CurrentUser() user: { tenantId: string, id: string },
    @Param('patientId') patientId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Query('documentType') documentType: string
  ) {
    return this.patientsService.uploadPatientDocument({
      patientId,
      file,
      documentType,
      uploadedBy: user.id,
      tenantId: user.tenantId
    });
  }

  @Get('check-availability')
  @ApiOperation({ summary: 'Check if patient with given details already exists' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    schema: {
      type: 'object',
      properties: {
        exists: { type: 'boolean' },
        patient: { $ref: '#/components/schemas/PatientResponseDto' }
      }
    }
  })
  async checkPatientExists(
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('aadhaar') aadhaar?: string
  ) {
    const result = await this.patientsService.checkPatientExists({
      email,
      phone,
      aadhaarNumber: aadhaar
    });

    return {
      exists: !!result,
      patient: result ? new PatientResponseDto(result) : null
    };
  }
}
