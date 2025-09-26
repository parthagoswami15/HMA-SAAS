import { CreateEncounterDto } from './create-encounter.dto';
declare const UpdateEncounterDto_base: import("@nestjs/common").Type<Partial<CreateEncounterDto>>;
export declare class UpdateEncounterDto extends UpdateEncounterDto_base {
    endTime?: Date;
    isCompleted?: boolean;
    completedById?: string;
}
export {};
