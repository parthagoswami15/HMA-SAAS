/**
 * Enum representing different frequencies for medication administration
 */
export enum MedicationFrequency {
  // Standard Frequencies
  ONCE_DAILY = 'ONCE_DAILY',
  TWICE_DAILY = 'TWICE_DAILY',
  THREE_TIMES_DAILY = 'THREE_TIMES_DAILY',
  FOUR_TIMES_DAILY = 'FOUR_TIMES_DAILY',
  EVERY_6_HOURS = 'EVERY_6_HOURS',
  EVERY_8_HOURS = 'EVERY_8_HOURS',
  EVERY_12_HOURS = 'EVERY_12_HOURS',
  EVERY_24_HOURS = 'EVERY_24_HOURS',
  
  // As Needed Frequencies
  AS_NEEDED = 'AS_NEEDED',
  EVERY_4_HOURS_AS_NEEDED = 'EVERY_4_HOURS_AS_NEEDED',
  EVERY_6_HOURS_AS_NEEDED = 'EVERY_6_HOURS_AS_NEEDED',
  
  // Weekly Frequencies
  ONCE_WEEKLY = 'ONCE_WEEKLY',
  TWICE_WEEKLY = 'TWICE_WEEKLY',
  
  // Monthly Frequencies
  ONCE_MONTHLY = 'ONCE_MONTHLY',
  
  // Special Frequencies
  BEFORE_MEALS = 'BEFORE_MEALS',
  AFTER_MEALS = 'AFTER_MEALS',
  AT_BEDTIME = 'AT_BEDTIME',
  IN_THE_MORNING = 'IN_THE_MORNING',
  IN_THE_EVENING = 'IN_THE_EVENING',
  
  // Continuous Frequencies
  CONTINUOUS = 'CONTINUOUS',
  CONTINUOUS_INFUSION = 'CONTINUOUS_INFUSION',
  
  // Other
  EVERY_OTHER_DAY = 'EVERY_OTHER_DAY',
  
  // Custom
  OTHER = 'OTHER'
}
