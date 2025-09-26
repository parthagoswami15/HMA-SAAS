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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmissionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const admission_entity_1 = require("../entities/admission.entity");
const admission_response_dto_1 = require("../dto/admission/admission-response.dto");
const patient_entity_1 = require("../../patients/entities/patient.entity");
const staff_entity_1 = require("../../staff/entities/staff.entity");
const bed_entity_1 = require("../entities/bed.entity");
const admission_status_enum_1 = require("../enums/admission-status.enum");
const bed_status_enum_1 = require("../enums/bed-status.enum");
const bed_service_1 = require("./bed.service");
const number_generator_1 = require("../../common/utils/number-generator");
let AdmissionService = class AdmissionService {
    admissionRepository;
    patientRepository;
    staffRepository;
    bedRepository;
    bedService;
    constructor(admissionRepository, patientRepository, staffRepository, bedRepository, bedService) {
        this.admissionRepository = admissionRepository;
        this.patientRepository = patientRepository;
        this.staffRepository = staffRepository;
        this.bedRepository = bedRepository;
        this.bedService = bedService;
    }
    async create(createAdmissionDto, userId) {
        const patient = await this.patientRepository.findOne(createAdmissionDto.patientId);
        if (!patient) {
            throw new common_1.NotFoundException(`Patient with ID ${createAdmissionDto.patientId} not found`);
        }
        const doctor = await this.staffRepository.findOne(createAdmissionDto.admittingDoctorId);
        if (!doctor) {
            throw new common_1.NotFoundException(`Doctor with ID ${createAdmissionDto.admittingDoctorId} not found`);
        }
        const bed = await this.bedRepository.findOne({
            where: { id: createAdmissionDto.bedId },
            relations: ['ward'],
        });
        if (!bed) {
            throw new common_1.NotFoundException(`Bed with ID ${createAdmissionDto.bedId} not found`);
        }
        if (bed.status !== bed_status_enum_1.BedStatus.AVAILABLE) {
            throw new common_1.ConflictException(`Bed ${bed.bedNumber} is not available for admission`);
        }
        const existingAdmission = await this.admissionRepository.findOne({
            where: {
                patientId: createAdmissionDto.patientId,
                status: (0, typeorm_2.Not)((0, typeorm_2.In)([admission_status_enum_1.AdmissionStatus.DISCHARGED, admission_status_enum_1.AdmissionStatus.LAMA, admission_status_enum_1.AdmissionStatus.DAMA, admission_status_enum_1.AdmissionStatus.ABSCONDED, admission_status_enum_1.AdmissionStatus.DECEASED])),
            },
        });
        if (existingAdmission) {
            throw new common_1.ConflictException(`Patient already has an active admission (${existingAdmission.admissionNumber})`);
        }
        const admission = this.admissionRepository.create({
            ...createAdmissionDto,
            admissionNumber: (0, number_generator_1.generateAdmissionNumber)(),
            patient,
            admittingDoctor: doctor,
            bed,
            status: admission_status_enum_1.AdmissionStatus.ADMITTED,
            createdBy: userId,
            updatedBy: userId,
        });
        await this.bedService.updateBedStatus(bed.id, bed_status_enum_1.BedStatus.OCCUPIED, userId);
        const savedAdmission = await this.admissionRepository.save(admission);
        return new admission_response_dto_1.AdmissionResponseDto(savedAdmission);
    }
    async findAll(filterDto) {
        const { patientId, doctorId, wardId, bedId, admissionType, status, admissionDateFrom, admissionDateTo, dischargeDateFrom, dischargeDateTo, activeOnly, searchTerm, page = 1, limit = 10, sortBy = 'admissionDate', sortOrder = 'DESC', } = filterDto;
        const skip = (page - 1) * limit;
        const where = {};
        const relations = ['patient', 'admittingDoctor', 'bed', 'bed.ward'];
        if (patientId)
            where.patientId = patientId;
        if (doctorId)
            where.admittingDoctorId = doctorId;
        if (bedId)
            where.bedId = bedId;
        if (admissionType)
            where.admissionType = admissionType;
        if (status)
            where.status = status;
        if (activeOnly)
            where.status = (0, typeorm_2.Not)((0, typeorm_2.In)([admission_status_enum_1.AdmissionStatus.DISCHARGED, admission_status_enum_1.AdmissionStatus.LAMA, admission_status_enum_1.AdmissionStatus.DAMA, admission_status_enum_1.AdmissionStatus.ABSCONDED, admission_status_enum_1.AdmissionStatus.DECEASED]));
        if (admissionDateFrom && admissionDateTo) {
            where.admissionDate = (0, typeorm_2.Between)(new Date(admissionDateFrom), new Date(admissionDateTo));
        }
        else if (admissionDateFrom) {
            where.admissionDate = (0, typeorm_2.Between)(new Date(admissionDateFrom), new Date());
        }
        if (dischargeDateFrom && dischargeDateTo) {
            where.dischargeDate = (0, typeorm_2.Between)(new Date(dischargeDateFrom), new Date(dischargeDateTo));
        }
        else if (dischargeDateFrom) {
            where.dischargeDate = (0, typeorm_2.Between)(new Date(dischargeDateFrom), new Date());
        }
        if (searchTerm) {
            where.admissionNumber = (0, typeorm_2.Like)(`%${searchTerm}%`);
        }
        if (wardId) {
            where.bed = { wardId };
        }
        const [admissions, total] = await this.admissionRepository.findAndCount({
            where,
            relations,
            order: { [sortBy]: sortOrder },
            skip,
            take: limit,
        });
        return {
            data: admissions.map(admission => new admission_response_dto_1.AdmissionResponseDto(admission)),
            total,
        };
    }
    async findOne(id) {
        const admission = await this.admissionRepository.findOne({
            where: { id },
            relations: ['patient', 'admittingDoctor', 'bed', 'bed.ward', 'documents'],
        });
        if (!admission) {
            throw new common_1.NotFoundException(`Admission with ID ${id} not found`);
        }
        return new admission_response_dto_1.AdmissionResponseDto(admission);
    }
    async update(id, updateAdmissionDto, userId) {
        const admission = await this.admissionRepository.findOne({
            where: { id },
            relations: ['patient', 'admittingDoctor', 'bed'],
        });
        if (!admission) {
            throw new common_1.NotFoundException(`Admission with ID ${id} not found`);
        }
        if (updateAdmissionDto.bedId && updateAdmissionDto.bedId !== admission.bedId) {
            const newBed = await this.bedRepository.findOne(updateAdmissionDto.bedId);
            if (!newBed) {
                throw new common_1.NotFoundException(`New bed with ID ${updateAdmissionDto.bedId} not found`);
            }
            if (newBed.status !== bed_status_enum_1.BedStatus.AVAILABLE) {
                throw new common_1.ConflictException(`Bed ${newBed.bedNumber} is not available`);
            }
            await this.bedService.updateBedStatus(admission.bedId, bed_status_enum_1.BedStatus.AVAILABLE, userId);
            await this.bedService.updateBedStatus(newBed.id, bed_status_enum_1.BedStatus.OCCUPIED, userId);
            admission.bed = newBed;
            admission.bedId = newBed.id;
        }
        if (updateAdmissionDto.status) {
            admission.status = updateAdmissionDto.status;
            if (updateAdmissionDto.status === admission_status_enum_1.AdmissionStatus.DISCHARGED && !admission.dischargeDate) {
                admission.dischargeDate = updateAdmissionDto.dischargeDate || new Date();
                await this.bedService.updateBedStatus(admission.bedId, bed_status_enum_1.BedStatus.AVAILABLE, userId);
            }
        }
        Object.assign(admission, {
            ...updateAdmissionDto,
            updatedBy: userId,
            updatedAt: new Date(),
        });
        const updatedAdmission = await this.admissionRepository.save(admission);
        return new admission_response_dto_1.AdmissionResponseDto(updatedAdmission);
    }
    async remove(id, userId) {
        const admission = await this.admissionRepository.findOne(id, {
            relations: ['bed'],
        });
        if (!admission) {
            throw new common_1.NotFoundException(`Admission with ID ${id} not found`);
        }
        if (![admission_status_enum_1.AdmissionStatus.DISCHARGED, admission_status_enum_1.AdmissionStatus.LAMA, admission_status_enum_1.AdmissionStatus.DAMA, admission_status_enum_1.AdmissionStatus.ABSCONDED, admission_status_enum_1.AdmissionStatus.DECEASED].includes(admission.status)) {
            throw new common_1.BadRequestException('Cannot delete an active admission. Please discharge the patient first.');
        }
        if (admission.bed && admission.bed.status === bed_status_enum_1.BedStatus.OCCUPIED) {
            await this.bedService.updateBedStatus(admission.bedId, bed_status_enum_1.BedStatus.AVAILABLE, userId);
        }
        await this.admissionRepository.softDelete(id);
    }
    async getActiveAdmissionByPatientId(patientId) {
        const admission = await this.admissionRepository.findOne({
            where: {
                patientId,
                status: (0, typeorm_2.Not)((0, typeorm_2.In)([admission_status_enum_1.AdmissionStatus.DISCHARGED, admission_status_enum_1.AdmissionStatus.LAMA, admission_status_enum_1.AdmissionStatus.DAMA, admission_status_enum_1.AdmissionStatus.ABSCONDED, admission_status_enum_1.AdmissionStatus.DECEASED])),
            },
            relations: ['patient', 'admittingDoctor', 'bed', 'bed.ward'],
        });
        return admission ? new admission_response_dto_1.AdmissionResponseDto(admission) : null;
    }
    async getAdmissionStatistics() {
        const totalAdmissions = await this.admissionRepository.count();
        const activeAdmissions = await this.admissionRepository.count({
            where: {
                status: (0, typeorm_2.Not)((0, typeorm_2.In)([admission_status_enum_1.AdmissionStatus.DISCHARGED, admission_status_enum_1.AdmissionStatus.LAMA, admission_status_enum_1.AdmissionStatus.DAMA, admission_status_enum_1.AdmissionStatus.ABSCONDED, admission_status_enum_1.AdmissionStatus.DECEASED])),
            },
        });
        const admissionsByType = await this.admissionRepository
            .createQueryBuilder('admission')
            .select('admission.admissionType', 'type')
            .addSelect('COUNT(*)', 'count')
            .groupBy('admission.admissionType')
            .getRawMany();
        return {
            totalAdmissions,
            activeAdmissions,
            admissionsByType: admissionsByType.reduce((acc, { type, count }) => ({
                ...acc,
                [type]: parseInt(count, 10),
            }), {}),
        };
    }
};
exports.AdmissionService = AdmissionService;
exports.AdmissionService = AdmissionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admission_entity_1.Admission)),
    __param(1, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(2, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __param(3, (0, typeorm_1.InjectRepository)(bed_entity_1.Bed)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => bed_service_1.BedService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository, typeof (_a = typeof bed_service_1.BedService !== "undefined" && bed_service_1.BedService) === "function" ? _a : Object])
], AdmissionService);
//# sourceMappingURL=admission.service.js.map