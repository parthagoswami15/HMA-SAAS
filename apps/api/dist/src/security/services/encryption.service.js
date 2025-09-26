"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EncryptionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("./audit.service");
const crypto = __importStar(require("crypto"));
let EncryptionService = EncryptionService_1 = class EncryptionService {
    prisma;
    auditService;
    logger = new common_1.Logger(EncryptionService_1.name);
    algorithm = 'aes-256-gcm';
    keyLength = 32;
    ivLength = 16;
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async encryptData(encryptDto, user) {
        this.logger.log(`Encrypting data for user: ${user.id}`);
        const { data, dataType } = encryptDto;
        const key = crypto.randomBytes(this.keyLength);
        const iv = crypto.randomBytes(this.ivLength);
        const cipher = crypto.createCipherGCM(this.algorithm, key, iv);
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        const encryptedKey = await this.encryptKey(key, user.tenantId);
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
    async decryptData(decryptDto, user) {
        this.logger.log(`Decrypting data for user: ${user.id}`);
        const { dataId } = decryptDto;
        const encryptedData = await this.prisma.encryptedData.findUnique({
            where: { id: dataId },
        });
        if (!encryptedData) {
            throw new Error('Encrypted data not found');
        }
        const keyRecord = await this.prisma.encryptionKey.findUnique({
            where: { id: encryptedData.keyId },
        });
        if (!keyRecord) {
            throw new Error('Encryption key not found');
        }
        const key = await this.decryptKey(keyRecord, user.tenantId);
        const decipher = crypto.createDecipherGCM(this.algorithm, key, Buffer.from(encryptedData.iv, 'hex'));
        decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
        let decrypted = decipher.update(encryptedData.encryptedContent, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        const data = JSON.parse(decrypted);
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
    async encryptField(data, fieldName, user) {
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
    async decryptField(data, fieldName, user) {
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
    async encryptKey(key, tenantId) {
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
    async decryptKey(keyRecord, tenantId) {
        const keyEncryptionKey = this.getMasterKey(tenantId);
        const decipher = crypto.createDecipherGCM(this.algorithm, keyEncryptionKey, Buffer.from(keyRecord.iv, 'hex'));
        decipher.setAuthTag(Buffer.from(keyRecord.authTag, 'hex'));
        let decrypted = decipher.update(keyRecord.encryptedKey, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return Buffer.from(decrypted, 'hex');
    }
    getMasterKey(tenantId) {
        const masterKey = process.env.ENCRYPTION_MASTER_KEY || 'default-master-key-for-development';
        return crypto.scryptSync(masterKey + tenantId, 'salt', this.keyLength);
    }
    async rotateEncryptionKeys(tenantId, user) {
        this.logger.log(`Rotating encryption keys for tenant: ${tenantId}`);
        const oldKeys = await this.prisma.encryptionKey.findMany({
            where: { tenantId },
        });
        const newMasterKey = crypto.randomBytes(this.keyLength);
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
        await this.auditService.logActivity({
            action: 'ENCRYPTION_KEYS_ROTATED',
            entityType: 'TENANT',
            entityId: tenantId,
            userId: user.id,
        });
        return { success: true, rotatedKeys: oldKeys.length };
    }
    async getEncryptionStats(tenantId) {
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
};
exports.EncryptionService = EncryptionService;
exports.EncryptionService = EncryptionService = EncryptionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], EncryptionService);
//# sourceMappingURL=encryption.service.js.map