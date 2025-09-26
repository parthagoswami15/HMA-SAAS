import { Repository } from 'typeorm';
import { Icd10Code } from '../entities/icd10-code.entity';
import { PaginationParams } from '../../common/dto/pagination-params.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
export declare class Icd10Repository extends Repository<Icd10Code> {
    search(query: string, { page, limit }?: PaginationParams, options?: {
        exactMatch?: boolean;
        includeChapters?: boolean;
        includeBlocks?: boolean;
        category?: string;
        sex?: 'male' | 'female';
        age?: number;
    }): Promise<PaginatedResult<Icd10Code>>;
    findByCode(code: string): Promise<Icd10Code | undefined>;
    findChapters(): Promise<Icd10Code[]>;
    findBlocksByChapter(chapterCode: string): Promise<Icd10Code[]>;
    findCodesByBlock(blockCode: string): Promise<Icd10Code[]>;
    autocomplete(query: string, limit?: number): Promise<Array<{
        code: string;
        description: string;
    }>>;
    getCodeHierarchy(code: string): Promise<{
        chapter: Icd10Code | null;
        block: Icd10Code | null;
        code: Icd10Code | null;
    }>;
}
