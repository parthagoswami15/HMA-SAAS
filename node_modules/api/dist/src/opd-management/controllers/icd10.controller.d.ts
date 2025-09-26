import { Icd10Service } from '../services/icd10.service';
import { PaginationParams } from '../../common/dto/pagination-params.dto';
import { Icd10Code } from '../entities/icd10-code.entity';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
export declare class Icd10Controller {
    private readonly icd10Service;
    constructor(icd10Service: Icd10Service);
    search(query: string, pagination: PaginationParams, exactMatch?: boolean, includeChapters?: boolean, includeBlocks?: boolean, category?: string, sex?: 'male' | 'female', age?: number): Promise<PaginatedResult<Icd10Code>>;
    autocomplete(query: string, limit?: number): Promise<{
        code: string;
        description: string;
    }[]>;
    findOne(code: string): Promise<Icd10Code>;
    getChapters(): Promise<Icd10Code[]>;
    getChapter(chapterCode: string): Promise<Icd10Code>;
    getChapterBlocks(chapterCode: string): Promise<Icd10Code[]>;
    getBlock(blockCode: string): Promise<Icd10Code>;
    getBlockCodes(blockCode: string): Promise<Icd10Code[]>;
    getCodeHierarchy(code: string): Promise<{
        chapter: Icd10Code | null;
        block: Icd10Code | null;
        code: Icd10Code | null;
    }>;
    getCategories(): Promise<string[]>;
    validateCode(code: string, sex?: 'male' | 'female', age?: number): Promise<{
        valid: boolean;
        message?: string;
    }>;
}
