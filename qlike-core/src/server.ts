import knex, { Knex } from 'knex';
import { AllQueryTypes } from './lib/builders/builder-check';
import { DbType, ParamType } from './lib/sqlike';
import {
  queryToString,
  paramValueString,
  paramsBindValues,
} from './utils/query-utils';

export const executeQuery = async <T>(
  config: Knex.Config,
  qlikeQuery: AllQueryTypes
) => {
  const dbType = config.client as DbType;
  const params: ParamType[] = [];
  const queryStr = queryToString(qlikeQuery, dbType, paramValueString(params));
  const values = paramsBindValues(params, dbType);
  console.log(queryStr, values);
  const result = (await knex(config).raw(queryStr, values)) as T;
  // TODO isDev return queryStr
  return { result };
};
