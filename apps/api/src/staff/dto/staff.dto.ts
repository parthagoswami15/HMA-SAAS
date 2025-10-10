export interface CreateStaffDto {
  userId: string;
  employeeId?: string;
  designation?: string;
  departmentId?: string;
  joiningDate?: Date;
  qualification?: string;
  experience?: string;
  // User details (to be created if userId not provided)
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: 'DOCTOR' | 'NURSE' | 'LAB_TECHNICIAN' | 'RADIOLOGIST' | 'PHARMACIST' | 'RECEPTIONIST' | 'ACCOUNTANT';
  specialization?: string;
  licenseNumber?: string;
  phone?: string;
}

export interface UpdateStaffDto {
  employeeId?: string;
  designation?: string;
  departmentId?: string;
  joiningDate?: Date;
  qualification?: string;
  experience?: string;
  isActive?: boolean;
  // User update fields
  firstName?: string;
  lastName?: string;
  specialization?: string;
  licenseNumber?: string;
}

export interface StaffQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  departmentId?: string;
  status?: 'active' | 'inactive';
}
