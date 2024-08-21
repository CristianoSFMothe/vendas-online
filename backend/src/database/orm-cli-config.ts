import { DataSource } from 'typeorm';
import { dataSourceOptions } from './database.module';
import { CreateTableUser1723255836106 } from '../migrations/1723255836106-CreateTableUser';
import { CreateTableAddress1723256813758 } from '../migrations/1723256813758-CreateTableAddress';
import { CreateTableCity1723256808767 } from '../migrations/1723256808767-CreateTableCity';
import { CreateTableState1723256818795 } from '../migrations/1723256818795-CreateTableState';
import { InsertCities1723257734926 } from '../migrations/1723257734926-InsertCities';
import { InsertStates1723257740033 } from '../migrations/1723257740033-InsertStates';
import { CreateTableCategory1723347278125 } from '../migrations/1723347278125-CreateTableCategory';
import { CreateTableProduct1723347289529 } from '../migrations/1723347289529-CreateTableProduct';
import { InsertRootInUser1723858913802 } from '../migrations/1723858913802-InsertRootInUser';
import { CreateTableCart1724153799874 } from '../migrations/1724153799874-CreateTableCart';
import { CreateTableCartProduct1724201172954 } from '../migrations/1724201172954-CreateTableCartProduct';
import { AlterTableCart1724203892965 } from '../migrations/1724203892965-AlterTableCart';

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
    CreateTableCategory1723347278125,
    CreateTableProduct1723347289529,
    InsertRootInUser1723858913802,
    CreateTableCart1724153799874,
    CreateTableCartProduct1724201172954,
    AlterTableCart1724203892965,
  ],
  logging: true,
});
