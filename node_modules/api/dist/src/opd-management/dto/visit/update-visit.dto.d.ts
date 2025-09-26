import { CreateVisitDto } from './create-visit.dto';
import { VisitStatus } from '../../enums/visit.enum';
declare const UpdateVisitDto_base: import("@nestjs/common").Type<Partial<CreateVisitDto>>;
export declare class UpdateVisitDto extends UpdateVisitDto_base {
    status?: VisitStatus;
    startedAt?: Date;
    completedAt?: Date;
    completedById?: string;
    followUpNotes?: string;
    followUpDate?: Date;
}
export {};
