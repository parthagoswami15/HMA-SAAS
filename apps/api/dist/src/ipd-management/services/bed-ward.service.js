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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BedWardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bed_entity_1 = require("../entities/bed.entity");
const ward_entity_1 = require("../entities/ward.entity");
const bed_status_enum_1 = require("../enums/bed-status.enum");
const admission_entity_1 = require("../entities/admission.entity");
let BedWardService = class BedWardService {
    bedRepository;
    wardRepository;
    admissionRepository;
    constructor(bedRepository, wardRepository, admissionRepository) {
        this.bedRepository = bedRepository;
        this.wardRepository = wardRepository;
        this.admissionRepository = admissionRepository;
    }
    async createWard(createWardDto) {
        const { code, name } = createWardDto;
        const existingWard = await this.wardRepository.findOne({
            where: [{ code }, { name }],
        });
        if (existingWard) {
            if (existingWard.code === code) {
                throw new common_1.ConflictException(`Ward with code '${code}' already exists`);
            }
            if (existingWard.name === name) {
                throw new common_1.ConflictException(`Ward with name '${name}' already exists`);
            }
        }
        const ward = this.wardRepository.create(createWardDto);
        return this.wardRepository.save(ward);
    }
    async findAllWards(filterDto = {}) {
        const { search, status, floor, type, page = 1, limit = 10 } = filterDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.name = (0, typeorm_2.Like)(`%${search}%`);
        }
        if (status) {
            where.status = status;
        }
        if (floor) {
            where.floor = floor;
        }
        if (type) {
            where.type = type;
        }
        const [wards, total] = await this.wardRepository.findAndCount({
            where,
            relations: ['beds'],
            skip,
            take: limit,
        });
        return {
            data: wards,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findWardById(id) {
        const ward = await this.wardRepository.findOne({
            where: { id },
            relations: ['beds', 'beds.currentAdmission', 'beds.currentAdmission.patient'],
        });
        if (!ward) {
            throw new common_1.NotFoundException(`Ward with ID ${id} not found`);
        }
        return ward;
    }
    async updateWard(id, updateWardDto) {
        const ward = await this.findWardById(id);
        if (updateWardDto.code || updateWardDto.name) {
            const existingWard = await this.wardRepository.findOne({
                where: [
                    { code: updateWardDto.code },
                    { name: updateWardDto.name },
                ].filter(condition => Object.values(condition)[0] !== undefined),
            });
            if (existingWard && existingWard.id !== id) {
                if (updateWardDto.code && existingWard.code === updateWardDto.code) {
                    throw new common_1.ConflictException(`Ward with code '${updateWardDto.code}' already exists`);
                }
                if (updateWardDto.name && existingWard.name === updateWardDto.name) {
                    throw new common_1.ConflictException(`Ward with name '${updateWardDto.name}' already exists`);
                }
            }
        }
        Object.assign(ward, updateWardDto);
        return this.wardRepository.save(ward);
    }
    async removeWard(id) {
        const ward = await this.findWardById(id);
        const bedCount = await this.bedRepository.count({ where: { wardId: id } });
        if (bedCount > 0) {
            throw new common_1.BadRequestException('Cannot delete ward with existing beds. Please remove all beds first.');
        }
        return this.wardRepository.softRemove(ward);
    }
    async createBed(createBedDto) {
        const { wardId, bedNumber } = createBedDto;
        const ward = await this.wardRepository.findOne(wardId);
        if (!ward) {
            throw new common_1.NotFoundException(`Ward with ID ${wardId} not found`);
        }
        const existingBed = await this.bedRepository.findOne({
            where: { bedNumber, wardId },
        });
        if (existingBed) {
            throw new common_1.ConflictException(`Bed with number '${bedNumber}' already exists in this ward`);
        }
        const bed = this.bedRepository.create({
            ...createBedDto,
            status: bed_status_enum_1.BedStatus.AVAILABLE,
        });
        return this.bedRepository.save(bed);
    }
    async findAllBeds(filterDto = {}) {
        const { wardId, status, bedClass, isIsolation, search, page = 1, limit = 10, } = filterDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (wardId)
            where.wardId = wardId;
        if (status)
            where.status = status;
        if (bedClass)
            where.class = bedClass;
        if (isIsolation !== undefined)
            where.isIsolation = isIsolation === 'true';
        if (search) {
            where.bedNumber = (0, typeorm_2.Like)(`%${search}%`);
        }
        const [beds, total] = await this.bedRepository.findAndCount({
            where,
            relations: ['ward', 'currentAdmission', 'currentAdmission.patient'],
            skip,
            take: limit,
        });
        return {
            data: beds,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findBedById(id) {
        const bed = await this.bedRepository.findOne({
            where: { id },
            relations: ['ward', 'currentAdmission', 'currentAdmission.patient'],
        });
        if (!bed) {
            throw new common_1.NotFoundException(`Bed with ID ${id} not found`);
        }
        return bed;
    }
    async updateBed(id, updateBedDto) {
        const bed = await this.findBedById(id);
        if (updateBedDto.bedNumber && updateBedDto.bedNumber !== bed.bedNumber) {
            const existingBed = await this.bedRepository.findOne({
                where: {
                    bedNumber: updateBedDto.bedNumber,
                    wardId: bed.wardId,
                },
            });
            if (existingBed) {
                throw new common_1.ConflictException(`Bed with number '${updateBedDto.bedNumber}' already exists in this ward`);
            }
        }
        if (updateBedDto.status) {
            delete updateBedDto.status;
        }
        Object.assign(bed, updateBedDto);
        return this.bedRepository.save(bed);
    }
    async updateBedStatus(bedId, status, updatedById) {
        const bed = await this.findBedById(bedId);
        if (bed.status === status) {
            return bed;
        }
        if (status === bed_status_enum_1.BedStatus.OCCUPIED && bed.status !== bed_status_enum_1.BedStatus.AVAILABLE) {
            throw new common_1.BadRequestException(`Cannot set bed to OCCUPIED from ${bed.status} status`);
        }
        bed.status = status;
        bed.updatedBy = updatedById;
        return this.bedRepository.save(bed);
    }
    async removeBed(id) {
        const bed = await this.findBedById(id);
        if (bed.status === bed_status_enum_1.BedStatus.OCCUPIED) {
            throw new common_1.BadRequestException('Cannot delete an occupied bed. Please discharge the patient first.');
        }
        return this.bedRepository.softRemove(bed);
    }
    async getBedAvailability(filters = {}) {
        const { wardId, bedClass, startDate, endDate } = filters;
        const query = this.bedRepository
            .createQueryBuilder('bed')
            .leftJoinAndSelect('bed.ward', 'ward')
            .select([
            'bed.id',
            'bed.bedNumber',
            'bed.status',
            'bed.class',
            'bed.isIsolation',
            'ward.id',
            'ward.name',
            'ward.type',
        ]);
        if (wardId) {
            query.andWhere('bed.wardId = :wardId', { wardId });
        }
        if (bedClass) {
            query.andWhere('bed.class = :bedClass', { bedClass });
        }
        const beds = await query.getMany();
        if (startDate && endDate) {
            const scheduledAdmissions = await this.admissionRepository
                .createQueryBuilder('admission')
                .where('admission.admissionDate BETWEEN :startDate AND :endDate', { startDate, endDate })
                .andWhere('admission.status IN (:...statuses)', {
                statuses: ['ADMITTED', 'TRANSFERRED'],
            })
                .getMany();
            const reservedBedIds = new Set(scheduledAdmissions.map(admission => admission.bedId));
            beds.forEach(bed => {
                if (reservedBedIds.has(bed.id) && bed.status === bed_status_enum_1.BedStatus.AVAILABLE) {
                    bed.status = bed_status_enum_1.BedStatus.RESERVED;
                }
            });
        }
        const totalBeds = beds.length;
        const availableBeds = beds.filter(bed => bed.status === bed_status_enum_1.BedStatus.AVAILABLE).length;
        const occupiedBeds = beds.filter(bed => bed.status === bed_status_enum_1.BedStatus.OCCUPIED).length;
        const reservedBeds = beds.filter(bed => bed.status === bed_status_enum_1.BedStatus.RESERVED).length;
        const maintenanceBeds = beds.filter(bed => bed.status === bed_status_enum_1.BedStatus.MAINTENANCE).length;
        return {
            totalBeds,
            availableBeds,
            occupiedBeds,
            reservedBeds,
            maintenanceBeds,
            occupancyRate: totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0,
            beds,
        };
    }
    async getWardOccupancy(wardId) {
        const ward = await this.findWardById(wardId);
        const totalBeds = await this.bedRepository.count({ where: { wardId } });
        const occupiedBeds = await this.bedRepository.count({
            where: { wardId, status: bed_status_enum_1.BedStatus.OCCUPIED },
        });
        const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
        const currentPatients = await this.bedRepository
            .createQueryBuilder('bed')
            .leftJoinAndSelect('bed.currentAdmission', 'admission')
            .leftJoinAndSelect('admission.patient', 'patient')
            .where('bed.wardId = :wardId', { wardId })
            .andWhere('bed.status = :status', { status: bed_status_enum_1.BedStatus.OCCUPIED })
            .select([
            'bed.id',
            'bed.bedNumber',
            'admission.id',
            'admission.admissionDate',
            'patient.id',
            'patient.firstName',
            'patient.lastName',
            'patient.mrn',
        ])
            .getMany();
        return {
            ward: {
                id: ward.id,
                name: ward.name,
                code: ward.code,
                totalBeds,
                occupiedBeds,
                availableBeds: totalBeds - occupiedBeds,
                occupancyRate,
            },
            currentPatients: currentPatients.map(bed => ({
                bedId: bed.id,
                bedNumber: bed.bedNumber,
                admissionId: bed.currentAdmission?.id,
                admissionDate: bed.currentAdmission?.admissionDate,
                patient: bed.currentAdmission?.patient ? {
                    id: bed.currentAdmission.patient.id,
                    mrn: bed.currentAdmission.patient.mrn,
                    name: `${bed.currentAdmission.patient.firstName} ${bed.currentAdmission.patient.lastName}`,
                } : null,
            })),
        };
    }
};
exports.BedWardService = BedWardService;
exports.BedWardService = BedWardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bed_entity_1.Bed)),
    __param(1, (0, typeorm_1.InjectRepository)(ward_entity_1.Ward)),
    __param(2, (0, typeorm_1.InjectRepository)(admission_entity_1.Admission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BedWardService);
//# sourceMappingURL=bed-ward.service.js.map