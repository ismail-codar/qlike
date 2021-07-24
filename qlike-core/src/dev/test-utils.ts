import { knex, Knex } from 'knex';

import { toQueryString } from '../lib/builders/generic-sql-builder';
import { ITable, SELECT } from '../lib/sqlike';

export interface Users {
  id: number;
  name: string;
}

export interface Accounts {
  id: number;
  name: string;
  user_id: number;
}

export const usersTable: ITable<Users> = {
  tableName: 'users',
  fields: {
    id: { fieldName: 'id', type: 'number' },
    name: { fieldName: 'name', type: 'string' },
  },
};

export const accountsTable: ITable<Accounts> = {
  tableName: 'accounts',
  fields: {
    id: { fieldName: 'id', type: 'number' },
    name: { fieldName: 'name', type: 'string' },
    user_id: { fieldName: 'user_id', type: 'number' },
  },
};

export const k = knex({
  debug: true,
  client: 'sqlite3',
  useNullAsDefault: true,
});

export const expectAsKnexQuery = (
  t: any,
  qlikeQuery: ReturnType<typeof SELECT>,
  knexQuery
) => {
  const knexQuertyStr = knexQuery.toQuery();
  const qlikeQueryStr = toQueryString(qlikeQuery);
  return t.is(knexQuertyStr, qlikeQueryStr);
  // 'select `id`, `user_id` from `users` right join `accounts` on `users`.`id` = `accounts`.`user_id`'
};
