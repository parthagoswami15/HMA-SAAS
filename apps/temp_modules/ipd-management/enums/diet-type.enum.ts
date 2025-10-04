/**
 * Enum representing different types of diets
 */
export enum DietType {
  // Regular Diets
  REGULAR = 'REGULAR',
  GENERAL = 'GENERAL',
  SOFT = 'SOFT',
  PUREED = 'PUREED',
  MECHANICAL_SOFT = 'MECHANICAL_SOFT',
  
  // Therapeutic Diets
  DIABETIC = 'DIABETIC',
  CARDIAC = 'CARDIAC',
  RENAL = 'RENAL',
  HEPATIC = 'HEPATIC',
  LOW_SODIUM = 'LOW_SODIUM',
  LOW_FAT = 'LOW_FAT',
  LOW_CHOLESTEROL = 'LOW_CHOLESTEROL',
  HIGH_PROTEIN = 'HIGH_PROTEIN',
  HIGH_CALORIE = 'HIGH_CALORIE',
  HIGH_FIBER = 'HIGH_FIBER',
  LOW_FIBER = 'LOW_FIBER',
  
  // Special Diets
  VEGETARIAN = 'VEGETARIAN',
  VEGAN = 'VEGAN',
  KOSHER = 'KOSHER',
  HALAL = 'HALAL',
  GLUTEN_FREE = 'GLUTEN_FREE',
  LACTOSE_FREE = 'LACTOSE_FREE',
  
  // Consistency Modifications
  THICKENED_LIQUIDS = 'THICKENED_LIQUIDS',
  CLEAR_LIQUID = 'CLEAR_LIQUID',
  FULL_LIQUID = 'FULL_LIQUID',
  
  // Tube Feeding
  TUBE_FEEDING = 'TUBE_FEEDING',
  TPN = 'TPN', // Total Parenteral Nutrition
  
  // Other
  NPO = 'NPO', // Nothing by Mouth
  ADVANCED_AS_TOLERATED = 'ADVANCED_AS_TOLERATED',
  
  // Custom
  OTHER = 'OTHER'
}
