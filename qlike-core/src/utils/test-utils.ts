import { knex, Knex } from 'knex';

import { isSelectQuery } from '../lib/builders/builder-check';
import {
  insertQueryToString,
  selectQueryToString,
} from '../lib/builders/generic-sql-builder';
import { DbType, INSERT, ITable, SELECT } from '../lib/sqlike';

export interface Users {
  id: number;
  first_name: string;
  last_name: string;
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
    first_name: { fieldName: 'first_name', type: 'string' },
    last_name: { fieldName: 'last_name', type: 'string' },
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

const dbType: DbType = 'sqlite3';

export const k = knex({
  debug: true,
  client: dbType,
  useNullAsDefault: true,
});

export const expectAsKnexQuery = (
  t: any,
  qlikeQuery: ReturnType<typeof SELECT>,
  knexQuery
) => {
  const knexQuertyStr = knexQuery.toQuery();
  const qlikeQueryStr = selectQueryToString(qlikeQuery, dbType);
  return t.is(knexQuertyStr, qlikeQueryStr);
};

export const expectAsQueryString = (
  t: any,
  qlikeQuery: ReturnType<typeof SELECT> | ReturnType<typeof INSERT>,
  queryString
) => {
  const qlikeQueryStr = isSelectQuery(qlikeQuery)
    ? selectQueryToString(qlikeQuery, dbType)
    : insertQueryToString(qlikeQuery, dbType);
  return t.is(queryString, qlikeQueryStr);
};
