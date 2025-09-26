import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ReflexRule {
  id: string;
  name: string;
  description: string;
  condition: string; // JSON condition logic
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

@Injectable()
export class LabReflexService {
  constructor(private prisma: PrismaService) {}

  async createReflexRule(ruleData: Omit<ReflexRule, 'id'>): Promise<ReflexRule> {
    try {
      const rule = await this.prisma.labReflexRule.create({
        data: ruleData,
      });

      return this.mapToReflexRule(rule);
    } catch (error) {
      throw new BadRequestException('Failed to create reflex rule');
    }
  }

  async getAllReflexRules(tenantId: string): Promise<ReflexRule[]> {
    const rules = await this.prisma.labReflexRule.findMany({
      where: { tenantId, isActive: true },
      orderBy: { priority: 'asc' },
    });

    return rules.map(rule => this.mapToReflexRule(rule));
  }

  async getReflexRuleById(id: string): Promise<ReflexRule> {
    const rule = await this.prisma.labReflexRule.findUnique({
      where: { id },
    });

    if (!rule) {
      throw new NotFoundException('Reflex rule not found');
    }

    return this.mapToReflexRule(rule);
  }

  async updateReflexRule(id: string, updateData: Partial<ReflexRule>): Promise<ReflexRule> {
    try {
      const rule = await this.prisma.labReflexRule.update({
        where: { id },
        data: updateData,
      });

      return this.mapToReflexRule(rule);
    } catch (error) {
      throw new BadRequestException('Failed to update reflex rule');
    }
  }

  async deleteReflexRule(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.labReflexRule.delete({
        where: { id },
      });

      return { message: 'Reflex rule deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete reflex rule');
    }
  }

  async evaluateReflexRules(orderId: string, results: any[]): Promise<ReflexAction[]> {
    const tenantId = await this.getTenantIdFromOrder(orderId);
    const rules = await this.getAllReflexRules(tenantId);

    const triggeredActions: ReflexAction[] = [];

    for (const rule of rules) {
      const actions = await this.evaluateRule(rule, results);
      triggeredActions.push(...actions);
    }

    return triggeredActions;
  }

  async executeReflexActions(orderId: string, actions: ReflexAction[]): Promise<void> {
    for (const action of actions) {
      switch (action.type) {
        case 'ADD_TEST':
          await this.addTestToOrder(orderId, action.testId!);
          break;
        case 'ADD_PANEL':
          await this.addPanelToOrder(orderId, action.panelId!);
          break;
        case 'NOTIFY':
          await this.createNotification(orderId, action.message!);
          break;
        case 'COMMENT':
          await this.addCommentToOrder(orderId, action.message!);
          break;
        case 'FLAG':
          await this.flagOrder(orderId, action.flag!);
          break;
      }
    }
  }

  private async evaluateRule(rule: ReflexRule, results: any[]): Promise<ReflexAction[]> {
    // Parse the condition JSON and evaluate against results
    const condition = JSON.parse(rule.condition);

    // Simple condition evaluation (can be extended with more complex logic)
    let conditionMet = false;

    for (const result of results) {
      if (this.evaluateCondition(condition, result)) {
        conditionMet = true;
        break;
      }
    }

    if (conditionMet) {
      return rule.actions;
    }

    return [];
  }

  private evaluateCondition(condition: any, result: any): boolean {
    switch (condition.operator) {
      case 'GREATER_THAN':
        return result.value > condition.value;
      case 'LESS_THAN':
        return result.value < condition.value;
      case 'EQUAL':
        return result.value === condition.value;
      case 'NOT_EQUAL':
        return result.value !== condition.value;
      case 'IN_RANGE':
        return result.value >= condition.min && result.value <= condition.max;
      case 'OUT_OF_RANGE':
        return result.value < condition.min || result.value > condition.max;
      default:
        return false;
    }
  }

  private async getTenantIdFromOrder(orderId: string): Promise<string> {
    const order = await this.prisma.labOrder.findUnique({
      where: { id: orderId },
      select: { tenantId: true },
    });

    return order?.tenantId || '';
  }

  private async addTestToOrder(orderId: string, testId: string): Promise<void> {
    const order = await this.prisma.labOrder.findUnique({
      where: { id: orderId },
      include: { tests: true },
    });

    if (!order) return;

    const testIds = [...order.testIds];
    if (!testIds.includes(testId)) {
      testIds.push(testId);

      await this.prisma.labOrder.update({
        where: { id: orderId },
        data: { testIds },
      });
    }
  }

  private async addPanelToOrder(orderId: string, panelId: string): Promise<void> {
    const panel = await this.prisma.labPanel.findUnique({
      where: { id: panelId },
      include: { tests: true },
    });

    if (!panel) return;

    const order = await this.prisma.labOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) return;

    const testIds = [...order.testIds];
    for (const panelTest of panel.tests) {
      if (!testIds.includes(panelTest.testId)) {
        testIds.push(panelTest.testId);
      }
    }

    await this.prisma.labOrder.update({
      where: { id: orderId },
      data: {
        testIds,
        panelId: panelId,
      },
    });
  }

  private async createNotification(orderId: string, message: string): Promise<void> {
    // This would integrate with a notification system
    await this.prisma.labNotification.create({
      data: {
        orderId,
        message,
        type: 'REFLEX',
        isRead: false,
      },
    });
  }

  private async addCommentToOrder(orderId: string, comment: string): Promise<void> {
    await this.prisma.labOrder.update({
      where: { id: orderId },
      data: {
        clinicalNotes: {
          set: (await this.prisma.labOrder.findUnique({ where: { id: orderId } }))?.clinicalNotes + '\n[REFLEX] ' + comment,
        },
      },
    });
  }

  private async flagOrder(orderId: string, flag: string): Promise<void> {
    // Create a result with a flag
    await this.prisma.labResult.create({
      data: {
        orderId,
        testId: '', // Would need to determine appropriate test
        analyte: 'REFLEX_FLAG',
        textValue: flag,
        flag: 'ABNORMAL',
        validationStatus: 'FINAL',
      },
    });
  }

  private mapToReflexRule(rule: any): ReflexRule {
    return {
      id: rule.id,
      name: rule.name,
      description: rule.description,
      condition: rule.condition,
      actions: rule.actions as ReflexAction[],
      isActive: rule.isActive,
      priority: rule.priority,
      tenantId: rule.tenantId,
    };
  }
}
