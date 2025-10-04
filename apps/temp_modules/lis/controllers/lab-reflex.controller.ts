import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LabReflexService, ReflexRule } from '../services/lab-reflex.service';
import { CreateReflexRuleDto, UpdateReflexRuleDto, ReflexRuleResponseDto, ReflexEvaluationDto } from '../dto/lab-reflex.dto';
import { LabAuthGuard } from '../guards/lab-auth.guard';

@ApiTags('Laboratory Reflex Rules')
@Controller('lab/reflex-rules')
@UseGuards(LabAuthGuard)
@ApiBearerAuth()
export class LabReflexController {
  constructor(private readonly labReflexService: LabReflexService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reflex rule' })
  @ApiResponse({ status: 201, description: 'Reflex rule created successfully' })
  async createReflexRule(
    @Body() createReflexRuleDto: CreateReflexRuleDto,
    @Query('tenantId') tenantId: string,
  ): Promise<ReflexRuleResponseDto> {
    const ruleData = {
      ...createReflexRuleDto,
      tenantId,
      condition: JSON.stringify(createReflexRuleDto.condition),
      actions: createReflexRuleDto.actions,
    };

    return this.labReflexService.createReflexRule(ruleData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reflex rules' })
  @ApiResponse({ status: 200, description: 'Reflex rules retrieved successfully' })
  async getAllReflexRules(@Query('tenantId') tenantId: string): Promise<ReflexRuleResponseDto[]> {
    return this.labReflexService.getAllReflexRules(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reflex rule by ID' })
  @ApiResponse({ status: 200, description: 'Reflex rule retrieved successfully' })
  async getReflexRuleById(@Param('id') id: string): Promise<ReflexRuleResponseDto> {
    return this.labReflexService.getReflexRuleById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update reflex rule' })
  @ApiResponse({ status: 200, description: 'Reflex rule updated successfully' })
  async updateReflexRule(
    @Param('id') id: string,
    @Body() updateReflexRuleDto: UpdateReflexRuleDto,
  ): Promise<ReflexRuleResponseDto> {
    const updateData = {
      ...updateReflexRuleDto,
      ...(updateReflexRuleDto.condition && { condition: JSON.stringify(updateReflexRuleDto.condition) }),
    };

    return this.labReflexService.updateReflexRule(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete reflex rule' })
  @ApiResponse({ status: 200, description: 'Reflex rule deleted successfully' })
  async deleteReflexRule(@Param('id') id: string): Promise<{ message: string }> {
    return this.labReflexService.deleteReflexRule(id);
  }

  @Post('evaluate/:orderId')
  @ApiOperation({ summary: 'Evaluate reflex rules for an order' })
  @ApiResponse({ status: 200, description: 'Reflex rules evaluated successfully' })
  async evaluateReflexRules(
    @Param('orderId') orderId: string,
    @Body('results') results: any[],
  ): Promise<ReflexEvaluationDto> {
    const actions = await this.labReflexService.evaluateReflexRules(orderId, results);

    return {
      orderId,
      triggeredRules: [], // This would be populated by tracking which rules triggered
      actions,
      evaluatedAt: new Date(),
    };
  }

  @Post('execute/:orderId')
  @ApiOperation({ summary: 'Execute reflex actions for an order' })
  @ApiResponse({ status: 200, description: 'Reflex actions executed successfully' })
  async executeReflexActions(
    @Param('orderId') orderId: string,
    @Body('actions') actions: any[],
  ): Promise<{ message: string }> {
    await this.labReflexService.executeReflexActions(orderId, actions);
    return { message: 'Reflex actions executed successfully' };
  }
}
