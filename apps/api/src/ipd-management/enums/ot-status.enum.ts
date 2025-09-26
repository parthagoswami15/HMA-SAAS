/**
 * Enum representing different statuses of an Operation Theater (OT)
 */
export enum OTStatus {
  // Operational Statuses
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  CLEANING = 'CLEANING',
  
  // Scheduling Statuses
  SCHEDULED = 'SCHEDULED',
  PREPARATION = 'PREPARATION',
  IN_USE = 'IN_USE',
  
  // Non-Operational Statuses
  OUT_OF_ORDER = 'OUT_OF_ORDER',
  DECONTAMINATION = 'DECONTAMINATION',
  RENOVATION = 'RENOVATION',
  
  // Emergency Status
  EMERGENCY_USE_ONLY = 'EMERGENCY_USE_ONLY',
  
  // Other
  RESERVED = 'RESERVED',
  CLOSED = 'CLOSED'
}
