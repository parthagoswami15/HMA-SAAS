import { 
  Injectable, 
  NotFoundException, 
  ConflictException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { 
  Staff, 
  Prisma, 
  StaffStatus,
  Role
} from '@prisma/client';
import { CreateStaffDto } from '../dto/create-staff.dto';
import { UpdateStaffDto } from '../dto/update-staff.dto';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async create(createStaffDto: CreateStaffDto): Promise<Staff> {
    const { departmentId, specialtyIds = [], ...staffData } = createStaffDto;

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: staffData.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    return this.prisma.staff.create({
      data: {
        ...staffData,
        department: departmentId ? { connect: { id: departmentId } } : undefined,
        specialties: {
          create: specialtyIds.map(specialtyId => ({
            specialty: { connect: { id: specialtyId } }
          }))
        },
        user: {
          create: {
            email: staffData.email,
            firstName: staffData.firstName,
            lastName: staffData.lastName,
            role: Role.STAFF,
            isActive: staffData.status === StaffStatus.ACTIVE
          }
        }
      },
      include: {
        department: true,
        specialties: {
          include: {
            specialty: true
          }
        }
      }
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.StaffWhereInput;
    orderBy?: Prisma.StaffOrderByWithRelationInput;
  }): Promise<{ data: Staff[]; total: number }> {
    const { skip, take, where, orderBy } = params;
    const [data, total] = await Promise.all([
      this.prisma.staff.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          department: true,
          specialties: {
            include: {
              specialty: true
            },
            where: {
              specialty: {
                isActive: true
              }
            }
          }
        }
      }),
      this.prisma.staff.count({ where })
    ]);

    return { data, total };
  }

  async findOne(id: string): Promise<Staff> {
    const staff = await this.prisma.staff.findUnique({
      where: { id },
      include: {
        department: true,
        specialties: {
          include: {
            specialty: true
          },
          where: {
            specialty: {
              isActive: true
            }
          }
        }
      }
    });

    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }

    return staff;
  }

  async update(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff> {
    const { departmentId, specialtyIds, ...updateData } = updateStaffDto;

    return this.prisma.$transaction(async (tx) => {
      // Update staff details
      const staff = await tx.staff.update({
        where: { id },
        data: {
          ...updateData,
          department: departmentId ? { connect: { id: departmentId } } : undefined,
        },
        include: {
          department: true,
          specialties: {
            include: {
              specialty: true
            }
          }
        }
      });

      // Update specialties if provided
      if (specialtyIds) {
        // Remove existing specialties
        await tx.staffSpecialty.deleteMany({
          where: { staffId: id }
        });

        // Add new specialties
        if (specialtyIds.length > 0) {
          await tx.staffSpecialty.createMany({
            data: specialtyIds.map(specialtyId => ({
              staffId: id,
              specialtyId
            }))
          });
        }
      }

      // Update associated user if needed
      if (updateData.email || updateData.firstName || updateData.lastName) {
        await tx.user.updateMany({
          where: { staffId: id },
          data: {
            email: updateData.email,
            firstName: updateData.firstName,
            lastName: updateData.lastName,
            isActive: updateData.status === StaffStatus.ACTIVE
          }
        });
      }

      return this.prisma.staff.findUnique({
        where: { id },
        include: {
          department: true,
          specialties: {
            include: { specialty: true }
          }
        }
      });
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.staff.update({
      where: { id },
      data: { status: StaffStatus.INACTIVE }
    });

    // Also deactivate the associated user
    await this.prisma.user.updateMany({
      where: { staffId: id },
      data: { isActive: false }
    });
  }
}