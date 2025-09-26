"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PatientsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const notification_service_1 = require("../notifications/notification.service");
const patient_enums_1 = require("../common/enums/patient.enums");
const patient_response_dto_1 = require("./dto/patient-response.dto");
const file_storage_service_1 = require("../file-storage/file-storage.service");
const moment_1 = __importDefault(require("moment"));
const patient_repository_1 = require("./repositories/patient.repository");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PatientsService = PatientsService_1 = class PatientsService {
    patientRepository;
    eventEmitter;
    notificationService;
    fileStorageService;
    prisma;
    logger = new common_1.Logger(PatientsService_1.name);
    constructor(patientRepository, eventEmitter, notificationService, fileStorageService, prisma) {
        this.patientRepository = patientRepository;
        this.eventEmitter = eventEmitter;
        this.notificationService = notificationService;
        this.fileStorageService = fileStorageService;
        this.prisma = prisma;
    }
    async registerPatient(tenantId, data, createdById) {
        return this.prisma.$transaction(async (tx) => {
            try {
                await this.validatePatientData(tenantId, data);
                const medicalRecordNumber = await this.generateMedicalRecordNumber(tenantId);
                const registrationNumber = await this.generateRegistrationNumber(tenantId);
                let photoUrl;
                if (data.photoUrl) {
                    const uploadResult = await this.fileStorageService.uploadPatientPhotoFromUrl({
                        photoUrl: data.photoUrl,
                        patientId: medicalRecordNumber
                    });
                    photoUrl = uploadResult.url;
                }
                const patientData = {
                    medicalRecordNumber,
                    registrationNumber,
                    dateOfBirth: data.dob ? new Date(data.dob) : null,
                    insuranceValidUntil: data.insuranceValidUntil ? new Date(data.insuranceValidUntil) : null,
                    tenant: { connect: { id: tenantId } },
                    createdBy: createdById,
                    updatedBy: createdById,
                    isVerified: data.autoVerify || false,
                    verificationDate: (data.autoVerify || false) ? new Date() : null,
                };
                const patient = await tx.patient.create({
                    data: patientData,
                    include: {
                        tenant: {
                            select: {
                                id: true,
                                name: true,
                                slug: true
                            }
                        },
                        emergencyContacts: true
                    }
                });
                if (data.emergencyContacts?.length) {
                    await this.addEmergencyContacts(tx, patient.id, data.emergencyContacts);
                }
                this.eventEmitter.emit('patient.registered', {
                    patientId: patient.id,
                    tenantId,
                    registrationType: data.registrationType,
                    createdById
                });
                if (data.email || data.phone) {
                    this.notificationService.sendPatientWelcome({
                        patientId: patient.id,
                        email: data.email,
                        phone: data.phone,
                        name: `${data.firstName} ${data.lastName}`.trim(),
                        mrn: medicalRecordNumber,
                        registrationType: data.registrationType || patient_enums_1.RegistrationType.WALK_IN,
                        tenantId
                    });
                }
                return new patient_response_dto_1.PatientResponseDto(patient);
            }
            catch (error) {
                this.logger.error(`Patient registration failed: ${error.message}`, error.stack);
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    if (error.code === 'P2002') {
                        const target = error.meta?.target?.[0];
                        throw new common_1.ConflictException(target
                            ? `A patient with this ${target} already exists`
                            : 'A patient with these details already exists');
                    }
                }
                if (error instanceof common_1.BadRequestException || error instanceof common_1.ConflictException) {
                    throw error;
                }
                throw new common_1.InternalServerErrorException('Failed to register patient');
            }
        });
    }
    async getTenantBySlug(slug) {
        return this.prisma.tenant.findUnique({
            where: { slug },
            select: {
                id: true,
                name: true,
                slug: true,
                isActive: true,
            },
        });
    }
    async checkPatientExists(params) {
        const { email, phone, aadhaarNumber } = params;
        if (!email && !phone && !aadhaarNumber) {
            throw new common_1.BadRequestException('At least one of email, phone, or Aadhaar number must be provided');
        }
        const whereClause = {
            OR: [],
        };
        if (email) {
            whereClause.OR.push({ email: { equals: email, mode: 'insensitive' } });
        }
        if (phone) {
            whereClause.OR.push({ phone });
        }
        if (aadhaarNumber) {
            whereClause.OR.push({ aadhaarNumber });
        }
        return this.prisma.patient.findFirst({
            where: whereClause,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                aadhaarNumber: true,
                medicalRecordNumber: true,
                registrationNumber: true,
                isActive: true,
                isVerified: true,
                createdAt: true,
            },
        });
    }
    async uploadPatientDocument(params) {
        const { patientId, file, documentType, uploadedBy, tenantId } = params;
        const patient = await this.prisma.patient.findUnique({
            where: { id: patientId, tenantId },
            select: { id: true },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        const document = await this.prisma.patientDocument.create({
            data: {
                patientId,
                title: file?.originalname || 'Document',
                description: `Document of type: ${documentType}`,
                fileUrl: `/uploads/patients/${patientId}/documents/${file?.filename || file?.originalname}`,
                fileType: file?.mimetype,
                fileSize: file?.size,
                category: documentType,
                uploadedBy,
            },
        });
        return {
            id: document.id,
            documentType: document.category,
            fileName: document.title,
            fileUrl: document.fileUrl,
            uploadedAt: document.uploadedAt,
        };
    }
    async validatePatientData(tenantId, data) {
        if (data.dob) {
            const dob = (0, moment_1.default)(new Date(data.dob));
            if (!dob.isValid() || dob.isAfter((0, moment_1.default)(new Date()))) {
                throw new common_1.BadRequestException('Invalid date of birth');
            }
        }
        if (data.email) {
            const existingPatient = await this.prisma.patient.findFirst({
                where: {
                    email: data.email,
                    tenantId,
                    deletedAt: null
                }
            });
            if (existingPatient) {
                throw new common_1.ConflictException('A patient with this email already exists');
            }
        }
        if (data.phone) {
            const existingPatient = await this.prisma.patient.findFirst({
                where: {
                    phone: data.phone,
                    tenantId,
                    deletedAt: null
                }
            });
            if (existingPatient) {
                throw new common_1.ConflictException('A patient with this phone number already exists');
            }
        }
        if (data.aadhaarNumber) {
            if (!/^\d{12}$/.test(data.aadhaarNumber)) {
                throw new common_1.BadRequestException('Invalid Aadhaar number');
            }
            const existingAadhaar = await this.prisma.patient.findFirst({
                where: {
                    aadhaarNumber: data.aadhaarNumber,
                    tenantId,
                    deletedAt: null
                }
            });
            if (existingAadhaar) {
                throw new common_1.ConflictException('A patient with this Aadhaar number already exists');
            }
        }
    }
    async generateMedicalRecordNumber(tenantId) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { slug: true }
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const prefix = tenant.slug.toUpperCase().substring(0, 3);
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}-${timestamp}${random}`;
    }
    async generateRegistrationNumber(tenantId) {
        const year = new Date().getFullYear().toString().slice(-2);
        const count = await this.prisma.patient.count({
            where: {
                tenantId,
                createdAt: {
                    gte: new Date(`${new Date().getFullYear()}-01-01T00:00:00.000Z`),
                    lt: new Date(`${new Date().getFullYear() + 1}-01-01T00:00:00.000Z`)
                }
            }
        });
        return `REG-${year}-${(count + 1).toString().padStart(6, '0')}`;
    }
    calculateAge(dob) {
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }
    async addEmergencyContacts(tx, patientId, contacts) {
        await Promise.all(contacts.map(contact => tx.emergencyContact.create({
            data: {
                ...contact,
                patientId,
                isPrimary: contact.isPrimary || false
            }
        })));
    }
    async create(tenantId, data, createdById) {
        const registrationData = {
            ...data,
            registrationNumber: await this.generateRegistrationNumber(tenantId),
            registrationType: patient_enums_1.RegistrationType.WALK_IN,
            autoVerify: true,
            tenantId: tenantId,
            gender: data.gender,
            bloodType: data.bloodType,
            maritalStatus: data.maritalStatus,
            phone: data.phone || '',
        };
        return this.registerPatient(tenantId, registrationData, createdById);
    }
    async findOne(tenantId, id, includeDeleted = false) {
        try {
            const where = { tenantId, id };
            if (!includeDeleted) {
                where.deletedAt = null;
            }
            const patient = await this.prisma.patient.findUnique({
                where: where,
                include: {
                    tenant: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            });
            if (!patient) {
                throw new common_1.NotFoundException(`Patient with ID ${id} not found`);
            }
            return this.mapToDto({
                ...patient,
            });
        }
        catch (error) {
            this.logger.error(`Error finding patient: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error finding patient');
        }
    }
    mapToDto(patient) {
        return new patient_response_dto_1.PatientResponseDto(patient);
    }
    async list(tenantId, page = 1, limit = 10, search, status = 'active', filters) {
        try {
            const skip = (page - 1) * limit;
            const take = Math.min(limit, 100);
            const where = {
                tenantId,
                ...(status === 'active' && { deletedAt: null }),
                ...(status === 'inactive' && { deletedAt: { not: null } })
            };
            if (search) {
                where.OR = [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search } },
                    { medicalRecordNumber: { contains: search, mode: 'insensitive' } }
                ];
            }
            if (filters) {
                if (filters.bloodType)
                    where.bloodType = filters.bloodType;
                if (filters.gender)
                    where.gender = filters.gender;
                if (filters.dob)
                    where.dateOfBirth = { equals: new Date(filters.dob) };
            }
            const [patients, total] = await Promise.all([
                this.prisma.patient.findMany({
                    where,
                    include: {
                        tenant: {
                            select: {
                                id: true,
                                name: true,
                                slug: true
                            }
                        }
                    },
                    skip,
                    take,
                    orderBy: { createdAt: 'desc' },
                }),
                this.prisma.patient.count({ where })
            ]);
            const totalPages = Math.ceil(total / take);
            const meta = {
                totalItems: total,
                itemCount: patients.length,
                itemsPerPage: take,
                totalPages,
                currentPage: page,
            };
            return {
                items: patients.map((patient) => new patient_response_dto_1.PatientResponseDto(patient)),
                meta,
            };
        }
        catch (error) {
            this.logger.error(`Error listing patients: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Failed to retrieve patients');
        }
    }
    async update(tenantId, id, data) {
        try {
            const existingPatient = await this.prisma.patient.findUnique({
                where: { id, tenantId }
            });
            if (!existingPatient) {
                throw new common_1.NotFoundException(`Patient with ID ${id} not found`);
            }
            if (data.email && data.email !== existingPatient.email) {
                const emailExists = await this.prisma.patient.findFirst({
                    where: {
                        email: data.email,
                        tenantId,
                        NOT: { id },
                        deletedAt: null
                    }
                });
                if (emailExists) {
                    throw new common_1.ConflictException('A patient with this email already exists');
                }
            }
            const { emergencyContacts, ...updateData } = data;
            if (data.dob) {
                const dob = (0, moment_1.default)(data.dob);
                if (!dob.isValid() || dob.isAfter((0, moment_1.default)())) {
                    throw new common_1.BadRequestException('Invalid date of birth');
                }
                updateData.dateOfBirth = new Date(data.dob);
            }
            const updatedPatient = await this.prisma.patient.update({
                where: { id },
                data: updateData,
                include: {
                    tenant: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            });
            return new patient_response_dto_1.PatientResponseDto(updatedPatient);
        }
        catch (error) {
            this.logger.error(`Error updating patient ${id}: ${error.message}`, error.stack);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    const target = error.meta?.target?.[0];
                    throw new common_1.ConflictException(target
                        ? `A patient with this ${target} already exists`
                        : 'A patient with these details already exists');
                }
            }
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to update patient');
        }
    }
    async remove(tenantId, id, hardDelete = false) {
        try {
            const patient = await this.prisma.patient.findUnique({
                where: { id, tenantId },
            });
            if (!patient) {
                throw new common_1.NotFoundException(`Patient with ID ${id} not found`);
            }
            if (hardDelete) {
                await this.prisma.patient.delete({
                    where: { id },
                });
                this.eventEmitter.emit('patient.deleted', {
                    patientId: id,
                    tenantId,
                    hardDelete: true,
                });
            }
            else {
                await this.prisma.patient.update({
                    where: { id, tenantId },
                    data: {
                        isActive: false,
                        deletedAt: new Date(),
                        email: patient.email ? `deleted-${Date.now()}-${patient.email}` : null,
                        medicalRecordNumber: `DELETED-${Date.now()}-${id}`,
                    },
                });
                this.eventEmitter.emit('patient.deactivated', {
                    patientId: id,
                    tenantId,
                });
            }
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to ${hardDelete ? 'delete' : 'deactivate'} patient: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to ${hardDelete ? 'delete' : 'deactivate'} patient`);
        }
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = PatientsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => notification_service_1.NotificationService))),
    __metadata("design:paramtypes", [patient_repository_1.PatientRepository,
        event_emitter_1.EventEmitter2,
        notification_service_1.NotificationService,
        file_storage_service_1.FileStorageService,
        prisma_service_1.PrismaService])
], PatientsService);
//# sourceMappingURL=patients.service.js.map