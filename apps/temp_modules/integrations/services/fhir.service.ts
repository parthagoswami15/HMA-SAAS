import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class FhirService {
  private readonly logger = new Logger(FhirService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getPatient(patientId: string, user: any) {
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
      throw new NotFoundException('Patient not found');
    }

    return this.transformToFhirPatient(patient);
  }

  async createPatient(patientDto: any, user: any) {
    this.logger.log(`Creating FHIR patient`);

    const { resource } = patientDto;

    // Transform FHIR patient to internal format
    const patientData = this.transformFromFhirPatient(resource);

    const patient = await this.prisma.patient.create({
      data: {
        ...patientData,
        tenantId: user.tenantId,
      },
    });

    // Log patient creation
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

  async updatePatient(patientId: string, patientDto: any, user: any) {
    this.logger.log(`Updating FHIR patient: ${patientId}`);

    const { resource } = patientDto;

    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const patientData = this.transformFromFhirPatient(resource);

    const updatedPatient = await this.prisma.patient.update({
      where: { id: patientId },
      data: patientData,
    });

    // Log patient update
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

  async getEncounter(encounterId: string, user: any) {
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
      throw new NotFoundException('Encounter not found');
    }

    return this.transformToFhirEncounter(appointment);
  }

  async createObservation(observationDto: any, user: any) {
    this.logger.log(`Creating FHIR observation`);

    const { resource } = observationDto;

    const observationData = this.transformFromFhirObservation(resource);

    const observation = await this.prisma.observation.create({
      data: {
        ...observationData,
        tenantId: user.tenantId,
      },
    });

    // Log observation creation
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

  async getObservation(observationId: string, user: any) {
    this.logger.log(`Getting FHIR observation: ${observationId}`);

    const observation = await this.prisma.observation.findUnique({
      where: { id: observationId },
    });

    if (!observation) {
      throw new NotFoundException('Observation not found');
    }

    return {
      resourceType: 'Observation',
      id: observation.id,
      ...this.transformToFhirObservation(observation),
    };
  }

  async syncData(resourceType: string, syncFrom: Date, syncTo: Date, tenantId: string) {
    this.logger.log(`Syncing FHIR data: ${resourceType} from ${syncFrom} to ${syncTo}`);

    // In production, this would sync with external FHIR servers
    const syncResult = {
      resourceType,
      syncedFrom: syncFrom,
      syncedTo: syncTo,
      recordsProcessed: 0,
      errors: [],
    };

    // Mock sync process
    await new Promise(resolve => setTimeout(resolve, 1000));

    return syncResult;
  }

  async getStatus(tenantId: string) {
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

  async getStats(tenantId: string) {
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

  async retryOperation(log: any) {
    this.logger.log(`Retrying FHIR operation: ${log.id}`);

    // In production, retry the failed FHIR operation
    const retryResult = {
      success: true,
      message: 'Operation retried successfully',
    };

    return retryResult;
  }

  private transformToFhirPatient(patient: any) {
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

  private transformFromFhirPatient(fhirPatient: any) {
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

  private transformToFhirEncounter(appointment: any) {
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
        end: appointment.scheduledAt, // In production, calculate based on appointment type
      },
      serviceProvider: {
        reference: `Organization/${appointment.tenantId}`,
      },
    };
  }

  private transformToFhirObservation(observation: any) {
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

  private transformFromFhirObservation(fhirObservation: any) {
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

  private mapAppointmentStatusToFhir(status: string): string {
    const statusMap: any = {
      SCHEDULED: 'planned',
      CONFIRMED: 'planned',
      IN_PROGRESS: 'in-progress',
      COMPLETED: 'finished',
      CANCELLED: 'cancelled',
      NO_SHOW: 'cancelled',
    };
    return statusMap[status] || 'unknown';
  }

  private mapAppointmentTypeToSnomed(appointmentType: string): string {
    const typeMap: any = {
      GENERAL: '394814009',
      SPECIALIST: '394814009',
      FOLLOW_UP: '394814009',
      EMERGENCY: '394814009',
      TELEMEDICINE: '394814009',
    };
    return typeMap[appointmentType] || '394814009';
  }
}
