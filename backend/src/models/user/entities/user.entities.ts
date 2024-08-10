import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'surname', nullable: false })
  surname: string;

  @Column({ name: 'email', nullable: false })
  email: string;

  @Column({ name: 'phone', nullable: true })
  phone: string;

  @Column({ name: 'gender', nullable: false })
  gender: string;

  @Column({ name: 'date_of_birth', nullable: false })
  dateOfBirth: string;

  @Column({ name: 'age', nullable: true })
  age: number;

  @Column({ name: 'cpf', nullable: false })
  cpf: string;

  @Column({ name: 'rg', nullable: false })
  rg: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'type_user', nullable: false })
  typeUser: number;
}
