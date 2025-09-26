import { Module, forwardRef } from '@nestjs/common';
import { StaffService } from './services/staff.service';
import { RoleService } from './services/role.service';
import { SpecialtyService } from './services/specialty.service';
import { DepartmentService } from './services/department.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { StaffRepository } from './repositories/staff.repository';
import { DepartmentRepository } from './repositories/department.repository';
import { RoleRepository } from './repositories/role.repository';
import { SpecialtyRepository } from './repositories/specialty.repository';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    forwardRef(() => AuthModule),
  ],
  providers: [
    // Services
    StaffService,
    RoleService,
    SpecialtyService,
    DepartmentService,
    
    // Repositories
    StaffRepository,
    DepartmentRepository,
    RoleRepository,
    SpecialtyRepository,
  ],
  exports: [
    // Services
    StaffService,
    RoleService,
    SpecialtyService,
    DepartmentService,
    
    // Repositories
    StaffRepository,
    DepartmentRepository,
    RoleRepository,
    SpecialtyRepository,
  ],
})
export class StaffManagementModule {}
