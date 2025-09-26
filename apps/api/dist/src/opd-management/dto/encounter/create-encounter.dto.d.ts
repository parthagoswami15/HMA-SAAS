declare class SOAPNoteDto {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
}
declare class DiagnosisDto {
    code: string;
    description?: string;
    isPrimary?: boolean;
    notes?: string;
}
declare class VitalsDto {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
    painLevel?: number;
}
export declare class CreateEncounterDto {
    visitId: string;
    providerId: string;
    encounterType: string;
    startTime?: Date;
    soapNote?: SOAPNoteDto;
    diagnoses?: DiagnosisDto[];
    vitals?: VitalsDto;
    notes?: string;
}
export {};
