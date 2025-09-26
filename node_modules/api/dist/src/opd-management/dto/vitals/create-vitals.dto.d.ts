export declare class CreateVitalsDto {
    visitId: string;
    patientId: string;
    temperature?: number;
    heartRate?: number;
    bloodPressure?: string;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    height?: number;
    weight?: number;
    painScore?: number;
    additionalMetrics?: Record<string, any>;
    notes?: string;
}
