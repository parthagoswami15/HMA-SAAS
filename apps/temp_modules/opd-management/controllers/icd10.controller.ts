import { 
  Controller, 
  Get, 
  Query, 
  Param, 
  UseGuards, 
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery,
  ApiParam
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { Icd10Service } from '../services/icd10.service';
import { PaginationParams } from '../../common/dto/pagination-params.dto';
import { Icd10Code } from '../entities/icd10-code.entity';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@ApiTags('OPD - ICD-10')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('opd/icd10')
export class Icd10Controller {
  constructor(private readonly icd10Service: Icd10Service) {}

  @Get('search')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Search ICD-10 codes' })
  @ApiQuery({ name: 'query', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'exactMatch', required: false, type: Boolean })
  @ApiQuery({ name: 'includeChapters', required: false, type: Boolean })
  @ApiQuery({ name: 'includeBlocks', required: false, type: Boolean })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'sex', required: false, enum: ['male', 'female'] })
  @ApiQuery({ name: 'age', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of matching ICD-10 codes' })
  search(
    @Query('query') query: string,
    @Query() pagination: PaginationParams,
    @Query('exactMatch') exactMatch?: boolean,
    @Query('includeChapters') includeChapters?: boolean,
    @Query('includeBlocks') includeBlocks?: boolean,
    @Query('category') category?: string,
    @Query('sex') sex?: 'male' | 'female',
    @Query('age') age?: number,
  ): Promise<PaginatedResult<Icd10Code>> {
    return this.icd10Service.search(query, pagination, {
      exactMatch: exactMatch === true,
      includeChapters: includeChapters !== false, // Default to true if not specified
      includeBlocks: includeBlocks !== false, // Default to true if not specified
      category,
      sex,
      age: age ? Number(age) : undefined,
    });
  }

  @Get('autocomplete')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Autocomplete ICD-10 codes' })
  @ApiQuery({ name: 'query', required: true, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of matching ICD-10 codes for autocomplete' })
  autocomplete(
    @Query('query') query: string,
    @Query('limit') limit = 10,
  ) {
    if (!query || query.length < 2) {
      throw new BadRequestException('Query must be at least 2 characters long');
    }
    return this.icd10Service.autocomplete(query, Math.min(Number(limit) || 10, 25));
  }

  @Get('code/:code')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get ICD-10 code details' })
  @ApiParam({ name: 'code', description: 'ICD-10 code' })
  @ApiResponse({ status: 200, description: 'ICD-10 code details', type: Icd10Code })
  @ApiResponse({ status: 404, description: 'ICD-10 code not found' })
  findOne(@Param('code') code: string): Promise<Icd10Code> {
    return this.icd10Service.findByCode(code);
  }

  @Get('chapters')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all ICD-10 chapters' })
  @ApiResponse({ status: 200, description: 'List of ICD-10 chapters', type: [Icd10Code] })
  getChapters() {
    return this.icd10Service.getChapters();
  }

  @Get('chapters/:chapterCode')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get ICD-10 chapter details' })
  @ApiParam({ name: 'chapterCode', description: 'ICD-10 chapter code' })
  @ApiResponse({ status: 200, description: 'ICD-10 chapter details', type: Icd10Code })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  getChapter(@Param('chapterCode') chapterCode: string) {
    return this.icd10Service.getChapterByCode(chapterCode);
  }

  @Get('chapters/:chapterCode/blocks')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all blocks in an ICD-10 chapter' })
  @ApiParam({ name: 'chapterCode', description: 'ICD-10 chapter code' })
  @ApiResponse({ status: 200, description: 'List of blocks in the chapter', type: [Icd10Code] })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  getChapterBlocks(@Param('chapterCode') chapterCode: string) {
    return this.icd10Service.getBlocksByChapter(chapterCode);
  }

  @Get('blocks/:blockCode')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get ICD-10 block details' })
  @ApiParam({ name: 'blockCode', description: 'ICD-10 block code' })
  @ApiResponse({ status: 200, description: 'ICD-10 block details', type: Icd10Code })
  @ApiResponse({ status: 404, description: 'Block not found' })
  getBlock(@Param('blockCode') blockCode: string) {
    return this.icd10Service.getBlockByCode(blockCode);
  }

  @Get('blocks/:blockCode/codes')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all codes in an ICD-10 block' })
  @ApiParam({ name: 'blockCode', description: 'ICD-10 block code' })
  @ApiResponse({ status: 200, description: 'List of codes in the block', type: [Icd10Code] })
  @ApiResponse({ status: 404, description: 'Block not found' })
  getBlockCodes(@Param('blockCode') blockCode: string) {
    return this.icd10Service.getCodesByBlock(blockCode);
  }

  @Get('code/:code/hierarchy')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get hierarchy for an ICD-10 code' })
  @ApiParam({ name: 'code', description: 'ICD-10 code' })
  @ApiResponse({ status: 200, description: 'Hierarchy information for the code' })
  getCodeHierarchy(@Param('code') code: string) {
    return this.icd10Service.getCodeHierarchy(code);
  }

  @Get('categories')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all ICD-10 categories' })
  @ApiResponse({ status: 200, description: 'List of ICD-10 categories', type: [String] })
  getCategories() {
    return this.icd10Service.getCategories();
  }

  @Get('validate/:code')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Validate an ICD-10 code' })
  @ApiParam({ name: 'code', description: 'ICD-10 code to validate' })
  @ApiQuery({ name: 'sex', required: false, enum: ['male', 'female'] })
  @ApiQuery({ name: 'age', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Validation result' })
  async validateCode(
    @Param('code') code: string,
    @Query('sex') sex?: 'male' | 'female',
    @Query('age') age?: number,
  ) {
    try {
      const result = await this.icd10Service.validateCode(code, {
        sex,
        age: age ? Number(age) : undefined,
      });
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { valid: false, message: 'Invalid ICD-10 code' };
      }
      throw error;
    }
  }
}
