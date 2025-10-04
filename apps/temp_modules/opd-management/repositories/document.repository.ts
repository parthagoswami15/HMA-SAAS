import { EntityRepository, Repository, Between, In, Not, IsNull } from 'typeorm';
import { Document, DocumentStatus, DocumentType } from '../entities/document.entity';

@EntityRepository(Document)
export class DocumentRepository extends Repository<Document> {
  async findByVisitId(visitId: string): Promise<Document[]> {
    return this.find({
      where: { visitId },
      relations: ['uploadedBy'],
      order: { uploadedAt: 'DESC' },
    });
  }

  async findByPatientId(patientId: string, type?: DocumentType): Promise<Document[]> {
    const where: any = { patientId };
    if (type) where.type = type;

    return this.find({
      where,
      relations: ['uploadedBy', 'visit'],
      order: { uploadedAt: 'DESC' },
    });
  }

  async findDocumentsByType(
    type: DocumentType,
    status?: DocumentStatus,
    startDate?: Date,
    endDate?: Date
  ): Promise<Document[]> {
    const where: any = { type };
    if (status) where.status = status;
    if (startDate && endDate) {
      where.uploadedAt = Between(startDate, endDate);
    }

    return this.find({
      where,
      relations: ['patient', 'uploadedBy', 'visit'],
      order: { uploadedAt: 'DESC' },
    });
  }

  async getDocumentStats(patientId?: string): Promise<{
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    totalSize: number;
  }> {
    const where: any = {};
    if (patientId) where.patientId = patientId;

    // Get total count
    const total = await this.count({ where });

    // Get count by document type
    const typeResults = await this.createQueryBuilder('document')
      .select('document.type', 'type')
      .addSelect('COUNT(document.id)', 'count')
      .where(patientId ? 'document.patientId = :patientId' : '1=1', { patientId })
      .groupBy('document.type')
      .getRawMany();

    // Get count by status
    const statusResults = await this.createQueryBuilder('document')
      .select('document.status', 'status')
      .addSelect('COUNT(document.id)', 'count')
      .where(patientId ? 'document.patientId = :patientId' : '1=1', { patientId })
      .groupBy('document.status')
      .getRawMany();

    // Get total size
    const sizeResult = await this.createQueryBuilder('document')
      .select('COALESCE(SUM(document.size), 0)', 'totalSize')
      .where(patientId ? 'document.patientId = :patientId' : '1=1', { patientId })
      .getRawOne();

    return {
      total,
      byType: typeResults.reduce((acc, { type, count }) => ({
        ...acc,
        [type]: parseInt(count, 10),
      }), {}),
      byStatus: statusResults.reduce((acc, { status, count }) => ({
        ...acc,
        [status]: parseInt(count, 10),
      }), {}),
      totalSize: parseInt(sizeResult?.totalSize || '0', 10),
    };
  }

  async findDocumentsNeedingReview(providerId?: string): Promise<Document[]> {
    const query = this.createQueryBuilder('document')
      .where('document.status = :status', { status: DocumentStatus.PENDING_REVIEW })
      .orderBy('document.uploadedAt', 'ASC');

    if (providerId) {
      query.andWhere('document.assignedToId = :providerId', { providerId });
    }

    return query
      .leftJoinAndSelect('document.patient', 'patient')
      .leftJoinAndSelect('document.uploadedBy', 'uploadedBy')
      .getMany();
  }

  async findDocumentsByKeyword(keyword: string): Promise<Document[]> {
    return this.createQueryBuilder('document')
      .where('LOWER(document.name) LIKE LOWER(:keyword)', { keyword: `%${keyword}%` })
      .orWhere('LOWER(document.description) LIKE LOWER(:keyword)', { keyword: `%${keyword}%` })
      .orWhere('LOWER(document.tags) LIKE LOWER(:keyword)', { keyword: `%${keyword}%` })
      .leftJoinAndSelect('document.patient', 'patient')
      .leftJoinAndSelect('document.uploadedBy', 'uploadedBy')
      .orderBy('document.uploadedAt', 'DESC')
      .getMany();
  }

  async getDocumentVersions(documentId: string): Promise<Document[]> {
    const document = await this.findOne({
      where: { id: documentId },
      select: ['versionGroupId'],
    });

    if (!document || !document.versionGroupId) {
      return [];
    }

    return this.find({
      where: { versionGroupId: document.versionGroupId },
      order: { version: 'DESC' },
      relations: ['uploadedBy'],
    });
  }

  async getDocumentUsageStats(
    startDate: Date,
    endDate: Date
  ): Promise<Array<{ type: string; count: number; totalSize: number }>> {
    return this.createQueryBuilder('document')
      .select('document.type', 'type')
      .addSelect('COUNT(document.id)', 'count')
      .addSelect('COALESCE(SUM(document.size), 0)', 'totalSize')
      .where('document.uploadedAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('document.type')
      .orderBy('count', 'DESC')
      .getRawMany();
  }
}
