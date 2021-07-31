import { knex, Knex } from 'knex';

import { AllQueryTypes } from '../../lib/builders/builder-check';
import { DbType, ITable, SELECT } from '../../lib/sqlike';
import { queryToString } from '../../utils/query-utils';

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
  name: 'users',
  fields: {
    id: { name: 'id', data_type: 'numeric' },
    first_name: { name: 'first_name', data_type: 'varchar' },
    last_name: { name: 'last_name', data_type: 'varchar' },
  },
};

export const accountsTable: ITable<Accounts> = {
  name: 'accounts',
  fields: {
    id: { name: 'id', data_type: 'numeric' },
    name: { name: 'name', data_type: 'varchar' },
    user_id: { name: 'user_id', data_type: 'numeric' },
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
  const qlikeQueryStr = queryToString(qlikeQuery, dbType);
  return t.is(knexQuertyStr, qlikeQueryStr);
};

export const expectAsQueryString = (
  t: any,
  qlikeQuery: AllQueryTypes,
  queryString
) => {
  const qlikeQueryStr = queryToString(qlikeQuery, dbType);
  return t.is(queryString, qlikeQueryStr);
};
