-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN "createdBy" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "updatedBy" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MedicalRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "doctorId" TEXT,
    "updatedById" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MedicalRecord_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MedicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MedicalRecord_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MedicalRecord_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_MedicalRecord" ("createdAt", "date", "description", "doctorId", "id", "isActive", "patientId", "recordType", "tenantId", "title", "updatedAt") SELECT "createdAt", "date", "description", "doctorId", "id", "isActive", "patientId", "recordType", "tenantId", "title", "updatedAt" FROM "MedicalRecord";
DROP TABLE "MedicalRecord";
ALTER TABLE "new_MedicalRecord" RENAME TO "MedicalRecord";
CREATE INDEX "MedicalRecord_patientId_idx" ON "MedicalRecord"("patientId");
CREATE INDEX "MedicalRecord_recordType_idx" ON "MedicalRecord"("recordType");
CREATE INDEX "MedicalRecord_date_idx" ON "MedicalRecord"("date");
CREATE TABLE "new_PharmacyOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "orderDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispensedDate" DATETIME,
    "notes" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "invoiceId" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    CONSTRAINT "PharmacyOrder_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PharmacyOrder_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PharmacyOrder_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PharmacyOrder_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PharmacyOrder" ("createdAt", "dispensedDate", "doctorId", "id", "notes", "orderDate", "orderNumber", "patientId", "status", "tenantId", "updatedAt") SELECT "createdAt", "dispensedDate", "doctorId", "id", "notes", "orderDate", "orderNumber", "patientId", "status", "tenantId", "updatedAt" FROM "PharmacyOrder";
DROP TABLE "PharmacyOrder";
ALTER TABLE "new_PharmacyOrder" RENAME TO "PharmacyOrder";
CREATE UNIQUE INDEX "PharmacyOrder_orderNumber_key" ON "PharmacyOrder"("orderNumber");
CREATE INDEX "PharmacyOrder_patientId_idx" ON "PharmacyOrder"("patientId");
CREATE INDEX "PharmacyOrder_doctorId_idx" ON "PharmacyOrder"("doctorId");
CREATE INDEX "PharmacyOrder_status_idx" ON "PharmacyOrder"("status");
CREATE INDEX "PharmacyOrder_orderDate_idx" ON "PharmacyOrder"("orderDate");
CREATE UNIQUE INDEX "PharmacyOrder_invoiceId_key" ON "PharmacyOrder"("invoiceId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "LabOrderTest_tenantId_idx" ON "LabOrderTest"("tenantId");
