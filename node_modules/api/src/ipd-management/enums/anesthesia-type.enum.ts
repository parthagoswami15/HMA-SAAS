/**
 * Enum representing different types of anesthesia used in medical procedures
 */
export enum AnesthesiaType {
  // General Anesthesia
  GENERAL = 'GENERAL',
  INHALATION = 'INHALATION',
  INTRAVENOUS = 'INTRAVENOUS',
  BALANCED = 'BALANCED',
  
  // Regional Anesthesia
  REGIONAL = 'REGIONAL',
  SPINAL = 'SPINAL',
  EPIDURAL = 'EPIDURAL',
  CAUDAL = 'CAUDAL',
  NERVE_BLOCK = 'NERVE_BLOCK',
  
  // Local Anesthesia
  LOCAL = 'LOCAL',
  TOPICAL = 'TOPICAL',
  INFILTRATION = 'INFILTRATION',
  
  // Sedation
  CONSCIOUS_SEDATION = 'CONSCIOUS_SEDATION',
  MODERATE_SEDATION = 'MODERATE_SEDATION',
  DEEP_SEDATION = 'DEEP_SEDATION',
  
  // Specialized Anesthesia
  PEDIATRIC = 'PEDIATRIC',
  OBSTETRIC = 'OBSTETRIC',
  CARDIAC = 'CARDIAC',
  
  // Other
  MONITORED_ANESTHESIA_CARE = 'MONITORED_ANESTHESIA_CARE',
  TIVA = 'TIVA', // Total Intravenous Anesthesia
  
  // None
  NONE = 'NONE',
  
  // Custom
  OTHER = 'OTHER'
}
