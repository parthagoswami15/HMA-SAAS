import { Test, TestingModule } from '@nestjs/testing';
import { TenantsService } from './tenants.service';
import { PrismaService } from '../prisma/prisma.service';
import { Tenant, Prisma } from '@prisma/client';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('TenantsService', () => {
  let service: TenantsService;
  let prisma: PrismaService;

  const mockTenant: Tenant = {
    id: '1',
    name: 'Test Tenant',
    slug: 'test-tenant',
    type: 'HOSPITAL',
    address: '123 Test St',
    phone: '1234567890',
    email: 'test@example.com',
    logo: 'https://example.com/logo.png',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockPrismaService = {
    tenant: {
      create: jest.fn().mockResolvedValue(mockTenant),
      findMany: jest.fn().mockResolvedValue([mockTenant]),
      findUnique: jest.fn().mockResolvedValue(mockTenant),
      update: jest.fn().mockResolvedValue(mockTenant),
      delete: jest.fn().mockResolvedValue(mockTenant),
      count: jest.fn().mockResolvedValue(1),
      findFirst: jest.fn().mockResolvedValue(null),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TenantsService>(TenantsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new tenant', async () => {
      const createTenantDto = {
        name: 'Test Tenant',
        slug: 'test-tenant',
        type: 'HOSPITAL',
      };

      const result = await service.create(createTenantDto);
      expect(result).toEqual(mockTenant);
      expect(prisma.tenant.create).toHaveBeenCalledWith({
        data: {
          ...createTenantDto,
          isActive: true,
        },
      });
    });

    it('should throw ConflictException if slug already exists', async () => {
      const createTenantDto = {
        name: 'Test Tenant',
        slug: 'existing-tenant',
        type: 'HOSPITAL',
      };

      jest.spyOn(prisma.tenant, 'create').mockRejectedValueOnce({
        code: 'P2002',
        meta: { target: ['slug'] },
      });

      await expect(service.create(createTenantDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of tenants', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockTenant]);
      expect(prisma.tenant.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single tenant', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockTenant);
      expect(prisma.tenant.findUnique).toHaveBeenCalledWith({
        where: { id: '1', deletedAt: null },
      });
    });

    it('should throw NotFoundException if tenant not found', async () => {
      jest.spyOn(prisma.tenant, 'findUnique').mockResolvedValueOnce(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a tenant', async () => {
      const updateTenantDto = { name: 'Updated Tenant' };
      const result = await service.update('1', updateTenantDto);
      expect(result).toEqual(mockTenant);
      expect(prisma.tenant.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...updateTenantDto,
          updatedAt: expect.any(Date),
        },
      });
    });
  });

  describe('remove', () => {
    it('should soft delete a tenant', async () => {
      await service.remove('1');
      expect(prisma.tenant.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          isActive: false,
          deletedAt: expect.any(Date),
        },
      });
    });
  });

  describe('isSlugTaken', () => {
    it('should return false if slug is available', async () => {
      const result = await service.isSlugTaken('available-slug');
      expect(result).toBe(false);
      expect(prisma.tenant.count).toHaveBeenCalledWith({
        where: {
          slug: 'available-slug',
          deletedAt: null,
        },
      });
    });

    it('should return true if slug is taken', async () => {
      jest.spyOn(prisma.tenant, 'count').mockResolvedValueOnce(1);
      const result = await service.isSlugTaken('taken-slug');
      expect(result).toBe(true);
    });
  });
});
