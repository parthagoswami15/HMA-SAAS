import { Diagnosis } from './diagnosis.entity';
export declare class Icd10Code {
    code: string;
    description: string;
    chapterCode: string;
    chapterDescription: string;
    blockCode: string;
    blockDescription: string;
    category: string;
    isHeader: boolean;
    sexRestriction: 'male' | 'female' | null;
    minAge: number | null;
    maxAge: number | null;
    hasSubCodes: boolean;
    isLeaf: boolean;
    metadata: Record<string, any>;
    diagnoses: Diagnosis[];
    getFullDescription(): string;
    isAgeValid(age: number): boolean;
    isSexValid(sex: 'male' | 'female' | null): boolean;
}
