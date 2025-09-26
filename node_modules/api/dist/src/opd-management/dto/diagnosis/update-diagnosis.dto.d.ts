import { CreateDiagnosisDto } from './create-diagnosis.dto';
import { DiagnosisStatus } from '../../entities/diagnosis.entity';
declare const UpdateDiagnosisDto_base: import("@nestjs/common").Type<Partial<CreateDiagnosisDto>>;
export declare class UpdateDiagnosisDto extends UpdateDiagnosisDto_base {
    status?: DiagnosisStatus;
    resolvedDate?: string;
    isPrimary?: boolean;
    notes?: string;
    metadata?: Record<string, any>;
    encounterId?: string | null;
}
export declare class ResolveDiagnosisDto {
    resolvedDate?: string;
    notes?: string;
}
export declare class ReactivateDiagnosisDto {
    notes?: string;
}
export {};
