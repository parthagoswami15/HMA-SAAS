import { EntityRepository, Repository, Between, In, Not, IsNull } from 'typeorm';
import { QueueToken, TokenStatus } from '../entities/queue-token.entity';

@EntityRepository(QueueToken)
export class QueueTokenRepository extends Repository<QueueToken> {
  async getCurrentToken(departmentId: string): Promise<QueueToken | null> {
    return this.findOne({
      where: {
        departmentId,
        status: In([TokenStatus.CALLED, TokenStatus.IN_PROGRESS]),
      },
      order: { calledAt: 'DESC' },
      relations: ['visit', 'visit.patient'],
    });
  }

  async getNextInQueue(departmentId: string): Promise<QueueToken | null> {
    return this.createQueryBuilder('token')
      .where('token.departmentId = :departmentId', { departmentId })
      .andWhere('token.status = :status', { status: TokenStatus.WAITING })
      .orderBy('token.priority', 'DESC')
      .addOrderBy('token.issuedAt', 'ASC')
      .leftJoinAndSelect('token.visit', 'visit')
      .leftJoinAndSelect('visit.patient', 'patient')
      .getOne();
  }

  async getQueueStats(departmentId?: string): Promise<{
    waiting: number;
    inProgress: number;
    averageWaitTime: number;
    estimatedWaitTime: number;
  }> {
    const where: any = {};
    if (departmentId) where.departmentId = departmentId;

    const [waiting, inProgress] = await Promise.all([
      this.count({ where: { ...where, status: TokenStatus.WAITING } }),
      this.count({ where: { ...where, status: TokenStatus.IN_PROGRESS } }),
    ]);

    // Calculate average wait time for completed tokens in the last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const completedTokens = await this.find({
      where: {
        ...where,
        status: TokenStatus.COMPLETED,
        calledAt: Not(IsNull()),
        completedAt: Not(IsNull()),
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
      ? Math.round(totalWaitTime / completedTokens.length / 1000 / 60) // in minutes
      : 0;

    // Estimate wait time for next patient
    const estimatedWaitTime = averageWaitTime * waiting;

    return {
      waiting,
      inProgress,
      averageWaitTime,
      estimatedWaitTime,
    };
  }

  async getPatientQueuePosition(visitId: string): Promise<number> {
    const token = await this.findOne({ 
      where: { visitId },
      select: ['id', 'status'],
    });

    if (!token || token.status !== TokenStatus.WAITING) {
      return -1; // Not in queue or already being served
    }

    const result = await this.createQueryBuilder('token')
      .select('COUNT(*)', 'position')
      .where('token.departmentId = (
        SELECT departmentId FROM queue_token WHERE id = :tokenId
      )', { tokenId: token.id })
      .andWhere('token.status = :status', { status: TokenStatus.WAITING })
      .andWhere('(
        token.priority > (SELECT priority FROM queue_token WHERE id = :tokenId) OR
        (token.priority = (SELECT priority FROM queue_token WHERE id = :tokenId) AND
         token.issuedAt <= (SELECT issuedAt FROM queue_token WHERE id = :tokenId))
      )', { tokenId: token.id })
      .getRawOne();

    return parseInt(result?.position || '0', 10) + 1;
  }

  async getDepartmentQueues(): Promise<Array<{
    departmentId: string;
    departmentName: string;
    waiting: number;
    inProgress: number;
    currentToken: string | null;
  }>> {
    // This is a simplified version - you'll need to join with department table
    // and adjust fields based on your actual schema
    return this.createQueryBuilder('token')
      .select('token.departmentId', 'departmentId')
      .addSelect('COUNT(CASE WHEN token.status = :waiting THEN 1 END)', 'waiting')
      .addSelect('COUNT(CASE WHEN token.status = :inProgress THEN 1 END)', 'inProgress')
      .addSelect('MAX(CASE WHEN token.status = :inProgress THEN token.displayNumber END)', 'currentToken')
      .setParameters({
        waiting: TokenStatus.WAITING,
        inProgress: TokenStatus.IN_PROGRESS,
      })
      .groupBy('token.departmentId')
      .getRawMany();
  }
}
