import { Icd10Code } from '../entities/icd10-code.entity';
import { Icd10Repository } from '../repositories/icd10.repository';
import { PaginationParams } from '../../common/dto/pagination-params.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
export interface Icd10SearchOptions {
    exactMatch?: boolean;
    includeChapters?: boolean;
    includeBlocks?: boolean;
    category?: string;
    sex?: 'male' | 'female';
    age?: number;
}
export declare class Icd10Service {
    private readonly icd10Repository;
    constructor(icd10Repository: Icd10Repository);
    search(query: string, pagination?: PaginationParams, options?: Icd10SearchOptions): Promise<PaginatedResult<Icd10Code>>;
    findByCode(code: string): Promise<Icd10Code>;
    autocomplete(query: string, limit?: number): Promise<Array<{
        code: string;
        description: string;
    }>>;
    getChapters(): Promise<Icd10Code[]>;
    getChapterByCode(chapterCode: string): Promise<Icd10Code>;
    getBlocksByChapter(chapterCode: string): Promise<Icd10Code[]>;
    getBlockByCode(blockCode: string): Promise<Icd10Code>;
    getCodesByBlock(blockCode: string): Promise<Icd10Code[]>;
    getCodeHierarchy(code: string): Promise<{
        chapter: Icd10Code | null;
        block: Icd10Code | null;
        code: Icd10Code | null;
    }>;
    validateCode(code: string, options?: {
        sex?: 'male' | 'female';
        age?: number;
    }): Promise<{
        valid: boolean;
        message?: string;
    }>;
    getCategories(): Promise<string[]>;
}
