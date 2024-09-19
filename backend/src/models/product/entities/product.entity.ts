import { CategoryEntity } from '../../category/entities/category.entity';
import { CartProductEntity } from '../../../models/cart-product/entities/cart-product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'product' })
export class ProductEntity {
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
    name: 'category_id',
    type: 'int',
    nullable: false,
  })
  categoryId: number;

  @Column({
    name: 'price',
    type: 'decimal',
    nullable: false,
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({
    name: 'amount',
    type: 'int',
    nullable: false,
  })
  amount: number;

  @Column({
    name: 'image',
    type: 'varchar',
    nullable: false,
  })
  image: string;

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

  @OneToMany(() => CartProductEntity, (cartProduct) => cartProduct.product)
  cartProduct?: CartProductEntity[];

  @ManyToOne(
    () => CategoryEntity,
    (category: CategoryEntity) => category.products,
  )
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category?: CategoryEntity;
}
