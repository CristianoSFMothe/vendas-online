import { DataSource } from 'typeorm';
import { dataSourceOptions } from './database.module';
import { CreateTableUser1723255836106 } from 'src/migrations/1723255836106-CreateTableUser';
import { CreateTableAddress1723256813758 } from 'src/migrations/1723256813758-CreateTableAddress';
import { CreateTableCity1723256808767 } from 'src/migrations/1723256808767-CreateTableCity';
import { CreateTableState1723256818795 } from 'src/migrations/1723256818795-CreateTableState';
import { InsertCities1723257734926 } from 'src/migrations/1723257734926-InsertCities';
import { InsertStates1723257740033 } from 'src/migrations/1723257740033-InsertStates';

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [
    CreateTableUser1723255836106,
    CreateTableAddress1723256813758,
    CreateTableCity1723256808767,
    CreateTableState1723256818795,
    InsertCities1723257734926,
    InsertStates1723257740033,
  ],
  logging: true,
});
