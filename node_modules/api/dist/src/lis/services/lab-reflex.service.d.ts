import { PrismaService } from '../../prisma/prisma.service';
export interface ReflexRule {
    id: string;
    name: string;
    description: string;
    condition: string;
    actions: ReflexAction[];
    isActive: boolean;
    priority: number;
    tenantId: string;
}
export interface ReflexAction {
    type: 'ADD_TEST' | 'ADD_PANEL' | 'NOTIFY' | 'COMMENT' | 'FLAG';
    testId?: string;
    panelId?: string;
    message?: string;
    flag?: string;
}
export declare class LabReflexService {
    private prisma;
    constructor(prisma: PrismaService);
    createReflexRule(ruleData: Omit<ReflexRule, 'id'>): Promise<ReflexRule>;
    getAllReflexRules(tenantId: string): Promise<ReflexRule[]>;
    getReflexRuleById(id: string): Promise<ReflexRule>;
    updateReflexRule(id: string, updateData: Partial<ReflexRule>): Promise<ReflexRule>;
    deleteReflexRule(id: string): Promise<{
        message: string;
    }>;
    evaluateReflexRules(orderId: string, results: any[]): Promise<ReflexAction[]>;
    executeReflexActions(orderId: string, actions: ReflexAction[]): Promise<void>;
    private evaluateRule;
    private evaluateCondition;
    private getTenantIdFromOrder;
    private addTestToOrder;
    private addPanelToOrder;
    private createNotification;
    private addCommentToOrder;
    private flagOrder;
    private mapToReflexRule;
}
