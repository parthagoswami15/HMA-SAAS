import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { VisitService } from './services/visit.service';
import { EncounterService } from './services/encounter.service';
import { PrescriptionService } from './services/prescription.service';
import { QueueService } from './services/queue.service';
import { OrderService } from './services/order.service';
import { DocumentService } from './services/document.service';
import { BillingService } from './services/billing.service';
import { Icd10Service } from './services/icd10.service';
import { DiagnosisService } from './services/diagnosis.service';
import { VitalsService } from './services/vitals.service';

@Injectable()
export class OPDService {
  constructor(
    @Inject(forwardRef(() => VisitService))
    private readonly visitService: VisitService,
    @Inject(forwardRef(() => EncounterService))
    private readonly encounterService: EncounterService,
    @Inject(forwardRef(() => PrescriptionService))
    private readonly prescriptionService: PrescriptionService,
    @Inject(forwardRef(() => QueueService))
    private readonly queueService: QueueService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    @Inject(forwardRef(() => DocumentService))
    private readonly documentService: DocumentService,
    @Inject(forwardRef(() => BillingService))
    private readonly billingService: BillingService,
    @Inject(forwardRef(() => Icd10Service))
    private readonly icd10Service: Icd10Service,
    @Inject(forwardRef(() => DiagnosisService))
    private readonly diagnosisService: DiagnosisService,
    @Inject(forwardRef(() => VitalsService))
    private readonly vitalsService: VitalsService,
  ) {}

  // Visit Methods
  async createVisit(createVisitDto: any) {
    return this.visitService.create(createVisitDto);
  }

  async getVisitById(id: string) {
    return this.visitService.findById(id);
  }

  async updateVisit(id: string, updateVisitDto: any) {
    return this.visitService.update(id, updateVisitDto);
  }

  async deleteVisit(id: string) {
    return this.visitService.delete(id);
  }

  // Encounter Methods
  async createEncounter(createEncounterDto: any) {
    return this.encounterService.create(createEncounterDto);
  }

  async getEncounterById(id: string) {
    return this.encounterService.findById(id);
  }

  async updateEncounter(id: string, updateEncounterDto: any) {
    return this.encounterService.update(id, updateEncounterDto);
  }

  async completeEncounter(id: string) {
    return this.encounterService.completeEncounter(id);
  }

  // Prescription Methods
  async createPrescription(createPrescriptionDto: any) {
    return this.prescriptionService.create(createPrescriptionDto);
  }

  async getPrescriptionsByPatient(patientId: string) {
    return this.prescriptionService.findByPatient(patientId);
  }

  async getActivePrescriptions(patientId: string) {
    return this.prescriptionService.findActiveByPatient(patientId);
  }

  // Queue Management
  async generateToken(generateTokenDto: any) {
    return this.queueService.generateToken(generateTokenDto);
  }

  async getCurrentToken(doctorId?: string) {
    return this.queueService.getCurrentToken(doctorId);
  }

  async callNextToken(doctorId: string) {
    return this.queueService.callNextToken(doctorId);
  }

  // Order Management
  async createOrder(createOrderDto: any) {
    return this.orderService.create(createOrderDto);
  }

  async getOrdersByEncounter(encounterId: string) {
    return this.orderService.findByEncounter(encounterId);
  }

  // Document Management
  async uploadDocument(uploadDocumentDto: any, file: Express.Multer.File) {
    return this.documentService.upload(uploadDocumentDto, file);
  }

  async getPatientDocuments(patientId: string) {
    return this.documentService.findByPatient(patientId);
  }

  // Billing
  async generateBill(encounterId: string) {
    return this.billingService.generateBill(encounterId);
  }

  async processPayment(billId: string, paymentDetails: any) {
    return this.billingService.processPayment(billId, paymentDetails);
  }

  // ICD-10 and Diagnosis
  async searchIcd10Codes(query: string) {
    return this.icd10Service.search(query);
  }

  async createDiagnosis(createDiagnosisDto: any) {
    return this.diagnosisService.create(createDiagnosisDto);
  }

  async getPatientDiagnoses(patientId: string) {
    return this.diagnosisService.findByPatient(patientId);
  }

  // Vitals
  async recordVitals(recordVitalsDto: any) {
    return this.vitalsService.record(recordVitalsDto);
  }

  async getPatientVitals(patientId: string) {
    return this.vitalsService.findByPatient(patientId);
  }

  async getVisits(
    options: IPaginationOptions,
    filters?: { status?: string; patientId?: string; providerId?: string },
  ): Promise<Pagination<Visit>> {
    const query = this.visitRepository.createQueryBuilder('visit');
    
    if (filters?.status) query.andWhere('visit.status = :status', { status: filters.status });
    if (filters?.patientId) query.andWhere('visit.patientId = :patientId', { patientId: filters.patientId });
    if (filters?.providerId) query.andWhere('visit.providerId = :providerId', { providerId: filters.providerId });
    
    query.orderBy('visit.scheduledAt', 'DESC');
    return paginate<Visit>(query, options);
  }

  async getVisitById(id: string): Promise<Visit> {
    const visit = await this.visitRepository.findOne({ 
      where: { id },
      relations: ['patient', 'provider', 'encounters', 'prescriptions', 'orders']
    });
    if (!visit) throw new NotFoundException(`Visit with ID ${id} not found`);
    return visit;
  }

  async updateVisit(id: string, updateVisitDto: any): Promise<Visit> {
    const visit = await this.getVisitById(id);
    Object.assign(visit, updateVisitDto);
    return this.visitRepository.save(visit);
  }

  // Encounter Methods
  async createEncounter(createEncounterDto: any): Promise<Encounter> {
    const encounter = this.encounterRepository.create(createEncounterDto);
    return this.encounterRepository.save(encounter);
  }

  async getEncounterById(id: string): Promise<Encounter> {
    const encounter = await this.encounterRepository.findOne({ 
      where: { id },
      relations: ['visit', 'provider'] 
    });
    if (!encounter) throw new NotFoundException(`Encounter with ID ${id} not found`);
    return encounter;
  }

  // Queue Methods
  async addToQueue(createQueueTokenDto: any): Promise<QueueToken> {
    const lastToken = await this.queueTokenRepository.findOne({
      where: { departmentId: createQueueTokenDto.departmentId },
      order: { tokenNumber: 'DESC' },
    });

    const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;
    const displayNumber = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${tokenNumber.toString().padStart(3, '0')}`;

    const queueToken = this.queueTokenRepository.create({
      ...createQueueTokenDto,
      tokenNumber,
      displayNumber,
      status: TokenStatus.WAITING,
      issuedAt: new Date(),
    });

    return this.queueTokenRepository.save(queueToken);
  }

  async getQueue(departmentId?: string): Promise<QueueToken[]> {
    const where: any = { 
      status: In([TokenStatus.WAITING, TokenStatus.CALLED, TokenStatus.IN_PROGRESS]) 
    };
    
    if (departmentId) where.departmentId = departmentId;

    return this.queueTokenRepository.find({
      where,
      order: { 
        priority: 'DESC',
        issuedAt: 'ASC' 
      },
      relations: ['visit', 'visit.patient'],
    });
  }

  // Other methods with similar patterns...
  async callNextPatient(id: string, updateData: any): Promise<QueueToken> {
    const token = await this.queueTokenRepository.findOne({ where: { id } });
    if (!token) throw new NotFoundException('Token not found');
    
    Object.assign(token, {
      ...updateData,
      status: TokenStatus.CALLED,
      calledAt: new Date(),
    });
    
    return this.queueTokenRepository.save(token);
  }

  // Prescription, Order, and Document methods follow similar patterns...
}
