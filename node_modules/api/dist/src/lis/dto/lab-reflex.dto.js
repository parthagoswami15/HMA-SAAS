"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflexEvaluationDto = exports.ReflexRuleResponseDto = exports.UpdateReflexRuleDto = exports.CreateReflexRuleDto = exports.ReflexActionDto = exports.ReflexConditionDto = exports.ReflexActionType = exports.ConditionOperator = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var ConditionOperator;
(function (ConditionOperator) {
    ConditionOperator["GREATER_THAN"] = "GREATER_THAN";
    ConditionOperator["LESS_THAN"] = "LESS_THAN";
    ConditionOperator["EQUAL"] = "EQUAL";
    ConditionOperator["NOT_EQUAL"] = "NOT_EQUAL";
    ConditionOperator["IN_RANGE"] = "IN_RANGE";
    ConditionOperator["OUT_OF_RANGE"] = "OUT_OF_RANGE";
})(ConditionOperator || (exports.ConditionOperator = ConditionOperator = {}));
var ReflexActionType;
(function (ReflexActionType) {
    ReflexActionType["ADD_TEST"] = "ADD_TEST";
    ReflexActionType["ADD_PANEL"] = "ADD_PANEL";
    ReflexActionType["NOTIFY"] = "NOTIFY";
    ReflexActionType["COMMENT"] = "COMMENT";
    ReflexActionType["FLAG"] = "FLAG";
})(ReflexActionType || (exports.ReflexActionType = ReflexActionType = {}));
class ReflexConditionDto {
    operator;
    analyte;
    value;
    min;
    max;
}
exports.ReflexConditionDto = ReflexConditionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ConditionOperator }),
    __metadata("design:type", String)
], ReflexConditionDto.prototype, "operator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReflexConditionDto.prototype, "analyte", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReflexConditionDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ReflexConditionDto.prototype, "min", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ReflexConditionDto.prototype, "max", void 0);
class ReflexActionDto {
    type;
    testId;
    panelId;
    message;
    flag;
}
exports.ReflexActionDto = ReflexActionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ReflexActionType }),
    __metadata("design:type", String)
], ReflexActionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ReflexActionDto.prototype, "testId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ReflexActionDto.prototype, "panelId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ReflexActionDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ReflexActionDto.prototype, "flag", void 0);
class CreateReflexRuleDto {
    name;
    description;
    condition;
    actions;
    priority;
}
exports.CreateReflexRuleDto = CreateReflexRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReflexRuleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReflexRuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", ReflexConditionDto)
], CreateReflexRuleDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ReflexActionDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReflexActionDto),
    __metadata("design:type", Array)
], CreateReflexRuleDto.prototype, "actions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateReflexRuleDto.prototype, "priority", void 0);
class UpdateReflexRuleDto {
    name;
    description;
    condition;
    actions;
    isActive;
    priority;
}
exports.UpdateReflexRuleDto = UpdateReflexRuleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateReflexRuleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateReflexRuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", ReflexConditionDto)
], UpdateReflexRuleDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReflexActionDto),
    __metadata("design:type", Array)
], UpdateReflexRuleDto.prototype, "actions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateReflexRuleDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateReflexRuleDto.prototype, "priority", void 0);
class ReflexRuleResponseDto {
    id;
    name;
    description;
    condition;
    actions;
    isActive;
    priority;
    createdAt;
    updatedAt;
}
exports.ReflexRuleResponseDto = ReflexRuleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReflexRuleResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReflexRuleResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReflexRuleResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", ReflexConditionDto)
], ReflexRuleResponseDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ReflexActionDto] }),
    __metadata("design:type", Array)
], ReflexRuleResponseDto.prototype, "actions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ReflexRuleResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReflexRuleResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ReflexRuleResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ReflexRuleResponseDto.prototype, "updatedAt", void 0);
class ReflexEvaluationDto {
    orderId;
    triggeredRules;
    actions;
    evaluatedAt;
}
exports.ReflexEvaluationDto = ReflexEvaluationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReflexEvaluationDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ReflexEvaluationDto.prototype, "triggeredRules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ReflexActionDto] }),
    __metadata("design:type", Array)
], ReflexEvaluationDto.prototype, "actions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ReflexEvaluationDto.prototype, "evaluatedAt", void 0);
//# sourceMappingURL=lab-reflex.dto.js.map