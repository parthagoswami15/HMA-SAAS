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
exports.LabReflexService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LabReflexService = class LabReflexService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createReflexRule(ruleData) {
        try {
            const rule = await this.prisma.labReflexRule.create({
                data: ruleData,
            });
            return this.mapToReflexRule(rule);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create reflex rule');
        }
    }
    async getAllReflexRules(tenantId) {
        const rules = await this.prisma.labReflexRule.findMany({
            where: { tenantId, isActive: true },
            orderBy: { priority: 'asc' },
        });
        return rules.map(rule => this.mapToReflexRule(rule));
    }
    async getReflexRuleById(id) {
        const rule = await this.prisma.labReflexRule.findUnique({
            where: { id },
        });
        if (!rule) {
            throw new common_1.NotFoundException('Reflex rule not found');
        }
        return this.mapToReflexRule(rule);
    }
    async updateReflexRule(id, updateData) {
        try {
            const rule = await this.prisma.labReflexRule.update({
                where: { id },
                data: updateData,
            });
            return this.mapToReflexRule(rule);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to update reflex rule');
        }
    }
    async deleteReflexRule(id) {
        try {
            await this.prisma.labReflexRule.delete({
                where: { id },
            });
            return { message: 'Reflex rule deleted successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to delete reflex rule');
        }
    }
    async evaluateReflexRules(orderId, results) {
        const tenantId = await this.getTenantIdFromOrder(orderId);
        const rules = await this.getAllReflexRules(tenantId);
        const triggeredActions = [];
        for (const rule of rules) {
            const actions = await this.evaluateRule(rule, results);
            triggeredActions.push(...actions);
        }
        return triggeredActions;
    }
    async executeReflexActions(orderId, actions) {
        for (const action of actions) {
            switch (action.type) {
                case 'ADD_TEST':
                    await this.addTestToOrder(orderId, action.testId);
                    break;
                case 'ADD_PANEL':
                    await this.addPanelToOrder(orderId, action.panelId);
                    break;
                case 'NOTIFY':
                    await this.createNotification(orderId, action.message);
                    break;
                case 'COMMENT':
                    await this.addCommentToOrder(orderId, action.message);
                    break;
                case 'FLAG':
                    await this.flagOrder(orderId, action.flag);
                    break;
            }
        }
    }
    async evaluateRule(rule, results) {
        const condition = JSON.parse(rule.condition);
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
    evaluateCondition(condition, result) {
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
    async getTenantIdFromOrder(orderId) {
        const order = await this.prisma.labOrder.findUnique({
            where: { id: orderId },
            select: { tenantId: true },
        });
        return order?.tenantId || '';
    }
    async addTestToOrder(orderId, testId) {
        const order = await this.prisma.labOrder.findUnique({
            where: { id: orderId },
            include: { tests: true },
        });
        if (!order)
            return;
        const testIds = [...order.testIds];
        if (!testIds.includes(testId)) {
            testIds.push(testId);
            await this.prisma.labOrder.update({
                where: { id: orderId },
                data: { testIds },
            });
        }
    }
    async addPanelToOrder(orderId, panelId) {
        const panel = await this.prisma.labPanel.findUnique({
            where: { id: panelId },
            include: { tests: true },
        });
        if (!panel)
            return;
        const order = await this.prisma.labOrder.findUnique({
            where: { id: orderId },
        });
        if (!order)
            return;
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
    async createNotification(orderId, message) {
        await this.prisma.labNotification.create({
            data: {
                orderId,
                message,
                type: 'REFLEX',
                isRead: false,
            },
        });
    }
    async addCommentToOrder(orderId, comment) {
        await this.prisma.labOrder.update({
            where: { id: orderId },
            data: {
                clinicalNotes: {
                    set: (await this.prisma.labOrder.findUnique({ where: { id: orderId } }))?.clinicalNotes + '\n[REFLEX] ' + comment,
                },
            },
        });
    }
    async flagOrder(orderId, flag) {
        await this.prisma.labResult.create({
            data: {
                orderId,
                testId: '',
                analyte: 'REFLEX_FLAG',
                textValue: flag,
                flag: 'ABNORMAL',
                validationStatus: 'FINAL',
            },
        });
    }
    mapToReflexRule(rule) {
        return {
            id: rule.id,
            name: rule.name,
            description: rule.description,
            condition: rule.condition,
            actions: rule.actions,
            isActive: rule.isActive,
            priority: rule.priority,
            tenantId: rule.tenantId,
        };
    }
};
exports.LabReflexService = LabReflexService;
exports.LabReflexService = LabReflexService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabReflexService);
//# sourceMappingURL=lab-reflex.service.js.map