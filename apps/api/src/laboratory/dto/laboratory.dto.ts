// Lab Test DTOs
export interface CreateLabTestDto {
  name: string;
  code: string;
  description?: string;
  category: string;
  price?: number;
  isActive?: boolean;
}

export interface UpdateLabTestDto extends Partial<CreateLabTestDto> {}

// Lab Order DTOs
export interface CreateLabOrderDto {
  patientId: string;
  doctorId?: string;
  tests: string[]; // Array of lab test IDs
  notes?: string;
  priority?: 'STAT' | 'HIGH' | 'ROUTINE' | 'LOW';
}

export interface UpdateLabOrderDto {
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  completedDate?: Date;
}

// Lab Order Test Result DTOs
export interface UpdateLabTestResultDto {
  testId: string;
  result?: string;
  resultDate?: Date;
  referenceRange?: string;
  notes?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface LabOrderQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  patientId?: string;
  doctorId?: string;
  startDate?: string;
  endDate?: string;
}

export interface LabTestQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: boolean;
}
