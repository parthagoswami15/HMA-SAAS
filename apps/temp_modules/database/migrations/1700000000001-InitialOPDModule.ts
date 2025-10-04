import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class InitialOPDModule1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Visits table
    await queryRunner.createTable(
      new Table({
        name: 'visits',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'patientId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'doctorId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'visitType',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: '"SCHEDULED"',
          },
          {
            name: 'scheduledDate',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          {
            name: 'checkInTime',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          {
            name: 'checkOutTime',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          {
            name: 'chiefComplaint',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'isFollowUp',
            type: 'boolean',
            default: false,
          },
          {
            name: 'followUpDate',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          {
            name: 'isEmergency',
            type: 'boolean',
            default: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'createdBy',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'updatedBy',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'tenantId',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create VisitVitals table
    await queryRunner.createTable(
      new Table({
        name: 'visit_vitals',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'visitId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'bloodPressureSystolic',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'bloodPressureDiastolic',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'heartRate',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'temperature',
            type: 'decimal',
            precision: 3,
            scale: 1,
            isNullable: true,
          },
          {
            name: 'respiratoryRate',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'oxygenSaturation',
            type: 'decimal',
            precision: 4,
            scale: 1,
            isNullable: true,
          },
          {
            name: 'height',
            type: 'decimal',
            precision: 4,
            scale: 1,
            isNullable: true,
            comment: 'Height in centimeters',
          },
          {
            name: 'weight',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
            comment: 'Weight in kilograms',
          },
          {
            name: 'bmi',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
            comment: 'Body Mass Index',
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'recordedAt',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'recordedBy',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'tenantId',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create foreign key constraints
    await queryRunner.createForeignKey(
      'visits',
      new TableForeignKey({
        columnNames: ['patientId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'patients',
        onDelete: 'NO ACTION',
      }),
    );

    await queryRunner.createForeignKey(
      'visits',
      new TableForeignKey({
        columnNames: ['doctorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staff',
        onDelete: 'NO ACTION',
      }),
    );

    await queryRunner.createForeignKey(
      'visit_vitals',
      new TableForeignKey({
        columnNames: ['visitId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'visits',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints first
    const visitTable = await queryRunner.getTable('visits');
    const vitalsTable = await queryRunner.getTable('visit_vitals');

    if (visitTable) {
      const patientForeignKey = visitTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('patientId') !== -1,
      );
      if (patientForeignKey) {
        await queryRunner.dropForeignKey('visits', patientForeignKey);
      }

      const doctorForeignKey = visitTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('doctorId') !== -1,
      );
      if (doctorForeignKey) {
        await queryRunner.dropForeignKey('visits', doctorForeignKey);
      }
    }

    if (vitalsTable) {
      const visitForeignKey = vitalsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('visitId') !== -1,
      );
      if (visitForeignKey) {
        await queryRunner.dropForeignKey('visit_vitals', visitForeignKey);
      }
    }

    // Drop tables
    await queryRunner.dropTable('visit_vitals');
    await queryRunner.dropTable('visits');
  }
}
