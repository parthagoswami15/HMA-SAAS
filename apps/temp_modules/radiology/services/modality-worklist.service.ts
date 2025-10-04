import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ModalityWorklistDto } from '../dto/modalities.dto';

@Injectable()
export class ModalityWorklistService {
  constructor(private prisma: PrismaService) {}

  async getWorklist(modalityId: string): Promise<any[]> {
    // Get all scheduled studies for a modality
    const studies = await this.prisma.study.findMany({
      where: {
        modalityId,
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      },
      include: {
        order: {
          include: {
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                dateOfBirth: true,
                gender: true,
                patientId: true,
              },
            },
          },
        },
      },
      orderBy: { scheduledFor: 'asc' },
    });

    return studies.map(study => ({
      studyInstanceUID: study.studyInstanceUID,
      accessionNumber: study.accessionNumber,
      patientName: `${study.order.patient.firstName} ${study.order.patient.lastName}`,
      patientId: study.order.patient.patientId,
      patientBirthDate: study.order.patient.dateOfBirth,
      patientSex: study.order.patient.gender,
      scheduledFor: study.scheduledFor,
      priority: study.order.priority,
      protocol: study.order.protocol,
      clinicalHistory: study.order.clinicalHistory,
      bodyPart: study.order.bodyPart,
      contrastType: study.order.contrastType,
      contrastAllergy: study.order.contrastAllergy,
      isPregnant: study.order.isPregnant,
      specialInstructions: study.order.specialInstructions,
    }));
  }

  async sendToWorklist(modalityId: string, worklistDto: ModalityWorklistDto): Promise<any> {
    // Find the study
    const study = await this.prisma.study.findFirst({
      where: {
        studyInstanceUID: worklistDto.studyInstanceUID,
        modalityId,
      },
    });

    if (!study) {
      throw new NotFoundException('Study not found or not assigned to this modality');
    }

    // Update study status to in progress
    await this.prisma.study.update({
      where: { id: study.id },
      data: {
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });

    // Create worklist entry (this would typically be sent via DICOM MWL)
    const worklistEntry = await this.prisma.modalityWorklist.create({
      data: {
        modalityId,
        studyId: study.id,
        patientName: worklistDto.patientName,
        patientId: worklistDto.patientId,
        accessionNumber: worklistDto.accessionNumber,
        studyInstanceUID: worklistDto.studyInstanceUID,
        worklistData: worklistDto.worklistData,
        sentAt: new Date(),
        status: 'SENT',
      },
    });

    return {
      worklistEntry,
      message: 'Study sent to modality worklist',
    };
  }

  async updateWorklistStatus(worklistEntryId: string, status: string): Promise<any> {
    const worklistEntry = await this.prisma.modalityWorklist.findUnique({
      where: { id: worklistEntryId },
    });

    if (!worklistEntry) {
      throw new NotFoundException('Worklist entry not found');
    }

    return this.prisma.modalityWorklist.update({
      where: { id: worklistEntryId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
  }

  async getWorklistByModality(modalityId: string, date?: Date): Promise<any[]> {
    const where: any = { modalityId };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      where.scheduledFor = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const worklistEntries = await this.prisma.modalityWorklist.findMany({
      where,
      include: {
        study: {
          include: {
            order: {
              include: {
                patient: true,
              },
            },
          },
        },
        modality: true,
      },
      orderBy: { sentAt: 'desc' },
    });

    return worklistEntries.map(entry => ({
      id: entry.id,
      modalityId: entry.modalityId,
      studyInstanceUID: entry.studyInstanceUID,
      patientName: entry.patientName,
      patientId: entry.patientId,
      accessionNumber: entry.accessionNumber,
      status: entry.status,
      sentAt: entry.sentAt,
      study: entry.study,
      modality: entry.modality,
    }));
  }

  async getPendingWorklistItems(tenantId: string): Promise<any[]> {
    const pendingEntries = await this.prisma.modalityWorklist.findMany({
      where: {
        status: { in: ['SENT', 'PENDING'] },
        modality: {
          tenantId,
          isActive: true,
        },
      },
      include: {
        study: {
          include: {
            order: {
              include: {
                patient: true,
              },
            },
          },
        },
        modality: true,
      },
      orderBy: { sentAt: 'asc' },
    });

    return pendingEntries.map(entry => ({
      id: entry.id,
      modalityId: entry.modalityId,
      modalityName: entry.modality.name,
      modalityType: entry.modality.modalityType,
      studyInstanceUID: entry.studyInstanceUID,
      patientName: entry.patientName,
      patientId: entry.patientId,
      accessionNumber: entry.accessionNumber,
      status: entry.status,
      sentAt: entry.sentAt,
      scheduledFor: entry.study?.scheduledFor,
      priority: entry.study?.order?.priority,
    }));
  }

  async cleanupOldWorklistEntries(daysOld: number = 30): Promise<any> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const oldEntries = await this.prisma.modalityWorklist.findMany({
      where: {
        sentAt: { lt: cutoffDate },
        status: { in: ['COMPLETED', 'CANCELLED'] },
      },
    });

    const deletedCount = await this.prisma.modalityWorklist.deleteMany({
      where: {
        sentAt: { lt: cutoffDate },
        status: { in: ['COMPLETED', 'CANCELLED'] },
      },
    });

    return {
      deletedCount: deletedCount.count,
      deletedEntries: oldEntries.map(entry => entry.id),
    };
  }
}
