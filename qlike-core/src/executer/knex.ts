import knex, { Knex } from 'knex';
import { DbConfig } from '../exec';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const executeKnex = (
  config: Omit<DbConfig, 'execute'>,
  queryStr: string,
  values: any[]
) => {
  isDev && console.log(queryStr, values);
  const result = knex(config).raw(queryStr, values);
  return result;
};
