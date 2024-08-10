import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableUser1723255836106 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'surname',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'cpf',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'rg',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'type_user',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'enum',
            enum: ['MASCULINO', 'FEMININO', 'OUTRO'],
            isNullable: true,
            default: `'MASCULINO'`,
          },
          {
            name: 'date_of_birth',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'age',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
