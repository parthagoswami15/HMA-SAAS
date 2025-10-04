import { EntityRepository, Repository, Between, In, Not, IsNull } from 'typeorm';
import { Order, OrderStatus, OrderType } from '../entities/order.entity';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async findByVisitId(visitId: string): Promise<Order[]> {
    return this.find({
      where: { visitId },
      relations: ['provider', 'items'],
      order: { orderDate: 'DESC' },
    });
  }

  async findByPatientId(patientId: string, status?: OrderStatus): Promise<Order[]> {
    const where: any = { patientId };
    if (status) where.status = status;

    return this.find({
      where,
      relations: ['provider', 'visit'],
      order: { orderDate: 'DESC' },
    });
  }

  async findPendingOrders(providerId?: string): Promise<Order[]> {
    const where: any = { 
      status: In([OrderStatus.REQUESTED, OrderStatus.IN_PROGRESS]) 
    };
    
    if (providerId) where.providerId = providerId;

    return this.find({
      where,
      relations: ['patient', 'provider', 'visit'],
      order: { 
        priority: 'DESC',
        orderDate: 'ASC' 
      },
    });
  }

  async findOrdersByType(
    type: OrderType,
    status?: OrderStatus,
    startDate?: Date,
    endDate?: Date
  ): Promise<Order[]> {
    const where: any = { type };
    if (status) where.status = status;
    if (startDate && endDate) {
      where.orderDate = Between(startDate, endDate);
    }

    return this.find({
      where,
      relations: ['patient', 'provider', 'visit'],
      order: { orderDate: 'DESC' },
    });
  }

  async getOrderStats(providerId?: string): Promise<{
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    cancelled: number;
    byType: Record<string, number>;
  }> {
    const where: any = {};
    if (providerId) where.providerId = providerId;

    const [total, completed, pending, inProgress, cancelled] = await Promise.all([
      this.count({ where }),
      this.count({ where: { ...where, status: OrderStatus.COMPLETED } }),
      this.count({ where: { ...where, status: OrderStatus.REQUESTED } }),
      this.count({ where: { ...where, status: OrderStatus.IN_PROGRESS } }),
      this.count({ where: { ...where, status: OrderStatus.CANCELLED } }),
    ]);

    // Get count by order type
    const typeResults = await this.createQueryBuilder('order')
      .select('order.type', 'type')
      .addSelect('COUNT(order.id)', 'count')
      .where(providerId ? 'order.providerId = :providerId' : '1=1', { providerId })
      .groupBy('order.type')
      .getRawMany();

    const byType = typeResults.reduce((acc, { type, count }) => ({
      ...acc,
      [type]: parseInt(count, 10),
    }), {});

    return {
      total,
      completed,
      pending,
      inProgress,
      cancelled,
      byType,
    };
  }

  async findOrdersNeedingAttention(providerId?: string): Promise<Order[]> {
    const query = this.createQueryBuilder('order')
      .where('order.status IN (:...statuses)', {
        statuses: [OrderStatus.REQUESTED, OrderStatus.IN_PROGRESS],
      })
      .andWhere('order.dueDate <= :today', { today: new Date() })
      .orderBy('order.priority', 'DESC')
      .addOrderBy('order.dueDate', 'ASC');

    if (providerId) {
      query.andWhere('order.providerId = :providerId', { providerId });
    }

    return query
      .leftJoinAndSelect('order.patient', 'patient')
      .leftJoinAndSelect('order.provider', 'provider')
      .getMany();
  }

  async findOrdersByItem(
    itemName: string,
    type?: OrderType
  ): Promise<Order[]> {
    const query = this.createQueryBuilder('order')
      .innerJoin('order.items', 'item')
      .where('LOWER(item.name) LIKE LOWER(:name)', { name: `%${itemName}%` });

    if (type) {
      query.andWhere('order.type = :type', { type });
    }

    return query
      .leftJoinAndSelect('order.patient', 'patient')
      .leftJoinAndSelect('order.provider', 'provider')
      .orderBy('order.orderDate', 'DESC')
      .getMany();
  }
}
