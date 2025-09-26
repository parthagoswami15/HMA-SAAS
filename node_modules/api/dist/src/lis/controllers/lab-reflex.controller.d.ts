import { LabReflexService } from '../services/lab-reflex.service';
import { CreateReflexRuleDto, UpdateReflexRuleDto, ReflexRuleResponseDto, ReflexEvaluationDto } from '../dto/lab-reflex.dto';
export declare class LabReflexController {
    private readonly labReflexService;
    constructor(labReflexService: LabReflexService);
    createReflexRule(createReflexRuleDto: CreateReflexRuleDto, tenantId: string): Promise<ReflexRuleResponseDto>;
    getAllReflexRules(tenantId: string): Promise<ReflexRuleResponseDto[]>;
    getReflexRuleById(id: string): Promise<ReflexRuleResponseDto>;
    updateReflexRule(id: string, updateReflexRuleDto: UpdateReflexRuleDto): Promise<ReflexRuleResponseDto>;
    deleteReflexRule(id: string): Promise<{
        message: string;
    }>;
    evaluateReflexRules(orderId: string, results: any[]): Promise<ReflexEvaluationDto>;
    executeReflexActions(orderId: string, actions: any[]): Promise<{
        message: string;
    }>;
}
