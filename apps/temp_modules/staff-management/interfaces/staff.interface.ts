import { StaffType, StaffStatus } from '../enums';

import { UserRole } from '../../user/enums';

export interface IBaseStaff {
  id: string;
  tenantId: string;
  userId: string;
  employeeId: string;
  type: StaffType;
  status: StaffStatus;
  departmentId: string | null;
  designation: string;
  joiningDate: Date;
  qualifications: string[];
  bio: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy?: string;
  updatedBy?: string;
}

export interface IStaff extends IBaseStaff {
  // Additional properties specific to staff
}

export interface ICreateStaffUser {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  password?: string;
  sendWelcomeEmail?: boolean;
  roleIds?: string[];
}

export interface ICreateStaff extends Omit<IBaseStaff, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isActive' | 'status' | 'type' | 'departmentId'> {
  user: ICreateStaffUser;
  departmentId?: string | null;
  type?: StaffType;
  status?: StaffStatus;
  isActive?: boolean;
  roleIds?: string[];
  specialties?: Array<{
    specialtyId: string;
    isPrimary?: boolean;
    experience?: number;
    notes?: string | null;
    startDate?: Date | string | null;
    certificationNumber?: string | null;
    certificationExpiryDate?: Date | string | null;
  }>;
  createdBy?: string;
  updatedBy?: string;
}

export interface IUpdateStaff extends Partial<Omit<IBaseStaff, 'id' | 'tenantId' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt'>> {
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string | null;
    isActive?: boolean;
  };
  roleIds?: string[];
  specialties?: Array<{
    id?: string;
    specialtyId: string;
    isPrimary?: boolean;
    experience?: number | null;
    notes?: string | null;
    startDate?: Date | string | null;
    certificationNumber?: string | null;
    certificationExpiryDate?: Date | string | null;
    remove?: boolean;
  }>;
  updatedBy?: string;
}

export interface IStaffWithRelations extends IBaseStaff {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    isActive: boolean;
    roles: Array<{
      id: string;
      name: string;
      code: UserRole;
      isSystem: boolean;
    }>;
  };
  department: {
    id: string;
    name: string;
    code: string | null;
    description: string | null;
  } | null;
  roles: Array<{
    id: string;
    name: string;
    code: UserRole;
    isSystem: boolean;
  }>;
  specialties: Array<{
    id: string;
    specialty: {
      id: string;
      name: string;
      code: string | null;
      description: string | null;
    };
    isPrimary: boolean;
    experience: number | null;
    notes: string | null;
    startDate: Date | null;
    certificationNumber: string | null;
    certificationExpiryDate: Date | null;
    assignedAt: Date;
    assignedBy: string;
  }>;
}

export interface IStaffFilterOptions {
  search?: string;
  type?: StaffType;
  status?: StaffStatus;
  departmentId?: string;
  specialtyId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'firstName' | 'lastName' | 'email' | 'employeeId' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  includeInactive?: boolean;
  includeDeleted?: boolean;
}
