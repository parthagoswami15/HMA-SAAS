export declare enum ConditionOperator {
    GREATER_THAN = "GREATER_THAN",
    LESS_THAN = "LESS_THAN",
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    IN_RANGE = "IN_RANGE",
    OUT_OF_RANGE = "OUT_OF_RANGE"
}
export declare enum ReflexActionType {
    ADD_TEST = "ADD_TEST",
    ADD_PANEL = "ADD_PANEL",
    NOTIFY = "NOTIFY",
    COMMENT = "COMMENT",
    FLAG = "FLAG"
}
export declare class ReflexConditionDto {
    operator: ConditionOperator;
    analyte: string;
    value: number;
    min?: number;
    max?: number;
}
export declare class ReflexActionDto {
    type: ReflexActionType;
    testId?: string;
    panelId?: string;
    message?: string;
    flag?: string;
}
export declare class CreateReflexRuleDto {
    name: string;
    description: string;
    condition: ReflexConditionDto;
    actions: ReflexActionDto[];
    priority: number;
}
export declare class UpdateReflexRuleDto {
    name?: string;
    description?: string;
    condition?: ReflexConditionDto;
    actions?: ReflexActionDto[];
    isActive?: boolean;
    priority?: number;
}
export declare class ReflexRuleResponseDto {
    id: string;
    name: string;
    description: string;
    condition: ReflexConditionDto;
    actions: ReflexActionDto[];
    isActive: boolean;
    priority: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ReflexEvaluationDto {
    orderId: string;
    triggeredRules: string[];
    actions: ReflexActionDto[];
    evaluatedAt: Date;
}
