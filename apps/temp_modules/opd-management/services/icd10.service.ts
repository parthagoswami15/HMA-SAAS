import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class Icd10Service {
  constructor(
    @InjectRepository(Icd10Repository)
    private readonly icd10Repository: Icd10Repository,
  ) {}

  async search(
    query: string,
    pagination?: PaginationParams,
    options: Icd10SearchOptions = {},
  ): Promise<PaginatedResult<Icd10Code>> {
    return this.icd10Repository.search(query, pagination, options);
  }

  async findByCode(code: string): Promise<Icd10Code> {
    const icd10Code = await this.icd10Repository.findByCode(code);
    if (!icd10Code) {
      throw new NotFoundException(`ICD-10 code '${code}' not found`);
    }
    return icd10Code;
  }

  async autocomplete(query: string, limit = 10): Promise<Array<{ code: string; description: string }>> {
    return this.icd10Repository.autocomplete(query, limit);
  }

  async getChapters(): Promise<Icd10Code[]> {
    return this.icd10Repository.findChapters();
  }

  async getChapterByCode(chapterCode: string): Promise<Icd10Code> {
    const chapter = (await this.icd10Repository.findChapters()).find(
      (c) => c.code === chapterCode,
    );
    if (!chapter) {
      throw new NotFoundException(`Chapter '${chapterCode}' not found`);
    }
    return chapter;
  }

  async getBlocksByChapter(chapterCode: string): Promise<Icd10Code[]> {
    // Verify chapter exists
    await this.getChapterByCode(chapterCode);
    return this.icd10Repository.findBlocksByChapter(chapterCode);
  }

  async getBlockByCode(blockCode: string): Promise<Icd10Code> {
    const blocks = await this.icd10Repository.find({
      where: { code: blockCode, isHeader: true },
    });
    if (blocks.length === 0) {
      throw new NotFoundException(`Block '${blockCode}' not found`);
    }
    return blocks[0];
  }

  async getCodesByBlock(blockCode: string): Promise<Icd10Code[]> {
    // Verify block exists
    await this.getBlockByCode(blockCode);
    return this.icd10Repository.findCodesByBlock(blockCode);
  }

  async getCodeHierarchy(code: string): Promise<{
    chapter: Icd10Code | null;
    block: Icd10Code | null;
    code: Icd10Code | null;
  }> {
    return this.icd10Repository.getCodeHierarchy(code);
  }

  async validateCode(
    code: string,
    options: { sex?: 'male' | 'female'; age?: number } = {},
  ): Promise<{ valid: boolean; message?: string }> {
    try {
      const icd10Code = await this.findByCode(code);

      if (options.sex && !icd10Code.isSexValid(options.sex)) {
        return {
          valid: false,
          message: `This diagnosis code is restricted to ${icd10Code.sexRestriction} patients`,
        };
      }

      if (options.age !== undefined && !icd10Code.isAgeValid(options.age)) {
        return {
          valid: false,
          message: `This diagnosis code is not applicable for the patient's age`,
        };
      }

      return { valid: true };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { valid: false, message: 'Invalid ICD-10 code' };
      }
      throw error;
    }
  }

  async getCategories(): Promise<string[]> {
    const results = await this.icd10Repository
      .createQueryBuilder('code')
      .select('DISTINCT code.category', 'category')
      .where('code.category IS NOT NULL')
      .orderBy('code.category', 'ASC')
      .getRawMany();

    return results.map((r) => r.category);
  }
}
