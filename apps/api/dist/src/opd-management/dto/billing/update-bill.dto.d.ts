import { CreateBillDto, BillStatus, BillItemDto, PaymentDto } from './create-bill.dto';
export declare class UpdateBillItemDto extends BillItemDto {
    id?: string;
    isCancelled?: boolean;
    cancellationReason?: string;
}
export declare class UpdatePaymentDto extends PaymentDto {
    id?: string;
    isRefunded?: boolean;
    refundAmount?: number;
    refundDate?: Date;
    refundReason?: string;
}
declare const UpdateBillDto_base: import("@nestjs/common").Type<Partial<CreateBillDto>>;
export declare class UpdateBillDto extends UpdateBillDto_base {
    status?: BillStatus;
    items?: UpdateBillItemDto[];
    payments?: UpdatePaymentDto[];
    paidAt?: Date;
    paidById?: string;
    cancellationReason?: string;
    cancelledAt?: Date;
    cancelledById?: string;
    writeOffReason?: string;
    writtenOffAt?: Date;
    writtenOffById?: string;
}
export {};
