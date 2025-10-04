import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StoreDicomDto, QueryDicomDto, RetrieveDicomDto, DicomStudyDto, DicomSeriesDto, DicomImageDto } from '../dto/pacs.dto';
import { Study, Series, Image } from '@prisma/client';

@Injectable()
export class PACSService {
  constructor(private prisma: PrismaService) {}

  async storeDicom(storeDto: StoreDicomDto): Promise<{ study: Study; series: Series; image: Image }> {
    // Find or create study
    let study = await this.prisma.study.findUnique({
      where: { studyInstanceUID: storeDto.studyInstanceUID },
    });

    if (!study) {
      // Create study if it doesn't exist
      study = await this.prisma.study.create({
        data: {
          studyInstanceUID: storeDto.studyInstanceUID,
          studyDate: new Date(),
          modalityType: 'OTHER' as any, // This should be determined from DICOM metadata
          status: 'IN_PROGRESS',
          tenantId: 'default', // This should be determined from context
        },
      });
    }

    // Find or create series
    let series = await this.prisma.series.findUnique({
      where: { seriesInstanceUID: storeDto.seriesInstanceUID },
    });

    if (!series) {
      series = await this.prisma.series.create({
        data: {
          seriesInstanceUID: storeDto.seriesInstanceUID,
          studyId: study.id,
          seriesNumber: 1, // This should be extracted from DICOM
          modality: 'OT', // This should be extracted from DICOM
          tenantId: study.tenantId,
        },
      });
    }

    // Find or create image
    let image = await this.prisma.image.findUnique({
      where: { sopInstanceUID: storeDto.sopInstanceUID },
    });

    if (!image) {
      image = await this.prisma.image.create({
        data: {
          sopInstanceUID: storeDto.sopInstanceUID,
          seriesId: series.id,
          instanceNumber: 1, // This should be extracted from DICOM
          imageType: ['ORIGINAL', 'PRIMARY'], // This should be extracted from DICOM
          tenantId: study.tenantId,
        },
      });
    }

    // Store DICOM file (this would typically involve saving to a file system or object storage)
    // For now, we'll just update the image metadata
    await this.prisma.image.update({
      where: { id: image.id },
      data: {
        dicomMetadata: storeDto.metadata,
        fileSize: storeDto.dicomData.length, // Approximate size
      },
    });

    return { study, series, image };
  }

  async queryDicom(queryDto: QueryDicomDto): Promise<any[]> {
    const where: any = {};

    switch (queryDto.queryLevel) {
      case 'PATIENT':
        if (queryDto.patientId) where.patientId = queryDto.patientId;
        if (queryDto.patientName) where.patientName = { contains: queryDto.patientName };
        break;

      case 'STUDY':
        if (queryDto.studyInstanceUID) where.studyInstanceUID = queryDto.studyInstanceUID;
        if (queryDto.accessionNumber) where.accessionNumber = queryDto.accessionNumber;
        if (queryDto.studyDate) where.studyDate = { gte: new Date(queryDto.studyDate) };
        if (queryDto.modality) where.modality = queryDto.modality;
        break;

      case 'SERIES':
        if (queryDto.seriesInstanceUID) where.seriesInstanceUID = queryDto.seriesInstanceUID;
        break;

      case 'IMAGE':
        if (queryDto.sopInstanceUID) where.sopInstanceUID = queryDto.sopInstanceUID;
        break;
    }

    // Add tenant filter
    where.tenantId = 'default'; // This should be determined from context

    switch (queryDto.queryLevel) {
      case 'STUDY':
        return this.prisma.study.findMany({
          where,
          select: {
            id: true,
            studyInstanceUID: true,
            accessionNumber: true,
            studyDate: true,
            studyDescription: true,
            modalityType: true,
            patientId: true,
          },
        });

      case 'SERIES':
        return this.prisma.series.findMany({
          where,
          select: {
            id: true,
            seriesInstanceUID: true,
            seriesNumber: true,
            modality: true,
            seriesDescription: true,
            studyId: true,
          },
        });

      case 'IMAGE':
        return this.prisma.image.findMany({
          where,
          select: {
            id: true,
            sopInstanceUID: true,
            instanceNumber: true,
            imageType: true,
            seriesId: true,
          },
        });

      default:
        return [];
    }
  }

  async retrieveDicom(retrieveDto: RetrieveDicomDto): Promise<any> {
    // This would typically retrieve the actual DICOM file from storage
    // For now, we'll return the metadata

    if (retrieveDto.studyInstanceUID) {
      const study = await this.prisma.study.findUnique({
        where: { studyInstanceUID: retrieveDto.studyInstanceUID },
        include: {
          series: {
            include: {
              images: true,
            },
          },
        },
      });

      if (!study) {
        throw new NotFoundException('Study not found');
      }

      return study;
    }

    if (retrieveDto.seriesInstanceUID) {
      const series = await this.prisma.series.findUnique({
        where: { seriesInstanceUID: retrieveDto.seriesInstanceUID },
        include: {
          images: true,
          study: true,
        },
      });

      if (!series) {
        throw new NotFoundException('Series not found');
      }

      return series;
    }

    if (retrieveDto.sopInstanceUID) {
      const image = await this.prisma.image.findUnique({
        where: { sopInstanceUID: retrieveDto.sopInstanceUID },
        include: {
          series: {
            include: {
              study: true,
            },
          },
        },
      });

      if (!image) {
        throw new NotFoundException('Image not found');
      }

      return image;
    }

    throw new BadRequestException('Must provide studyInstanceUID, seriesInstanceUID, or sopInstanceUID');
  }

  async getStudyHierarchy(studyInstanceUID: string): Promise<any> {
    const study = await this.prisma.study.findUnique({
      where: { studyInstanceUID },
      include: {
        series: {
          orderBy: { seriesNumber: 'asc' },
          include: {
            images: {
              orderBy: { instanceNumber: 'asc' },
              select: {
                id: true,
                sopInstanceUID: true,
                instanceNumber: true,
                imageType: true,
                rows: true,
                columns: true,
                bitsAllocated: true,
                photometricInterpretation: true,
                fileSize: true,
              },
            },
          },
        },
        reports: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            reportNumber: true,
            impression: true,
            recommendations: true,
            signedAt: true,
            signingUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!study) {
      throw new NotFoundException('Study not found');
    }

    return {
      study: {
        studyInstanceUID: study.studyInstanceUID,
        studyDate: study.studyDate,
        studyDescription: study.studyDescription,
        modalityType: study.modalityType,
        accessionNumber: study.accessionNumber,
        numberOfSeries: study.series.length,
        numberOfInstances: study.series.reduce((total, series) => total + series.images.length, 0),
      },
      series: study.series.map(series => ({
        seriesInstanceUID: series.seriesInstanceUID,
        seriesNumber: series.seriesNumber,
        modality: series.modality,
        seriesDescription: series.seriesDescription,
        numberOfImages: series.images.length,
        images: series.images,
      })),
      latestReport: study.reports[0] || null,
    };
  }

  async getPatientStudies(patientId: string): Promise<any[]> {
    const studies = await this.prisma.study.findMany({
      where: {
        order: {
          patientId: patientId,
        },
      },
      orderBy: { studyDate: 'desc' },
      include: {
        series: {
          select: {
            id: true,
            seriesInstanceUID: true,
            seriesNumber: true,
            modality: true,
            seriesDescription: true,
          },
        },
        reports: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            reportNumber: true,
            impression: true,
            signedAt: true,
          },
        },
      },
    });

    return studies.map(study => ({
      studyInstanceUID: study.studyInstanceUID,
      studyDate: study.studyDate,
      studyDescription: study.studyDescription,
      modalityType: study.modalityType,
      accessionNumber: study.accessionNumber,
      numberOfSeries: study.series.length,
      hasReport: study.reports.length > 0,
      latestReport: study.reports[0] || null,
    }));
  }

  async searchStudies(searchTerm: string): Promise<any[]> {
    const studies = await this.prisma.study.findMany({
      where: {
        OR: [
          { studyInstanceUID: { contains: searchTerm } },
          { accessionNumber: { contains: searchTerm } },
          { studyDescription: { contains: searchTerm } },
        ],
      },
      include: {
        series: {
          select: {
            id: true,
            seriesInstanceUID: true,
            modality: true,
          },
        },
      },
      take: 50,
    });

    return studies.map(study => ({
      studyInstanceUID: study.studyInstanceUID,
      studyDate: study.studyDate,
      studyDescription: study.studyDescription,
      modalityType: study.modalityType,
      accessionNumber: study.accessionNumber,
      numberOfSeries: study.series.length,
    }));
  }

  async getStorageStats(tenantId: string): Promise<any> {
    const studies = await this.prisma.study.count({ where: { tenantId } });
    const series = await this.prisma.series.count({ where: { tenantId } });
    const images = await this.prisma.image.count({ where: { tenantId } });

    // Calculate approximate storage size
    const totalImages = await this.prisma.image.aggregate({
      where: { tenantId },
      _sum: { fileSize: true },
    });

    const storageSizeMB = Math.round((totalImages._sum.fileSize || 0) / (1024 * 1024));

    return {
      studies,
      series,
      images,
      storageSizeMB,
      averageImagesPerStudy: studies > 0 ? Math.round(images / studies) : 0,
    };
  }

  async cleanupOrphanedData(): Promise<any> {
    // Find studies without orders
    const orphanedStudies = await this.prisma.study.findMany({
      where: {
        order: null,
      },
      select: {
        id: true,
        studyInstanceUID: true,
      },
    });

    // Find series without studies
    const orphanedSeries = await this.prisma.series.findMany({
      where: {
        study: null,
      },
      select: {
        id: true,
        seriesInstanceUID: true,
      },
    });

    // Find images without series
    const orphanedImages = await this.prisma.image.findMany({
      where: {
        series: null,
      },
      select: {
        id: true,
        sopInstanceUID: true,
      },
    });

    return {
      orphanedStudies: orphanedStudies.length,
      orphanedSeries: orphanedSeries.length,
      orphanedImages: orphanedImages.length,
      studies: orphanedStudies,
      series: orphanedSeries,
      images: orphanedImages,
    };
  }
}
