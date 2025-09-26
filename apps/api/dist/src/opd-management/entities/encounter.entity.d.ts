export declare class SOAPNote {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
}
export declare class Diagnosis {
    code: string;
    description: string;
    isPrimary: boolean;
    notes?: string;
}
export declare class Vitals {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
    bmi?: number;
    painLevel?: number;
}
export declare class Encounter {
    id: string;
    visitId: string;
    providerId: string;
    startTime: Date;
    endTime?: Date;
    encounterType: string;
    soapNote: SOAPNote;
    diagnoses: Diagnosis[];
    vitals?: Vitals;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
