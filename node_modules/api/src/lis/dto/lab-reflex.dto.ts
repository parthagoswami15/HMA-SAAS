import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ConditionOperator {
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  EQUAL = 'EQUAL',
  NOT_EQUAL = 'NOT_EQUAL',
  IN_RANGE = 'IN_RANGE',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
}

export enum ReflexActionType {
  ADD_TEST = 'ADD_TEST',
  ADD_PANEL = 'ADD_PANEL',
  NOTIFY = 'NOTIFY',
  COMMENT = 'COMMENT',
  FLAG = 'FLAG',
}

export class ReflexConditionDto {
  @ApiProperty({ enum: ConditionOperator })
  operator: ConditionOperator;

  @ApiProperty()
  analyte: string;

  @ApiProperty()
  value: number;

  @ApiPropertyOptional()
  min?: number;

  @ApiPropertyOptional()
  max?: number;
}

export class ReflexActionDto {
  @ApiProperty({ enum: ReflexActionType })
  type: ReflexActionType;

  @ApiPropertyOptional()
  testId?: string;

  @ApiPropertyOptional()
  panelId?: string;

  @ApiPropertyOptional()
  message?: string;

  @ApiPropertyOptional()
  flag?: string;
}

export class CreateReflexRuleDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsObject()
  condition: ReflexConditionDto;

  @ApiProperty({ type: [ReflexActionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReflexActionDto)
  actions: ReflexActionDto[];

  @ApiProperty()
  @IsNumber()
  priority: number;
}

export class UpdateReflexRuleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  condition?: ReflexConditionDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReflexActionDto)
  actions?: ReflexActionDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priority?: number;
}

export class ReflexRuleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  condition: ReflexConditionDto;

  @ApiProperty({ type: [ReflexActionDto] })
  actions: ReflexActionDto[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  priority: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ReflexEvaluationDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty()
  triggeredRules: string[];

  @ApiProperty({ type: [ReflexActionDto] })
  actions: ReflexActionDto[];

  @ApiProperty()
  evaluatedAt: Date;
}
