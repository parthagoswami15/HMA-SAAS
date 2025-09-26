import { Repository } from 'typeorm';
import { Order, OrderStatus, OrderType } from '../entities/order.entity';
export declare class OrderRepository extends Repository<Order> {
    findByVisitId(visitId: string): Promise<Order[]>;
    findByPatientId(patientId: string, status?: OrderStatus): Promise<Order[]>;
    findPendingOrders(providerId?: string): Promise<Order[]>;
    findOrdersByType(type: OrderType, status?: OrderStatus, startDate?: Date, endDate?: Date): Promise<Order[]>;
    getOrderStats(providerId?: string): Promise<{
        total: number;
        completed: number;
        pending: number;
        inProgress: number;
        cancelled: number;
        byType: Record<string, number>;
    }>;
    findOrdersNeedingAttention(providerId?: string): Promise<Order[]>;
    findOrdersByItem(itemName: string, type?: OrderType): Promise<Order[]>;
}
