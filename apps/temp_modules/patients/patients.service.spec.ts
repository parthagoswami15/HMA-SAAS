import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from './patients.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// Mock PrismaService
const mockPrisma = {
  patient: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $queryRaw: jest.fn(),
};

describe('PatientsService', () => {
  let service: PatientsService;
  const tenantId = 'test-tenant-id';
  const now = new Date();
  
  // Mock patient data
  const mockPatient = {
    id: 'test-patient-id',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    medicalRecordNumber: 'MRN-12345',
    tenantId,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new patient', async () => {
      const createDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
      };

      mockPrisma.patient.findFirst.mockResolvedValueOnce(null);
      mockPrisma.patient.create.mockResolvedValueOnce({
        ...mockPatient,
        ...createDto,
      });

      const result = await service.create(tenantId, createDto);
      expect(result).toHaveProperty('firstName', 'John');
      expect(result).toHaveProperty('lastName', 'Doe');
      expect(mockPrisma.patient.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const createDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      mockPrisma.patient.findFirst.mockResolvedValueOnce(mockPatient);

      await expect(service.create(tenantId, createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should find a patient by ID', async () => {
      mockPrisma.patient.findFirst.mockResolvedValueOnce(mockPatient);

      const result = await service.findOne(tenantId, 'test-patient-id');
      expect(result).toHaveProperty('id', 'test-patient-id');
      expect(mockPrisma.patient.findFirst).toHaveBeenCalledWith({
        where: { id: 'test-patient-id', tenantId, deletedAt: null },
        select: expect.any(Object),
      });
    });

    it('should throw NotFoundException if patient not found', async () => {
      mockPrisma.patient.findFirst.mockResolvedValueOnce(null);

      await expect(
        service.findOne(tenantId, 'non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('list', () => {
    it('should return paginated list of patients', async () => {
      const mockPatients = [
        { ...mockPatient, id: '1' },
        { ...mockPatient, id: '2', firstName: 'Jane' },
      ];

      mockPrisma.patient.findMany.mockResolvedValueOnce(mockPatients);
      mockPrisma.patient.count.mockResolvedValueOnce(2);

      const result = await service.list(tenantId, 1, 10);
      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });

    it('should apply search filter', async () => {
      const searchTerm = 'John';
      await service.list(tenantId, 1, 10, searchTerm);
      
      expect(mockPrisma.patient.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          tenantId,
          deletedAt: null,
          OR: [
            { firstName: { contains: searchTerm, mode: 'insensitive' } },
            { lastName: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { medicalRecordNumber: { contains: searchTerm, mode: 'insensitive' } },
          ],
        }),
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        select: expect.any(Object),
        skip: 0,
        take: 10,
      });
    });
  });

  describe('update', () => {
    it('should update a patient', async () => {
      const updateDto = { firstName: 'Johnny' };
      const updatedPatient = { ...mockPatient, ...updateDto };

      mockPrisma.patient.findFirst.mockResolvedValueOnce(mockPatient);
      mockPrisma.patient.update.mockResolvedValueOnce(updatedPatient);

      const result = await service.update(tenantId, 'test-patient-id', updateDto);
      expect(result).toHaveProperty('firstName', 'Johnny');
      expect(mockPrisma.patient.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should soft delete a patient', async () => {
      mockPrisma.patient.findFirst.mockResolvedValueOnce(mockPatient);
      mockPrisma.patient.update.mockResolvedValueOnce({
        ...mockPatient,
        deletedAt: new Date(),
      });

      const result = await service.remove(tenantId, 'test-patient-id');
      expect(result).toEqual({ success: true });
      expect(mockPrisma.patient.update).toHaveBeenCalled();
    });

    it('should hard delete a patient', async () => {
      mockPrisma.patient.findFirst.mockResolvedValueOnce(mockPatient);
      mockPrisma.patient.delete.mockResolvedValueOnce(mockPatient);

      const result = await service.remove(tenantId, 'test-patient-id', true);
      expect(result).toEqual({ success: true });
      expect(mockPrisma.patient.delete).toHaveBeenCalled();
    });
  });
});
