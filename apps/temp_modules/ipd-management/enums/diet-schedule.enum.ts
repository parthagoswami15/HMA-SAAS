/**
 * Enum representing different diet schedules
 */
export enum DietSchedule {
  // Standard Schedules
  REGULAR = 'REGULAR', // 3 meals + 2-3 snacks
  THREE_MEALS = 'THREE_MEALS',
  SIX_SMALL_MEALS = 'SIX_SMALL_MEALS',
  
  // Hospital Schedules
  HOSPITAL_STANDARD = 'HOSPITAL_STANDARD',
  HOSPITAL_DIABETIC = 'HOSPITAL_DIABETIC',
  
  // Special Schedules
  CONTINUOUS = 'CONTINUOUS', // For tube feeding
  CYCLIC = 'CYCLIC', // For TPN
  
  // Custom
  CUSTOM = 'CUSTOM'
}
