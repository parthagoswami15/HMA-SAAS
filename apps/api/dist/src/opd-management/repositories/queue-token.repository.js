"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueTokenRepository = void 0;
const typeorm_1 = require("typeorm");
const queue_token_entity_1 = require("../entities/queue-token.entity");
let QueueTokenRepository = class QueueTokenRepository extends typeorm_1.Repository {
    async getCurrentToken(departmentId) {
        return this.findOne({
            where: {
                departmentId,
                status: (0, typeorm_1.In)([queue_token_entity_1.TokenStatus.CALLED, queue_token_entity_1.TokenStatus.IN_PROGRESS]),
            },
            order: { calledAt: 'DESC' },
            relations: ['visit', 'visit.patient'],
        });
    }
    async getNextInQueue(departmentId) {
        return this.createQueryBuilder('token')
            .where('token.departmentId = :departmentId', { departmentId })
            .andWhere('token.status = :status', { status: queue_token_entity_1.TokenStatus.WAITING })
            .orderBy('token.priority', 'DESC')
            .addOrderBy('token.issuedAt', 'ASC')
            .leftJoinAndSelect('token.visit', 'visit')
            .leftJoinAndSelect('visit.patient', 'patient')
            .getOne();
    }
    async getQueueStats(departmentId) {
        const where = {};
        if (departmentId)
            where.departmentId = departmentId;
        const [waiting, inProgress] = await Promise.all([
            this.count({ where: { ...where, status: queue_token_entity_1.TokenStatus.WAITING } }),
            this.count({ where: { ...where, status: queue_token_entity_1.TokenStatus.IN_PROGRESS } }),
        ]);
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const completedTokens = await this.find({
            where: {
                ...where,
                status: queue_token_entity_1.TokenStatus.COMPLETED,
                calledAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
                completedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
                calledAt: MoreThan(oneDayAgo),
            },
            select: ['calledAt', 'completedAt'],
        });
        let totalWaitTime = 0;
        completedTokens.forEach(token => {
            if (token.calledAt && token.completedAt) {
                totalWaitTime += token.completedAt.getTime() - token.calledAt.getTime();
            }
        });
        const averageWaitTime = completedTokens.length > 0
            ? Math.round(totalWaitTime / completedTokens.length / 1000 / 60)
            : 0;
        const estimatedWaitTime = averageWaitTime * waiting;
        return {
            waiting,
            inProgress,
            averageWaitTime,
            estimatedWaitTime,
        };
    }
    async getPatientQueuePosition(visitId) {
        const token = await this.findOne({
            where: { visitId },
            select: ['id', 'status'],
        });
        if (!token || token.status !== queue_token_entity_1.TokenStatus.WAITING) {
            return -1;
        }
        const result = await this.createQueryBuilder('token')
            .select('COUNT(*)', 'position')
            .where('token.departmentId = (, SELECT, departmentId, FROM, queue_token, WHERE, id = , tokenId);
        ', { tokenId: token.id })
            .andWhere('token.status = :status', { status: queue_token_entity_1.TokenStatus.WAITING })
            .andWhere('(, token.priority > (SELECT), priority, FROM, queue_token, WHERE, id = , tokenId);
        OR(token.priority = (SELECT), priority, FROM, queue_token, WHERE, id = , tokenId);
        AND;
        token.issuedAt <= (SELECT);
        issuedAt;
        FROM;
        queue_token;
        WHERE;
        id = ;
        tokenId;
        ', { tokenId: token.id })
            .getRawOne();
        return parseInt(result?.position || '0', 10) + 1;
    }
    async getDepartmentQueues() {
        return this.createQueryBuilder('token')
            .select('token.departmentId', 'departmentId')
            .addSelect('COUNT(CASE WHEN token.status = :waiting THEN 1 END)', 'waiting')
            .addSelect('COUNT(CASE WHEN token.status = :inProgress THEN 1 END)', 'inProgress')
            .addSelect('MAX(CASE WHEN token.status = :inProgress THEN token.displayNumber END)', 'currentToken')
            .setParameters({
            waiting: queue_token_entity_1.TokenStatus.WAITING,
            inProgress: queue_token_entity_1.TokenStatus.IN_PROGRESS,
        })
            .groupBy('token.departmentId')
            .getRawMany();
    }
};
exports.QueueTokenRepository = QueueTokenRepository;
exports.QueueTokenRepository = QueueTokenRepository = __decorate([
    (0, typeorm_1.EntityRepository)(queue_token_entity_1.QueueToken)
], QueueTokenRepository);
//# sourceMappingURL=queue-token.repository.js.map