import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class InitialIPDModule1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Beds table
    await queryRunner.createTable(
      new Table({
        name: 'beds',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'bedNumber',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'bedType',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'ward',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: '"AVAILABLE"',
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
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
            name: 'tenantId',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create Admissions table
    await queryRunner.createTable(
      new Table({
        name: 'admissions',
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
            name: 'admittingDoctorId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'bedId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'admissionType',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: '"ADMITTED"',
          },
          {
            name: 'admissionDate',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'dischargeDate',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          {
            name: 'admissionNotes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'dischargeNotes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'estimatedStayDays',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'isInsuranceClaimed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'insuranceProvider',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'insurancePolicyNumber',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'insuranceCoverageAmount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'referralDoctor',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'referralHospital',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'isEmergency',
            type: 'boolean',
            default: false,
          },
          {
            name: 'additionalInfo',
            type: 'jsonb',
            isNullable: true,
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

    // Create Discharges table
    await queryRunner.createTable(
      new Table({
        name: 'discharges',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'admissionId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'dischargeDate',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'dischargeType',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'dischargeStatus',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'dischargeNotes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'followUpDate',
            type: 'timestamp with time zone',
            isNullable: true,
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

    // Create foreign key constraints
    await queryRunner.createForeignKey(
      'admissions',
      new TableForeignKey({
        columnNames: ['patientId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'patients',
        onDelete: 'NO ACTION',
      }),
    );

    await queryRunner.createForeignKey(
      'admissions',
      new TableForeignKey({
        columnNames: ['admittingDoctorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staff',
        onDelete: 'NO ACTION',
      }),
    );

    await queryRunner.createForeignKey(
      'admissions',
      new TableForeignKey({
        columnNames: ['bedId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'beds',
        onDelete: 'NO ACTION',
      }),
    );

    await queryRunner.createForeignKey(
      'discharges',
      new TableForeignKey({
        columnNames: ['admissionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'admissions',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints first
    const admissionTable = await queryRunner.getTable('admissions');
    const dischargeTable = await queryRunner.getTable('discharges');

    if (admissionTable) {
      const patientForeignKey = admissionTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('patientId') !== -1,
      );
      if (patientForeignKey) {
        await queryRunner.dropForeignKey('admissions', patientForeignKey);
      }

      const doctorForeignKey = admissionTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('admittingDoctorId') !== -1,
      );
      if (doctorForeignKey) {
        await queryRunner.dropForeignKey('admissions', doctorForeignKey);
      }

      const bedForeignKey = admissionTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('bedId') !== -1,
      );
      if (bedForeignKey) {
        await queryRunner.dropForeignKey('admissions', bedForeignKey);
      }
    }

    if (dischargeTable) {
      const admissionForeignKey = dischargeTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('admissionId') !== -1,
      );
      if (admissionForeignKey) {
        await queryRunner.dropForeignKey('discharges', admissionForeignKey);
      }
    }

    // Drop tables
    await queryRunner.dropTable('discharges');
    await queryRunner.dropTable('admissions');
    await queryRunner.dropTable('beds');
  }
}
