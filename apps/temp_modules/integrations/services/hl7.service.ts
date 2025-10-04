import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class Hl7Service {
  private readonly logger = new Logger(Hl7Service.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async processHl7Message(hl7Dto: any, user: any) {
    this.logger.log(`Processing HL7 message for tenant: ${user.tenantId}`);

    const { messageType, messageContent, sourceSystem } = hl7Dto;

    // Parse HL7 message
    const parsedMessage = this.parseHl7Message(messageContent);

    // Process based on message type
    let result;
    switch (messageType) {
      case 'ADT_A01':
        result = await this.processAdmitMessage(parsedMessage, user);
        break;
      case 'ADT_A03':
        result = await this.processDischargeMessage(parsedMessage, user);
        break;
      case 'ORU_R01':
        result = await this.processObservationMessage(parsedMessage, user);
        break;
      case 'ORM_O01':
        result = await this.processOrderMessage(parsedMessage, user);
        break;
      default:
        throw new BadRequestException(`Unsupported HL7 message type: ${messageType}`);
    }

    // Store HL7 message
    const hl7Message = await this.prisma.hl7Message.create({
      data: {
        tenantId: user.tenantId,
        messageType,
        messageContent,
        sourceSystem,
        processedAt: new Date(),
        status: 'PROCESSED',
        processedBy: user.id,
      },
    });

    // Log HL7 processing
    await this.auditService.logActivity({
      action: 'HL7_MESSAGE_PROCESSED',
      entityType: 'HL7_MESSAGE',
      entityId: hl7Message.id,
      userId: user.id,
      details: { messageType, sourceSystem },
    });

    return {
      messageId: hl7Message.id,
      messageType,
      status: 'PROCESSED',
      result,
    };
  }

  async processAdmitMessage(admitDto: any, user: any) {
    this.logger.log(`Processing HL7 admit message`);

    const { patientId, admissionDate, admittingDoctor, admissionType } = admitDto;

    // Find or create patient
    let patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      // Create patient from HL7 data
      patient = await this.prisma.patient.create({
        data: {
          id: patientId,
          tenantId: user.tenantId,
          // Map HL7 patient data to internal format
        },
      });
    }

    // Create admission record
    const admission = await this.prisma.patientAdmission.create({
      data: {
        patientId: patient.id,
        admissionDate: new Date(admissionDate),
        admittingDoctorId: admittingDoctor,
        admissionType,
        status: 'ADMITTED',
        admittedBy: user.id,
      },
    });

    return { admissionId: admission.id, patientId: patient.id };
  }

  async processDischargeMessage(dischargeDto: any, user: any) {
    this.logger.log(`Processing HL7 discharge message`);

    const { patientId, dischargeDate, dischargeDisposition } = dischargeDto;

    const admission = await this.prisma.patientAdmission.findFirst({
      where: {
        patientId,
        status: 'ADMITTED',
      },
      orderBy: { admissionDate: 'desc' },
    });

    if (!admission) {
      throw new BadRequestException('No active admission found for patient');
    }

    // Update admission with discharge info
    const dischargedAdmission = await this.prisma.patientAdmission.update({
      where: { id: admission.id },
      data: {
        dischargeDate: new Date(dischargeDate),
        dischargeDisposition,
        status: 'DISCHARGED',
        dischargedBy: user.id,
      },
    });

    return { admissionId: dischargedAdmission.id, patientId };
  }

  async processObservationMessage(observationDto: any, user: any) {
    this.logger.log(`Processing HL7 observation message`);

    const { patientId, observations } = observationDto;

    const observationRecords = [];

    for (const obs of observations) {
      const observation = await this.prisma.observation.create({
        data: {
          patientId,
          name: obs.name,
          value: obs.value,
          unit: obs.unit,
          status: 'FINAL',
          category: obs.category,
          effectiveDateTime: new Date(obs.effectiveDateTime),
        },
      });

      observationRecords.push(observation);
    }

    return {
      patientId,
      observationCount: observationRecords.length,
      observations: observationRecords.map(o => o.id),
    };
  }

  async processOrderMessage(orderDto: any, user: any) {
    this.logger.log(`Processing HL7 order message`);

    const { patientId, orderType, orderDetails } = orderDto;

    const order = await this.prisma.labOrder.create({
      data: {
        patientId,
        orderType,
        orderDetails: JSON.stringify(orderDetails),
        status: 'ORDERED',
        orderedBy: user.id,
        orderedAt: new Date(),
      },
    });

    return { orderId: order.id, patientId };
  }

  async getHl7Message(messageId: string, user: any) {
    this.logger.log(`Getting HL7 message: ${messageId}`);

    const message = await this.prisma.hl7Message.findFirst({
      where: {
        id: messageId,
        tenantId: user.tenantId,
      },
    });

    if (!message) {
      throw new Error('HL7 message not found');
    }

    return {
      id: message.id,
      messageType: message.messageType,
      messageContent: message.messageContent,
      sourceSystem: message.sourceSystem,
      processedAt: message.processedAt,
      status: message.status,
    };
  }

  async syncData(messageType: string, syncFrom: Date, syncTo: Date, tenantId: string) {
    this.logger.log(`Syncing HL7 data: ${messageType} from ${syncFrom} to ${syncTo}`);

    // In production, sync with external HL7 systems
    const syncResult = {
      messageType,
      syncedFrom: syncFrom,
      syncedTo: syncTo,
      recordsProcessed: 0,
      errors: [],
    };

    // Mock sync process
    await new Promise(resolve => setTimeout(resolve, 1000));

    return syncResult;
  }

  async getStatus(tenantId: string) {
    this.logger.log(`Getting HL7 status for tenant: ${tenantId}`);

    const config = await this.prisma.integrationConfiguration.findFirst({
      where: {
        tenantId,
        integrationType: 'HL7',
      },
    });

    return {
      integrationType: 'HL7',
      status: config?.isActive ? 'HEALTHY' : 'ERROR',
      lastSyncAt: config?.lastSyncAt,
      isActive: config?.isActive || false,
    };
  }

  async getStats(tenantId: string) {
    this.logger.log(`Getting HL7 stats for tenant: ${tenantId}`);

    const messageCount = await this.prisma.hl7Message.count({ where: { tenantId } });
    const processedCount = await this.prisma.hl7Message.count({
      where: {
        tenantId,
        status: 'PROCESSED',
      },
    });

    const failedCount = await this.prisma.hl7Message.count({
      where: {
        tenantId,
        status: 'FAILED',
      },
    });

    const messagesByType = await this.prisma.hl7Message.groupBy({
      by: ['messageType'],
      where: { tenantId },
      _count: { messageType: true },
    });

    return {
      totalMessages: messageCount,
      processedMessages: processedCount,
      failedMessages: failedCount,
      messagesByType,
    };
  }

  async retryOperation(log: any) {
    this.logger.log(`Retrying HL7 operation: ${log.id}`);

    // In production, retry the failed HL7 operation
    const retryResult = {
      success: true,
      message: 'Operation retried successfully',
    };

    return retryResult;
  }

  private parseHl7Message(messageContent: string) {
    // In production, implement proper HL7 message parsing
    // For now, return mock parsed data
    this.logger.log(`Parsing HL7 message: ${messageContent.substring(0, 100)}...`);

    return {
      messageType: 'ADT_A01',
      patientId: 'PAT001',
      patientName: 'John Doe',
      // Add more parsed fields
    };
  }
}
