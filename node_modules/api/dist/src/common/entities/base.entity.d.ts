export declare abstract class BaseEntity {
    id: string;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    isActive: boolean;
    setCreatedAt(): void;
    setUpdatedAt(): void;
}
