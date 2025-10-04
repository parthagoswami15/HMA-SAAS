export interface ISpecialty {
  id: string;
  tenantId: string;
  name: string;
  code?: string;
  description?: string;
  category?: string;
  isActive: boolean;
  colorCode?: string;
  icon?: string;
  displayOrder: number;
  requiresCertification: boolean;
  minYearsExperience: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ICreateSpecialty {
  name: string;
  code?: string;
  description?: string;
  category?: string;
  isActive?: boolean;
  colorCode?: string;
  icon?: string;
  displayOrder?: number;
  requiresCertification?: boolean;
  minYearsExperience?: number;
}

export interface IUpdateSpecialty {
  name?: string;
  code?: string;
  description?: string;
  category?: string;
  isActive?: boolean;
  colorCode?: string;
  icon?: string;
  displayOrder?: number;
  requiresCertification?: boolean;
  minYearsExperience?: number;
}

export interface ISpecialtyFilterOptions {
  search?: string;
  category?: string;
  isActive?: boolean;
  requiresCertification?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IStaffSpecialty {
  id: string;
  staffId: string;
  specialtyId: string;
  isPrimary: boolean;
  experience?: number;
  notes?: string;
  startDate?: Date;
  certificationNumber?: string;
  certificationExpiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ICreateStaffSpecialty {
  specialtyId: string;
  isPrimary?: boolean;
  experience?: number;
  notes?: string;
  startDate?: Date;
  certificationNumber?: string;
  certificationExpiryDate?: Date;
}

export type IUpdateStaffSpecialty = Partial<Omit<ICreateStaffSpecialty, 'specialtyId'>> & {
  remove?: boolean;
};
