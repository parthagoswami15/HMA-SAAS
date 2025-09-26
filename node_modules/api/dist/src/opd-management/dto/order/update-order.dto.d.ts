import { CreateOrderDto, OrderItemDto } from './create-order.dto';
export declare enum OrderStatus {
    DRAFT = "DRAFT",
    REQUESTED = "REQUESTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    REJECTED = "REJECTED",
    FAILED = "FAILED"
}
export declare class UpdateOrderItemDto extends OrderItemDto {
    id?: string;
    status?: OrderStatus;
    result?: string;
    completedAt?: Date;
    completedById?: string;
    notes?: string;
}
declare const UpdateOrderDto_base: import("@nestjs/common").Type<Partial<CreateOrderDto>>;
export declare class UpdateOrderDto extends UpdateOrderDto_base {
    status?: OrderStatus;
    items?: UpdateOrderItemDto[];
    completedAt?: Date;
    completedById?: string;
    cancellationReason?: string;
    cancelledAt?: Date;
    cancelledById?: string;
}
export {};
