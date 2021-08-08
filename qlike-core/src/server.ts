import knex, { Knex } from 'knex';

import { AllQueryMetaTypes, AllQueryTypes } from './lib/builders/builder-check';
import { DbType, ParamType } from './lib/sqlike';
import {
  paramsBindValues,
  paramValueString,
  queryToString,
} from './utils/query-utils';

const isDev = process.env.NODE_ENV === 'development';

const execute = async <T>(config: Knex.Config, query: AllQueryTypes<T>) => {
  const dbType = config.client as DbType;
  const params: ParamType[] = [];
  const queryStr = queryToString(query.meta, dbType, paramValueString(params));
  const values = paramsBindValues(params, dbType);
  isDev && console.log(queryStr, values);
  const data = (await knex(config).raw(queryStr, values)) as T;
  // TODO isDev return queryStr
  return { data };
};

export const executeOne = async <T>(
  config: Knex.Config,
  query: AllQueryTypes<T>
) => {
  return await execute<T>(config, query);
};

export const executeList = async <T>(
  config: Knex.Config,
  query: AllQueryTypes<T>
) => {
  return await execute<T[]>(config, query as any);
};
