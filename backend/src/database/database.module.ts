import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { UserEntity } from '../models/user/entities/user.entities';
import { AddressEntity } from '../models/address/entities/address.entity';
import { CityEntity } from '../models/city/entities/city.entity';
import { StateEntity } from '../models/state/entities/state.entity';
import { CategoryEntity } from '../models/category/entities/category.entity';
import { ProductEntity } from '../models/product/entities/product.entity';
import { CartEntity } from '../models/cart/entities/cart.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // Converte a porta para número
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    UserEntity,
    AddressEntity,
    CityEntity,
    StateEntity,
    CategoryEntity,
    ProductEntity,
    CartEntity,
  ],
  synchronize: false,
  logging: true,
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          ...dataSourceOptions,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
