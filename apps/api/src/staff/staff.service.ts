import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CustomPrismaService } from '../prisma/custom-prisma.service';
import { CreateStaffDto, UpdateStaffDto, StaffQueryDto } from './dto/staff.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffService {
  constructor(private prisma: CustomPrismaService) {}

  async create(createStaffDto: CreateStaffDto, tenantId: string) {
    try {
      let userId = createStaffDto.userId;

      // If userId not provided, create a new user
      if (!userId && createStaffDto.email && createStaffDto.password) {
        const hashedPassword = await bcrypt.hash(createStaffDto.password, 10);
        
        const user = await this.prisma.user.create({
          data: {
            email: createStaffDto.email,
            passwordHash: hashedPassword,
            firstName: createStaffDto.firstName || '',
            lastName: createStaffDto.lastName || '',
            role: createStaffDto.role || 'DOCTOR',
            specialization: createStaffDto.specialization,
            licenseNumber: createStaffDto.licenseNumber,
            tenantId,
          },
        });
        userId = user.id;
      }

      if (!userId) {
        throw new BadRequestException('User ID or user details are required');
      }

      // Generate employee ID if not provided
      const employeeId = createStaffDto.employeeId || await this.generateEmployeeId(tenantId);

      const staff = await this.prisma.staff.create({
        data: {
          userId,
          employeeId,
          designation: createStaffDto.designation,
          departmentId: createStaffDto.departmentId,
          joiningDate: createStaffDto.joiningDate ? new Date(createStaffDto.joiningDate) : new Date(),
          qualification: createStaffDto.qualification,
          experience: createStaffDto.experience,
          tenantId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              specialization: true,
              licenseNumber: true,
              experience: true,
            },
          },
          department: true,
        },
      });

      return {
        success: true,
        message: 'Staff member added successfully',
        data: staff,
      };
    } catch (error) {
      console.error('Error creating staff:', error);
      throw new BadRequestException(error.message || 'Failed to create staff member');
    }
  }

  async findAll(tenantId: string, query: StaffQueryDto = {}) {
    const { page = 1, limit = 10, search, role, departmentId, status = 'active' } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      tenantId,
      isActive: status === 'active',
    };

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (role) {
      where.user = {
        role: role,
      };
    }

    if (search) {
      where.OR = [
        { employeeId: { contains: search, mode: 'insensitive' } },
        { designation: { contains: search, mode: 'insensitive' } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [staff, total] = await Promise.all([
      this.prisma.staff.findMany({
        where,
        skip,
        take: parseInt(limit as any),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              specialization: true,
              licenseNumber: true,
              experience: true,
              isActive: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      }),
      this.prisma.staff.count({ where }),
    ]);

    return {
      success: true,
      data: {
        staff,
        pagination: {
          total,
          page: parseInt(page as any),
          limit: parseInt(limit as any),
          pages: Math.ceil(total / parseInt(limit as any)),
        },
      },
    };
  }

  async findOne(id: string, tenantId: string) {
    const staff = await this.prisma.staff.findFirst({
      where: { id, tenantId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            specialization: true,
            licenseNumber: true,
            experience: true,
            isActive: true,
            lastLoginAt: true,
          },
        },
        department: true,
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    return {
      success: true,
      data: staff,
    };
  }

  async update(id: string, updateStaffDto: UpdateStaffDto, tenantId: string) {
    try {
      const staff = await this.prisma.staff.findFirst({
        where: { id, tenantId },
        include: { user: true },
      });

      if (!staff) {
        throw new NotFoundException('Staff member not found');
      }

      // Update user details if provided
      if (updateStaffDto.firstName || updateStaffDto.lastName || updateStaffDto.specialization || updateStaffDto.licenseNumber) {
        await this.prisma.user.update({
          where: { id: staff.userId },
          data: {
            firstName: updateStaffDto.firstName,
            lastName: updateStaffDto.lastName,
            specialization: updateStaffDto.specialization,
            licenseNumber: updateStaffDto.licenseNumber,
          },
        });
      }

      // Update staff details
      const updatedStaff = await this.prisma.staff.update({
        where: { id },
        data: {
          employeeId: updateStaffDto.employeeId,
          designation: updateStaffDto.designation,
          departmentId: updateStaffDto.departmentId,
          joiningDate: updateStaffDto.joiningDate ? new Date(updateStaffDto.joiningDate) : undefined,
          qualification: updateStaffDto.qualification,
          experience: updateStaffDto.experience,
          isActive: updateStaffDto.isActive,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              specialization: true,
              licenseNumber: true,
            },
          },
          department: true,
        },
      });

      return {
        success: true,
        message: 'Staff member updated successfully',
        data: updatedStaff,
      };
    } catch (error) {
      console.error('Error updating staff:', error);
      throw new BadRequestException('Failed to update staff member');
    }
  }

  async remove(id: string, tenantId: string) {
    try {
      // Soft delete
      await this.prisma.staff.update({
        where: { id, tenantId },
        data: {
          isActive: false,
        },
      });

      return {
        success: true,
        message: 'Staff member deactivated successfully',
      };
    } catch (error) {
      console.error('Error removing staff:', error);
      throw new BadRequestException('Failed to deactivate staff member');
    }
  }

  async getStats(tenantId: string) {
    const [
      totalStaff,
      activeStaff,
      doctors,
      nurses,
      labTechnicians,
      pharmacists,
    ] = await Promise.all([
      this.prisma.staff.count({ where: { tenantId } }),
      this.prisma.staff.count({ where: { tenantId, isActive: true } }),
      this.prisma.staff.count({ where: { tenantId, isActive: true, user: { role: 'DOCTOR' } } }),
      this.prisma.staff.count({ where: { tenantId, isActive: true, user: { role: 'NURSE' } } }),
      this.prisma.staff.count({ where: { tenantId, isActive: true, user: { role: 'LAB_TECHNICIAN' } } }),
      this.prisma.staff.count({ where: { tenantId, isActive: true, user: { role: 'PHARMACIST' } } }),
    ]);

    return {
      success: true,
      data: {
        totalStaff,
        activeStaff,
        inactiveStaff: totalStaff - activeStaff,
        byRole: {
          doctors,
          nurses,
          labTechnicians,
          pharmacists,
        },
      },
    };
  }

  async search(tenantId: string, query: string) {
    if (!query || query.length < 2) {
      return { success: true, data: [] };
    }

    const staff = await this.prisma.staff.findMany({
      where: {
        tenantId,
        isActive: true,
        OR: [
          { employeeId: { contains: query, mode: 'insensitive' } },
          { user: { firstName: { contains: query, mode: 'insensitive' } } },
          { user: { lastName: { contains: query, mode: 'insensitive' } } },
          { user: { email: { contains: query, mode: 'insensitive' } } },
        ],
      },
      take: 10,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            specialization: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      data: staff,
    };
  }

  private async generateEmployeeId(tenantId: string): Promise<string> {
    const count = await this.prisma.staff.count({ where: { tenantId } });
    const year = new Date().getFullYear();
    return `EMP${year}${String(count + 1).padStart(4, '0')}`;
  }
}
