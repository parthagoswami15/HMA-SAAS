import { EntityRepository, Repository, Like, In, Between, Not, IsNull } from 'typeorm';
import { Icd10Code } from '../entities/icd10-code.entity';
import { PaginationParams } from '../../common/dto/pagination-params.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@EntityRepository(Icd10Code)
export class Icd10Repository extends Repository<Icd10Code> {
  async search(
    query: string,
    { page = 1, limit = 20 }: PaginationParams = {},
    options: {
      exactMatch?: boolean;
      includeChapters?: boolean;
      includeBlocks?: boolean;
      category?: string;
      sex?: 'male' | 'female';
      age?: number;
    } = {}
  ): Promise<PaginatedResult<Icd10Code>> {
    const { exactMatch = false, includeChapters = true, includeBlocks = true, category, sex, age } = options;
    const skip = (page - 1) * limit;

    let queryBuilder = this.createQueryBuilder('code')
      .where('1=1')
      .take(limit)
      .skip(skip);

    // Apply search query
    if (query) {
      if (exactMatch) {
        queryBuilder = queryBuilder.andWhere('code.code = :query', { query });
      } else {
        const searchTerm = `%${query}%`;
        queryBuilder = queryBuilder.andWhere(
          '(code.code ILIKE :searchTerm OR code.description ILIKE :searchTerm OR code.blockDescription ILIKE :searchTerm OR code.chapterDescription ILIKE :searchTerm)',
          { searchTerm }
        );
      }
    }

    // Filter by category if provided
    if (category) {
      queryBuilder = queryBuilder.andWhere('code.category = :category', { category });
    }

    // Filter by sex if provided
    if (sex) {
      queryBuilder = queryBuilder.andWhere('(code.sexRestriction IS NULL OR code.sexRestriction = :sex)', { sex });
    }

    // Filter by age if provided
    if (age !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        '(code.minAge IS NULL OR code.minAge <= :age) AND (code.maxAge IS NULL OR code.maxAge >= :age)',
        { age }
      );
    }

    // Filter out headers if not explicitly included
    if (!includeChapters) {
      queryBuilder = queryBuilder.andWhere('code.chapterCode IS NULL');
    }
    if (!includeBlocks) {
      queryBuilder = queryBuilder.andWhere('code.blockCode IS NULL');
    }

    // Order by relevance (exact code match first, then description match, then others)
    queryBuilder = queryBuilder.orderBy(
      `CASE 
        WHEN code.code = :exactQuery THEN 1 
        WHEN code.code LIKE :startsWithQuery THEN 2 
        WHEN code.description ILIKE :startsWithDescQuery THEN 3 
        ELSE 4 
      END`,
      'ASC'
    )
    .addOrderBy('code.code', 'ASC')
    .setParameters({
      exactQuery: query,
      startsWithQuery: `${query}%`,
      startsWithDescQuery: `${query}%`,
    });

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByCode(code: string): Promise<Icd10Code | undefined> {
    return this.findOne({ where: { code } });
  }

  async findChapters(): Promise<Icd10Code[]> {
    return this.find({
      where: { isHeader: true, chapterCode: null },
      order: { code: 'ASC' },
    });
  }

  async findBlocksByChapter(chapterCode: string): Promise<Icd10Code[]> {
    return this.find({
      where: { chapterCode, blockCode: null, isHeader: true },
      order: { code: 'ASC' },
    });
  }

  async findCodesByBlock(blockCode: string): Promise<Icd10Code[]> {
    return this.find({
      where: { blockCode, isHeader: false },
      order: { code: 'ASC' },
    });
  }

  async autocomplete(query: string, limit = 10): Promise<Array<{ code: string; description: string }>> {
    const results = await this.createQueryBuilder('code')
      .select(['code.code', 'code.description'])
      .where('code.code ILIKE :query OR code.description ILIKE :query', {
        query: `%${query}%`,
      })
      .andWhere('code.isHeader = false') // Exclude header codes from autocomplete
      .orderBy('code.code', 'ASC')
      .limit(limit)
      .getMany();

    return results.map(({ code, description }) => ({
      code,
      description: `${code} - ${description}`,
    }));
  }

  async getCodeHierarchy(code: string): Promise<{
    chapter: Icd10Code | null;
    block: Icd10Code | null;
    code: Icd10Code | null;
  }> {
    const codeEntity = await this.findOne({ where: { code } });
    if (!codeEntity) {
      return { chapter: null, block: null, code: null };
    }

    const [chapter, block] = await Promise.all([
      codeEntity.chapterCode ? this.findOne({ where: { code: codeEntity.chapterCode } }) : null,
      codeEntity.blockCode ? this.findOne({ where: { code: codeEntity.blockCode } }) : null,
    ]);

    return { chapter, block, code: codeEntity };
  }
}
