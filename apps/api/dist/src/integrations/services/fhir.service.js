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
var FhirService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FhirService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let FhirService = FhirService_1 = class FhirService {
    prisma;
    auditService;
    logger = new common_1.Logger(FhirService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async getPatient(patientId, user) {
        this.logger.log(`Getting FHIR patient: ${patientId}`);
        const patient = await this.prisma.patient.findUnique({
            where: { id: patientId },
            include: {
                profile: true,
                appointments: {
                    select: {
                        id: true,
                        appointmentType: true,
                        scheduledAt: true,
                        status: true,
                    },
                },
                reports: {
                    select: {
                        id: true,
                        reportType: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        return this.transformToFhirPatient(patient);
    }
    async createPatient(patientDto, user) {
        this.logger.log(`Creating FHIR patient`);
        const { resource } = patientDto;
        const patientData = this.transformFromFhirPatient(resource);
        const patient = await this.prisma.patient.create({
            data: {
                ...patientData,
                tenantId: user.tenantId,
            },
        });
        await this.auditService.logActivity({
            action: 'FHIR_PATIENT_CREATED',
            entityType: 'PATIENT',
            entityId: patient.id,
            userId: user.id,
            details: { source: 'FHIR' },
        });
        return {
            resourceType: 'Patient',
            id: patient.id,
            ...this.transformToFhirPatient(patient),
        };
    }
    async updatePatient(patientId, patientDto, user) {
        this.logger.log(`Updating FHIR patient: ${patientId}`);
        const { resource } = patientDto;
        const patient = await this.prisma.patient.findUnique({
            where: { id: patientId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        const patientData = this.transformFromFhirPatient(resource);
        const updatedPatient = await this.prisma.patient.update({
            where: { id: patientId },
            data: patientData,
        });
        await this.auditService.logActivity({
            action: 'FHIR_PATIENT_UPDATED',
            entityType: 'PATIENT',
            entityId: patientId,
            userId: user.id,
            details: { source: 'FHIR' },
        });
        return {
            resourceType: 'Patient',
            id: updatedPatient.id,
            ...this.transformToFhirPatient(updatedPatient),
        };
    }
    async getEncounter(encounterId, user) {
        this.logger.log(`Getting FHIR encounter: ${encounterId}`);
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: encounterId },
            include: {
                patient: { select: { id: true, name: true } },
                doctor: { select: { id: true, name: true } },
                reports: true,
                prescriptions: true,
            },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Encounter not found');
        }
        return this.transformToFhirEncounter(appointment);
    }
    async createObservation(observationDto, user) {
        this.logger.log(`Creating FHIR observation`);
        const { resource } = observationDto;
        const observationData = this.transformFromFhirObservation(resource);
        const observation = await this.prisma.observation.create({
            data: {
                ...observationData,
                tenantId: user.tenantId,
            },
        });
        await this.auditService.logActivity({
            action: 'FHIR_OBSERVATION_CREATED',
            entityType: 'OBSERVATION',
            entityId: observation.id,
            userId: user.id,
            details: { source: 'FHIR' },
        });
        return {
            resourceType: 'Observation',
            id: observation.id,
            ...this.transformToFhirObservation(observation),
        };
    }
    async getObservation(observationId, user) {
        this.logger.log(`Getting FHIR observation: ${observationId}`);
        const observation = await this.prisma.observation.findUnique({
            where: { id: observationId },
        });
        if (!observation) {
            throw new common_1.NotFoundException('Observation not found');
        }
        return {
            resourceType: 'Observation',
            id: observation.id,
            ...this.transformToFhirObservation(observation),
        };
    }
    async syncData(resourceType, syncFrom, syncTo, tenantId) {
        this.logger.log(`Syncing FHIR data: ${resourceType} from ${syncFrom} to ${syncTo}`);
        const syncResult = {
            resourceType,
            syncedFrom: syncFrom,
            syncedTo: syncTo,
            recordsProcessed: 0,
            errors: [],
        };
        await new Promise(resolve => setTimeout(resolve, 1000));
        return syncResult;
    }
    async getStatus(tenantId) {
        this.logger.log(`Getting FHIR status for tenant: ${tenantId}`);
        const config = await this.prisma.integrationConfiguration.findFirst({
            where: {
                tenantId,
                integrationType: 'FHIR',
            },
        });
        return {
            integrationType: 'FHIR',
            status: config?.isActive ? 'HEALTHY' : 'ERROR',
            lastSyncAt: config?.lastSyncAt,
            isActive: config?.isActive || false,
        };
    }
    async getStats(tenantId) {
        this.logger.log(`Getting FHIR stats for tenant: ${tenantId}`);
        const patientCount = await this.prisma.patient.count({ where: { tenantId } });
        const observationCount = await this.prisma.observation.count({ where: { tenantId } });
        const encounterCount = await this.prisma.appointment.count({ where: { tenantId } });
        return {
            patients: patientCount,
            observations: observationCount,
            encounters: encounterCount,
        };
    }
    async retryOperation(log) {
        this.logger.log(`Retrying FHIR operation: ${log.id}`);
        const retryResult = {
            success: true,
            message: 'Operation retried successfully',
        };
        return retryResult;
    }
    transformToFhirPatient(patient) {
        return {
            resourceType: 'Patient',
            id: patient.id,
            identifier: [
                {
                    system: 'http://healthcare.example.com/patient',
                    value: patient.id,
                },
            ],
            name: [
                {
                    use: 'official',
                    family: patient.profile?.lastName || '',
                    given: [patient.profile?.firstName || patient.name || ''],
                },
            ],
            telecom: [
                {
                    system: 'phone',
                    value: patient.phone,
                    use: 'mobile',
                },
                {
                    system: 'email',
                    value: patient.email,
                    use: 'home',
                },
            ],
            gender: patient.profile?.gender?.toLowerCase(),
            birthDate: patient.profile?.dateOfBirth,
            address: [
                {
                    use: 'home',
                    line: [patient.profile?.address],
                    city: patient.profile?.city,
                    state: patient.profile?.state,
                    postalCode: patient.profile?.pincode,
                    country: 'IN',
                },
            ],
            managingOrganization: {
                reference: `Organization/${patient.tenantId}`,
            },
        };
    }
    transformFromFhirPatient(fhirPatient) {
        const name = fhirPatient.name?.[0];
        const telecom = fhirPatient.telecom?.[0];
        const address = fhirPatient.address?.[0];
        return {
            name: `${name?.given?.[0] || ''} ${name?.family || ''}`.trim(),
            phone: telecom?.value || '',
            email: fhirPatient.email || '',
            dateOfBirth: fhirPatient.birthDate ? new Date(fhirPatient.birthDate) : null,
            gender: fhirPatient.gender?.toUpperCase(),
            address: address?.line?.[0] || '',
            city: address?.city || '',
            state: address?.state || '',
            pincode: address?.postalCode || '',
        };
    }
    transformToFhirEncounter(appointment) {
        return {
            resourceType: 'Encounter',
            id: appointment.id,
            identifier: [
                {
                    system: 'http://healthcare.example.com/appointment',
                    value: appointment.id,
                },
            ],
            status: this.mapAppointmentStatusToFhir(appointment.status),
            class: {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
                code: 'AMB',
                display: 'ambulatory',
            },
            type: [
                {
                    coding: [
                        {
                            system: 'http://snomed.info/sct',
                            code: this.mapAppointmentTypeToSnomed(appointment.appointmentType),
                            display: appointment.appointmentType,
                        },
                    ],
                },
            ],
            subject: {
                reference: `Patient/${appointment.patientId}`,
                display: appointment.patient.name,
            },
            participant: [
                {
                    type: [
                        {
                            coding: [
                                {
                                    system: 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
                                    code: 'ATND',
                                    display: 'attender',
                                },
                            ],
                        },
                    ],
                    individual: {
                        reference: `Practitioner/${appointment.doctorId}`,
                        display: appointment.doctor.name,
                    },
                },
            ],
            period: {
                start: appointment.scheduledAt,
                end: appointment.scheduledAt,
            },
            serviceProvider: {
                reference: `Organization/${appointment.tenantId}`,
            },
        };
    }
    transformToFhirObservation(observation) {
        return {
            resourceType: 'Observation',
            id: observation.id,
            status: observation.status?.toLowerCase() || 'final',
            category: [
                {
                    coding: [
                        {
                            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                            code: observation.category || 'vital-signs',
                            display: observation.category || 'Vital Signs',
                        },
                    ],
                },
            ],
            code: {
                coding: [
                    {
                        system: 'http://loinc.org',
                        code: observation.code || '85354-9',
                        display: observation.name || 'Blood pressure panel',
                    },
                ],
                text: observation.name || 'Blood pressure panel',
            },
            subject: {
                reference: `Patient/${observation.patientId}`,
            },
            effectiveDateTime: observation.effectiveDateTime,
            valueQuantity: observation.valueQuantity ? {
                value: observation.valueQuantity.value,
                unit: observation.valueQuantity.unit,
                system: 'http://unitsofmeasure.org',
                code: observation.valueQuantity.code,
            } : undefined,
            valueString: observation.valueString,
            valueCodeableConcept: observation.valueCodeableConcept,
            interpretation: observation.interpretation ? [
                {
                    coding: [
                        {
                            system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
                            code: observation.interpretation,
                        },
                    ],
                },
            ] : undefined,
            note: observation.note ? [
                {
                    text: observation.note,
                },
            ] : undefined,
        };
    }
    transformFromFhirObservation(fhirObservation) {
        const valueQuantity = fhirObservation.valueQuantity;
        const code = fhirObservation.code?.coding?.[0];
        return {
            patientId: fhirObservation.subject?.reference?.split('/')[1],
            name: fhirObservation.code?.text || code?.display,
            status: fhirObservation.status?.toUpperCase(),
            category: fhirObservation.category?.[0]?.coding?.[0]?.code,
            code: code?.code,
            effectiveDateTime: fhirObservation.effectiveDateTime,
            valueQuantity: valueQuantity ? {
                value: valueQuantity.value,
                unit: valueQuantity.unit,
                code: valueQuantity.code,
            } : null,
            valueString: fhirObservation.valueString,
            valueCodeableConcept: fhirObservation.valueCodeableConcept,
            interpretation: fhirObservation.interpretation?.[0]?.coding?.[0]?.code,
            note: fhirObservation.note?.[0]?.text,
        };
    }
    mapAppointmentStatusToFhir(status) {
        const statusMap = {
            SCHEDULED: 'planned',
            CONFIRMED: 'planned',
            IN_PROGRESS: 'in-progress',
            COMPLETED: 'finished',
            CANCELLED: 'cancelled',
            NO_SHOW: 'cancelled',
        };
        return statusMap[status] || 'unknown';
    }
    mapAppointmentTypeToSnomed(appointmentType) {
        const typeMap = {
            GENERAL: '394814009',
            SPECIALIST: '394814009',
            FOLLOW_UP: '394814009',
            EMERGENCY: '394814009',
            TELEMEDICINE: '394814009',
        };
        return typeMap[appointmentType] || '394814009';
    }
};
exports.FhirService = FhirService;
exports.FhirService = FhirService = FhirService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], FhirService);
//# sourceMappingURL=fhir.service.js.map