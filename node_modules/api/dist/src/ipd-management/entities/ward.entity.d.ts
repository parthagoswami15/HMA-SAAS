import { Bed } from './bed.entity';
export declare class Ward {
    id: string;
    name: string;
    description: string;
    code: string;
    floor: number;
    type: string;
    isActive: boolean;
    beds: Bed[];
    createdAt: Date;
    updatedAt: Date;
}
