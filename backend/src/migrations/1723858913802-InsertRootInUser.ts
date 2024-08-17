import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertRootInUser1723858913802 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO public."user" (
        name, surname, email, cpf, type_user, phone, gender, date_of_birth, age, password
      )
      VALUES (
        'root', 
        'root', 
        'root@root.com', 
        '30164885072', 
        2, 
        '21988776655', 
        'MASCULINO', 
        '05/10/1986', 
        54, 
        '$2b$10$EAS0H7ZfyWNi90MvvtujFexTuiLGnqYbMDdN1URzv9bEhUzKpsPNa'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM public."user"
      WHERE email = 'root@root.com';
    `);
  }
}
