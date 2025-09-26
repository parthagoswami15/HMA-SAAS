import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class FhirService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    getPatient(patientId: string, user: any): Promise<{
        resourceType: string;
        id: any;
        identifier: {
            system: string;
            value: any;
        }[];
        name: {
            use: string;
            family: any;
            given: any[];
        }[];
        telecom: {
            system: string;
            value: any;
            use: string;
        }[];
        gender: any;
        birthDate: any;
        address: {
            use: string;
            line: any[];
            city: any;
            state: any;
            postalCode: any;
            country: string;
        }[];
        managingOrganization: {
            reference: string;
        };
    }>;
    createPatient(patientDto: any, user: any): Promise<{
        resourceType: string;
        id: any;
        identifier: {
            system: string;
            value: any;
        }[];
        name: {
            use: string;
            family: any;
            given: any[];
        }[];
        telecom: {
            system: string;
            value: any;
            use: string;
        }[];
        gender: any;
        birthDate: any;
        address: {
            use: string;
            line: any[];
            city: any;
            state: any;
            postalCode: any;
            country: string;
        }[];
        managingOrganization: {
            reference: string;
        };
    }>;
    updatePatient(patientId: string, patientDto: any, user: any): Promise<{
        resourceType: string;
        id: any;
        identifier: {
            system: string;
            value: any;
        }[];
        name: {
            use: string;
            family: any;
            given: any[];
        }[];
        telecom: {
            system: string;
            value: any;
            use: string;
        }[];
        gender: any;
        birthDate: any;
        address: {
            use: string;
            line: any[];
            city: any;
            state: any;
            postalCode: any;
            country: string;
        }[];
        managingOrganization: {
            reference: string;
        };
    }>;
    getEncounter(encounterId: string, user: any): Promise<{
        resourceType: string;
        id: any;
        identifier: {
            system: string;
            value: any;
        }[];
        status: string;
        class: {
            system: string;
            code: string;
            display: string;
        };
        type: {
            coding: {
                system: string;
                code: string;
                display: any;
            }[];
        }[];
        subject: {
            reference: string;
            display: any;
        };
        participant: {
            type: {
                coding: {
                    system: string;
                    code: string;
                    display: string;
                }[];
            }[];
            individual: {
                reference: string;
                display: any;
            };
        }[];
        period: {
            start: any;
            end: any;
        };
        serviceProvider: {
            reference: string;
        };
    }>;
    createObservation(observationDto: any, user: any): Promise<{
        resourceType: string;
        id: any;
        status: any;
        category: {
            coding: {
                system: string;
                code: any;
                display: any;
            }[];
        }[];
        code: {
            coding: {
                system: string;
                code: any;
                display: any;
            }[];
            text: any;
        };
        subject: {
            reference: string;
        };
        effectiveDateTime: any;
        valueQuantity: {
            value: any;
            unit: any;
            system: string;
            code: any;
        } | undefined;
        valueString: any;
        valueCodeableConcept: any;
        interpretation: {
            coding: {
                system: string;
                code: any;
            }[];
        }[] | undefined;
        note: {
            text: any;
        }[] | undefined;
    }>;
    getObservation(observationId: string, user: any): Promise<{
        resourceType: string;
        id: any;
        status: any;
        category: {
            coding: {
                system: string;
                code: any;
                display: any;
            }[];
        }[];
        code: {
            coding: {
                system: string;
                code: any;
                display: any;
            }[];
            text: any;
        };
        subject: {
            reference: string;
        };
        effectiveDateTime: any;
        valueQuantity: {
            value: any;
            unit: any;
            system: string;
            code: any;
        } | undefined;
        valueString: any;
        valueCodeableConcept: any;
        interpretation: {
            coding: {
                system: string;
                code: any;
            }[];
        }[] | undefined;
        note: {
            text: any;
        }[] | undefined;
    }>;
    syncData(resourceType: string, syncFrom: Date, syncTo: Date, tenantId: string): Promise<{
        resourceType: string;
        syncedFrom: Date;
        syncedTo: Date;
        recordsProcessed: number;
        errors: never[];
    }>;
    getStatus(tenantId: string): Promise<{
        integrationType: string;
        status: string;
        lastSyncAt: any;
        isActive: any;
    }>;
    getStats(tenantId: string): Promise<{
        patients: any;
        observations: any;
        encounters: any;
    }>;
    retryOperation(log: any): Promise<{
        success: boolean;
        message: string;
    }>;
    private transformToFhirPatient;
    private transformFromFhirPatient;
    private transformToFhirEncounter;
    private transformToFhirObservation;
    private transformFromFhirObservation;
    private mapAppointmentStatusToFhir;
    private mapAppointmentTypeToSnomed;
}
