import { Test, TestingModule } from '@nestjs/testing';
import { PatientDocumentsController } from '../controllers/patient-documents.controller';
import { PatientDocumentsService } from '../services/patient-documents.service';
import { FileStorageService } from '../../file-storage/file-storage.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../tenancy/guards/tenant.guard';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { RequestWithUser } from '../../auth/interfaces/request-with-user.interface';
import { FileUpload } from '../../file-storage/interfaces/file-upload.interface';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

// Mock the patient documents service
const mockPatientDocumentsService: MockType<PatientDocumentsService> = {
  uploadDocument: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// Mock the file storage service
const mockFileStorageService: MockType<FileStorageService> = {
  uploadPatientDocument: jest.fn(),
  deleteFile: jest.fn(),
  getFileStream: jest.fn(),
};

// Mock the Prisma service
const mockPrismaService = {
  // Add any Prisma service methods used in the controller
};

// Mock the file upload type
const createMockFile = (overrides: Partial<FileUpload> = {}): FileUpload => ({
  originalname: 'test.pdf',
  mimetype: 'application/pdf',
  size: 1024,
  buffer: Buffer.from('test file content'),
  fieldname: 'file',
  encoding: '7bit',
  destination: '/tmp/uploads',
  filename: 'test-123.pdf',
  path: '/tmp/uploads/test-123.pdf',
  ...overrides,
});

describe('PatientDocumentsController', () => {
  let controller: PatientDocumentsController;
  let patientDocumentsService: MockType<PatientDocumentsService>;
  let fileStorageService: MockType<FileStorageService>;

  const mockRequest: RequestWithUser = {
    user: {
      id: 'user-123',
      tenantId: 'tenant-123',
      roles: ['DOCTOR'],
      sub: 'user-123',
      email: 'doctor@example.com',
      // Add any other required user properties
    },
    params: { patientId: 'patient-123' },
    // Add other required request properties
  } as unknown as RequestWithUser;

  let mockFile: FileUpload;

  beforeEach(async () => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Create a fresh mock file for each test
    mockFile = createMockFile();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientDocumentsController],
      providers: [
        {
          provide: PatientDocumentsService,
          useValue: mockPatientDocumentsService,
        },
        {
          provide: FileStorageService,
          useValue: mockFileStorageService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(TenantGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PatientDocumentsController>(PatientDocumentsController);
    patientDocumentsService = module.get(PatientDocumentsService);
    fileStorageService = module.get(FileStorageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadDocument', () => {
    it('should upload a document successfully', async () => {
      const mockResult = {
        id: 'doc-123',
        filename: 'test.pdf',
        url: 'http://example.com/test.pdf',
        size: 1024,
        documentType: 'REPORT',
        patientId: 'patient-123',
        tenantId: 'tenant-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Set up the mock to return our test result
      mockPatientDocumentsService.uploadDocument?.mockResolvedValue(mockResult);
      mockFileStorageService.uploadPatientDocument?.mockResolvedValue({
        filename: 'test.pdf',
        path: '/uploads/test.pdf',
        url: 'http://example.com/test.pdf',
        size: 1024,
        mimeType: 'application/pdf'
      });

      // Call the controller method
      const result = await controller.uploadDocument(
        mockRequest,
        'patient-123',
        mockFile,
        {
          documentType: 'REPORT',
          description: 'Test document',
        },
      );

      // Verify the result
      expect(result).toEqual(mockResult);
      expect(mockPatientDocumentsService.uploadDocument).toHaveBeenCalledWith(
        'patient-123',
        expect.objectContaining({
          filename: 'test.pdf',
          size: 1024,
          mimeType: 'application/pdf',
          documentType: 'REPORT',
          description: 'Test document',
          uploadedBy: 'user-123',
          tenantId: 'tenant-123',
        })
      );

      expect(result).toEqual(mockResult);
      expect(patientDocumentsService.uploadDocument).toHaveBeenCalledWith(
        expect.objectContaining({
          patientId: 'patient-123',
          documentType: 'REPORT',
          description: 'Test document',
          file: mockFile,
        }),
      );
    });

    it('should throw BadRequestException for invalid file type', async () => {
      const invalidFile = {
        ...mockFile,
        mimetype: 'application/exe',
      };

      await expect(
        controller.uploadDocument(
          mockRequest,
          'patient-123',
          invalidFile,
          { documentType: 'REPORT' },
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all documents for a patient', async () => {
      const mockDocuments = [
        { id: 'doc-1', filename: 'test1.pdf' },
        { id: 'doc-2', filename: 'test2.pdf' },
      ];

      patientDocumentsService.findAll.mockResolvedValue({
        data: mockDocuments,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      const result = await controller.findAll(
        mockRequest,
        'patient-123',
        { page: 1, limit: 10 },
      );

      expect(result.data).toHaveLength(2);
      expect(patientDocumentsService.findAll).toHaveBeenCalledWith(
        'patient-123',
        'tenant-123',
        { page: 1, limit: 10 },
      );
    });
  });

  describe('findOne', () => {
    it('should return a single document', async () => {
      const mockDocument = {
        id: 'doc-123',
        filename: 'test.pdf',
        url: 'http://example.com/test.pdf',
      };

      patientDocumentsService.findOne.mockResolvedValue(mockDocument);

      const result = await controller.findOne(mockRequest, 'patient-123', 'doc-123');

      expect(result).toEqual(mockDocument);
      expect(patientDocumentsService.findOne).toHaveBeenCalledWith(
        'doc-123',
        'patient-123',
        'tenant-123',
      );
    });

    it('should throw NotFoundException if document not found', async () => {
      patientDocumentsService.findOne.mockResolvedValue(null);

      await expect(
        controller.findOne(mockRequest, 'patient-123', 'non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update document metadata', async () => {
      const updateDto = { description: 'Updated description' };
      const updatedDoc = {
        id: 'doc-123',
        description: 'Updated description',
      };

      patientDocumentsService.update.mockResolvedValue(updatedDoc);

      const result = await controller.update(
        mockRequest,
        'patient-123',
        'doc-123',
        updateDto,
      );

      expect(result).toEqual(updatedDoc);
      expect(patientDocumentsService.update).toHaveBeenCalledWith(
        'doc-123',
        'patient-123',
        'tenant-123',
        updateDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a document', async () => {
      patientDocumentsService.remove.mockResolvedValue(true);

      await controller.remove(mockRequest, 'patient-123', 'doc-123');

      expect(patientDocumentsService.remove).toHaveBeenCalledWith(
        'doc-123',
        'patient-123',
        'tenant-123',
      );
    });

    it('should throw NotFoundException if document not found', async () => {
      patientDocumentsService.remove.mockResolvedValue(false);

      await expect(
        controller.remove(mockRequest, 'patient-123', 'non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('downloadDocument', () => {
    it('should return a file stream', async () => {
      const mockStream = createMock<NodeJS.ReadableStream>();
      const mockDocument = {
        id: 'doc-123',
        filename: 'test.pdf',
        filePath: '/uploads/patient-123/test.pdf',
        mimeType: 'application/pdf',
      };

      patientDocumentsService.findOne.mockResolvedValue(mockDocument);
      fileStorageService.getFileStream.mockResolvedValue(mockStream);

      const result = await controller.downloadDocument(
        mockRequest,
        'patient-123',
        'doc-123',
      );

      expect(result.stream).toBe(mockStream);
      expect(result.filename).toBe('test.pdf');
      expect(fileStorageService.getFileStream).toHaveBeenCalledWith(mockDocument.filePath);
    });
  });
});
