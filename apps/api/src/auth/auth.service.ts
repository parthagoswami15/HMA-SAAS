import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomPrismaService } from '../prisma/custom-prisma.service';
import * as bcrypt from 'bcryptjs';

export interface RegisterUserDto {
  organizationType: 'hospital' | 'clinic' | 'private_practice';
  organizationName: string;
  address: string;
  phone: string;
  email: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
  features: string[];
  preferences: {
    notifications: boolean;
    analytics: boolean;
    backups: boolean;
  };
}

export interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: CustomPrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterUserDto) {
    const { adminEmail, adminPassword, organizationName } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    try {
      // Create transaction to create tenant and admin user
      const result = await this.prisma.$transaction(async (prisma) => {
        // Create tenant organization
        const tenantTypeMap = {
          hospital: 'HOSPITAL',
          clinic: 'CLINIC',
          private_practice: 'CLINIC',
        } as const;

        const tenant = await prisma.tenant.create({
          data: {
            name: organizationName,
            slug: organizationName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            type: tenantTypeMap[registerDto.organizationType],
            address: registerDto.address,
            phone: registerDto.phone,
            email: registerDto.email,
            isActive: true,
          },
        });

        // Create admin user
        const user = await prisma.user.create({
          data: {
            email: adminEmail,
            passwordHash: hashedPassword,
            firstName: registerDto.adminFirstName,
            lastName: registerDto.adminLastName,
            role: 'ADMIN',
            tenantId: tenant.id,
            isActive: true,
          },
        });

        return { user, tenant };
      });

      return {
        success: true,
        message: 'Registration successful',
        data: {
          userId: result.user.id,
          tenantId: result.tenant.id,
          email: result.user.email,
        },
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new BadRequestException('Registration failed. Please try again.');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        tenant: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is not active');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        tenant: {
          id: user.tenant.id,
          name: user.tenant.name,
          type: user.tenant.type,
        },
      },
    };
  }

  async validateUser(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenant: true,
      },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tenantId: user.tenantId,
    };
  }
}
