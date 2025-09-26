/**
 * Enum representing different statuses of billing items
 */
export enum BillingStatus {
  // Initial States
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  
  // Processing States
  PROCESSING = 'PROCESSING',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  
  // Final States
  PAID = 'PAID',
  VOIDED = 'VOIDED',
  REFUNDED = 'REFUNDED',
  WRITTEN_OFF = 'WRITTEN_OFF',
  
  // Insurance Related
  INSURANCE_PENDING = 'INSURANCE_PENDING',
  INSURANCE_APPROVED = 'INSURANCE_APPROVED',
  INSURANCE_REJECTED = 'INSURANCE_REJECTED',
  INSURANCE_PAID = 'INSURANCE_PAID',
  
  // Dispute States
  DISPUTED = 'DISPUTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  
  // Collection States
  SENT_TO_COLLECTIONS = 'SENT_TO_COLLECTIONS',
  COLLECTION_IN_PROGRESS = 'COLLECTION_IN_PROGRESS',
  
  // Custom
  OTHER = 'OTHER'
}
