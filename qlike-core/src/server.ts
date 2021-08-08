import knex, { Knex } from 'knex';

import { AllQueryMetaTypes } from './lib/builders/builder-check';
import { DbType, ParamType } from './lib/sqlike';
import {
  paramsBindValues,
  paramValueString,
  queryToString,
} from './utils/query-utils';

export const executeOne = async <T>(
  config: Knex.Config,
  queryMeta: AllQueryMetaTypes<T>
) => {
  const dbType = config.client as DbType;
  const params: ParamType[] = [];
  const queryStr = queryToString(queryMeta, dbType, paramValueString(params));
  const values = paramsBindValues(params, dbType);
  console.log(queryStr, values);
  const data = (await knex(config).raw(queryStr, values)) as T;
  // TODO isDev return queryStr
  return { data };
};

export const executeList = async <T>(
  config: Knex.Config,
  queryMeta: AllQueryMetaTypes<T>
) => {
  return await executeOne<T[]>(config, queryMeta as any);
};
