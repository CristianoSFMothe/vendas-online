import { DataSource } from 'typeorm';
import { dataSourceOptions } from './database.module';
import { CreateTableUser1723255836106 } from 'src/migrations/1723255836106-CreateTableUser';

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [CreateTableUser1723255836106],
  logging: true,
});
