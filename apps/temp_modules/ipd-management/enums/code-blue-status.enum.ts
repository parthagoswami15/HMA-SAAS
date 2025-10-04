/**
 * Enum representing different statuses of a Code Blue (medical emergency) event
 */
export enum CodeBlueStatus {
  // Initial Response
  ACTIVATED = 'ACTIVATED',
  RESPONDING = 'RESPONDING',
  
  // In Progress
  IN_PROGRESS = 'IN_PROGRESS',
  RESUSCITATION_IN_PROGRESS = 'RESUSCITATION_IN_PROGRESS',
  
  // Outcomes
  STABILIZED = 'STABILIZED',
  TRANSFERRED = 'TRANSFERRED',
  TRANSFERRED_TO_ICU = 'TRANSFERRED_TO_ICU',
  TRANSFERRED_TO_OR = 'TRANSFERRED_TO_OR',
  
  // Conclusion
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  
  // Unfortunate Outcomes
  DECEASED = 'DECEASED',
  
  // Documentation
  DOCUMENTATION_PENDING = 'DOCUMENTATION_PENDING',
  DOCUMENTATION_COMPLETED = 'DOCUMENTATION_COMPLETED'
}
