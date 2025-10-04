import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async encryptData(encryptDto: any, user: any) {
    this.logger.log(`Encrypting data for user: ${user.id}`);

    const { data, dataType } = encryptDto;

    // Generate encryption key
    const key = crypto.randomBytes(this.keyLength);
    const iv = crypto.randomBytes(this.ivLength);

    // Encrypt data
    const cipher = crypto.createCipherGCM(this.algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Store encryption key securely
    const encryptedKey = await this.encryptKey(key, user.tenantId);

    // Store encrypted data
    const encryptedData = await this.prisma.encryptedData.create({
      data: {
        dataType,
        encryptedContent: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        keyId: encryptedKey.id,
        encryptedBy: user.id,
        tenantId: user.tenantId,
      },
    });

    // Log encryption
    await this.auditService.logActivity({
      action: 'DATA_ENCRYPTED',
      entityType: 'ENCRYPTED_DATA',
      entityId: encryptedData.id,
      userId: user.id,
      details: { dataType },
    });

    return {
      id: encryptedData.id,
      dataType,
      encryptedAt: encryptedData.createdAt,
    };
  }

  async decryptData(decryptDto: any, user: any) {
    this.logger.log(`Decrypting data for user: ${user.id}`);

    const { dataId } = decryptDto;

    const encryptedData = await this.prisma.encryptedData.findUnique({
      where: { id: dataId },
    });

    if (!encryptedData) {
      throw new Error('Encrypted data not found');
    }

    // Get encryption key
    const keyRecord = await this.prisma.encryptionKey.findUnique({
      where: { id: encryptedData.keyId },
    });

    if (!keyRecord) {
      throw new Error('Encryption key not found');
    }

    const key = await this.decryptKey(keyRecord, user.tenantId);

    // Decrypt data
    const decipher = crypto.createDecipherGCM(
      this.algorithm,
      key,
      Buffer.from(encryptedData.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

    let decrypted = decipher.update(encryptedData.encryptedContent, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    const data = JSON.parse(decrypted);

    // Log decryption
    await this.auditService.logActivity({
      action: 'DATA_DECRYPTED',
      entityType: 'ENCRYPTED_DATA',
      entityId: dataId,
      userId: user.id,
      details: { dataType: encryptedData.dataType },
    });

    return {
      id: dataId,
      dataType: encryptedData.dataType,
      data,
      decryptedAt: new Date(),
    };
  }

  async encryptField(data: any, fieldName: string, user: any) {
    this.logger.log(`Encrypting field ${fieldName} for user: ${user.id}`);

    const fieldValue = data[fieldName];
    if (!fieldValue) {
      return data;
    }

    const encryptedValue = await this.encryptData({
      data: fieldValue,
      dataType: `field_${fieldName}`,
    }, user);

    return {
      ...data,
      [fieldName]: encryptedValue.id,
      [`${fieldName}_encrypted`]: true,
    };
  }

  async decryptField(data: any, fieldName: string, user: any) {
    const encryptedFieldId = data[fieldName];
    if (!encryptedFieldId || !data[`${fieldName}_encrypted`]) {
      return data;
    }

    const decryptedValue = await this.decryptData({
      dataId: encryptedFieldId,
    }, user);

    return {
      ...data,
      [fieldName]: decryptedValue.data,
      [`${fieldName}_encrypted`]: false,
    };
  }

  private async encryptKey(key: Buffer, tenantId: string) {
    // In production, use KMS or secure key management
    const keyEncryptionKey = this.getMasterKey(tenantId);

    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipherGCM(this.algorithm, keyEncryptionKey, iv);

    let encrypted = cipher.update(key.toString('hex'), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    const encryptedKey = await this.prisma.encryptionKey.create({
      data: {
        tenantId,
        encryptedKey: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        algorithm: this.algorithm,
      },
    });

    return encryptedKey;
  }

  private async decryptKey(keyRecord: any, tenantId: string): Promise<Buffer> {
    const keyEncryptionKey = this.getMasterKey(tenantId);

    const decipher = crypto.createDecipherGCM(
      this.algorithm,
      keyEncryptionKey,
      Buffer.from(keyRecord.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(keyRecord.authTag, 'hex'));

    let decrypted = decipher.update(keyRecord.encryptedKey, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return Buffer.from(decrypted, 'hex');
  }

  private getMasterKey(tenantId: string): Buffer {
    // In production, get master key from secure vault
    // For now, use environment variable
    const masterKey = process.env.ENCRYPTION_MASTER_KEY || 'default-master-key-for-development';
    return crypto.scryptSync(masterKey + tenantId, 'salt', this.keyLength);
  }

  async rotateEncryptionKeys(tenantId: string, user: any) {
    this.logger.log(`Rotating encryption keys for tenant: ${tenantId}`);

    // Get all encryption keys for tenant
    const oldKeys = await this.prisma.encryptionKey.findMany({
      where: { tenantId },
    });

    // Generate new master key
    const newMasterKey = crypto.randomBytes(this.keyLength);

    // Re-encrypt all keys with new master key
    for (const oldKey of oldKeys) {
      const key = await this.decryptKey(oldKey, tenantId);

      await this.prisma.encryptionKey.update({
        where: { id: oldKey.id },
        data: {
          ...await this.encryptKey(key, tenantId),
          rotatedAt: new Date(),
        },
      });
    }

    // Log key rotation
    await this.auditService.logActivity({
      action: 'ENCRYPTION_KEYS_ROTATED',
      entityType: 'TENANT',
      entityId: tenantId,
      userId: user.id,
    });

    return { success: true, rotatedKeys: oldKeys.length };
  }

  async getEncryptionStats(tenantId: string) {
    const totalEncryptedData = await this.prisma.encryptedData.count({
      where: { tenantId },
    });

    const keysCount = await this.prisma.encryptionKey.count({
      where: { tenantId },
    });

    const dataByType = await this.prisma.encryptedData.groupBy({
      by: ['dataType'],
      where: { tenantId },
      _count: { dataType: true },
    });

    return {
      tenantId,
      totalEncryptedData,
      keysCount,
      dataByType,
    };
  }
}
