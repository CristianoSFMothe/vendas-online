import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { UserEntity } from 'src/models/user/entities/user.entities';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // Converte a porta para número
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [UserEntity],
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
