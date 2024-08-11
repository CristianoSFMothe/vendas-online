import { CityEntity } from '../../../models/city/entities/city.entity';
import { UserEntity } from '../../../models/user/entities/user.entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'address' })
export class AddressEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({
    name: 'user_id',
    type: 'int',
    nullable: false,
  })
  userId: number;

  @Column({
    name: 'complement',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  complement: string;

  @Column({
    name: 'street',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  street: string;

  @Column({
    name: 'neighborhood',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  neighborhood: string;

  @Column({
    name: 'number',
    type: 'int',
    nullable: false,
  })
  numberAddress: number;

  @Column({
    name: 'cep',
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  cep: string;

  @Column({
    name: 'city_id',
    type: 'varchar',
    nullable: false,
  })
  cityId: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.addresses)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;

  @ManyToOne(() => CityEntity, (city) => city.addresses)
  @JoinColumn({ name: 'city_id', referencedColumnName: 'id' })
  city?: CityEntity;
}
