export declare class CreateLabTestDto {
    name: string;
    code: string;
    description?: string;
    priceCents?: number;
    currency?: string;
}
export declare class CreateLabOrderDto {
    patientId: string;
    testId: string;
}
export declare class CreateLabSampleDto {
    orderId: string;
    sampleType: string;
    collectedAt?: Date;
    collectedBy?: string;
    location?: string;
    notes?: string;
}
export declare class CreateLabResultDto {
    orderId: string;
    testName: string;
    value: string;
    unit?: string;
    referenceRange?: string;
    status?: string;
    reportedBy: string;
    notes?: string;
}
