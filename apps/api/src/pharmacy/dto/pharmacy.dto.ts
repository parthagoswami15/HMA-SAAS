// Medication DTOs
export interface CreateMedicationDto {
  name: string;
  genericName?: string;
  description?: string;
  strength?: string;
  unit?: string;
  dosageForm?: string;
  route?: string;
  schedule?: any;
  isActive?: boolean;
}

export interface UpdateMedicationDto extends Partial<CreateMedicationDto> {}

// Pharmacy Order DTOs
export interface CreatePharmacyOrderDto {
  patientId: string;
  doctorId?: string;
  items: PharmacyOrderItemDto[];
  notes?: string;
}

export interface PharmacyOrderItemDto {
  medicationId: string;
  quantity: number;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

export interface UpdatePharmacyOrderDto {
  status?: 'PENDING' | 'DISPENSED' | 'PARTIALLY_DISPENSED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  dispensedDate?: Date;
}

export interface UpdatePharmacyOrderItemDto {
  status?: 'PENDING' | 'DISPENSED' | 'OUT_OF_STOCK' | 'CANCELLED';
}

export interface PharmacyOrderQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  patientId?: string;
  doctorId?: string;
  startDate?: string;
  endDate?: string;
}

export interface MedicationQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  dosageForm?: string;
  isActive?: boolean;
}
