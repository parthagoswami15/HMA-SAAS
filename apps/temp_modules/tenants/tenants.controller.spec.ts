import { Test, TestingModule } from '@nestjs/testing';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantResponseDto } from './dto/tenant-response.dto';
import { Role } from '@prisma/client';

describe('TenantsController', () => {
  let controller: TenantsController;
  let service: TenantsService;

  const mockTenant: TenantResponseDto = {
    id: '1',
    name: 'Test Tenant',
    slug: 'test-tenant',
    type: 'HOSPITAL',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantsController],
      providers: [
        {
          provide: TenantsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockTenant),
            findAll: jest.fn().mockResolvedValue([mockTenant]),
            findOne: jest.fn().mockResolvedValue(mockTenant),
            update: jest.fn().mockResolvedValue(mockTenant),
            remove: jest.fn().mockResolvedValue(undefined),
            isSlugTaken: jest.fn().mockResolvedValue(false),
          },
        },
      ],
    }).compile();

    controller = module.get<TenantsController>(TenantsController);
    service = module.get<TenantsService>(TenantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new tenant', async () => {
      const createDto: CreateTenantDto = {
        name: 'Test Tenant',
        slug: 'test-tenant',
        type: 'HOSPITAL',
      };

      const result = await controller.create(createDto);
      expect(result).toEqual(mockTenant);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of tenants', async () => {
      const result = await controller.findAll(1, 10, undefined, undefined);
      expect(result).toBeInstanceOf(Object);
      expect(result.items).toEqual([mockTenant]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single tenant', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockTenant);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a tenant', async () => {
      const updateDto: UpdateTenantDto = { name: 'Updated Tenant' };
      const result = await controller.update('1', updateDto);
      expect(result).toEqual(mockTenant);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a tenant', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('checkSlug', () => {
    it('should check if a slug is available', async () => {
      const result = await controller.checkSlug('test-tenant');
      expect(result).toEqual({
        available: true,
        message: 'Slug is available',
      });
      expect(service.isSlugTaken).toHaveBeenCalledWith('test-tenant', undefined);
    });
  });
});
