import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { GenderType } from '../enum/user.enum';
import { AddressEntity } from 'src/models/address/entities/address.entity';

@Entity({ name: 'user' })
@Unique(['email', 'cpf'])
export class UserEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'surname',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  surname: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  email: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  phone: string;

  @Column({
    name: 'gender',
    type: 'enum',
    enum: GenderType,
    default: GenderType.MALE,
    nullable: false,
  })
  gender: GenderType;

  @Column({
    name: 'date_of_birth',
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  dateOfBirth: string;

  @Column({
    name: 'age',
    type: 'int',
    nullable: true,
  })
  age: number;

  @Column({
    name: 'cpf',
    type: 'varchar',
    length: 15,
    nullable: false,
  })
  cpf: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 2500,
    nullable: false,
  })
  password: string;

  @Column({ name: 'type_user', nullable: false })
  typeUser: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => AddressEntity, (address) => address.user)
  addresses?: AddressEntity[];
}
