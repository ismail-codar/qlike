import knex, { Knex } from 'knex';

import { AllQueryTypes, isInsertQuery } from './lib/builders/builder-check';
import { DbType, ParamType } from './lib/sqlike';
import {
  paramsBindValues,
  paramValueString,
  queryToString,
} from './utils/query-utils';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const executeKnex = (
  config: Knex.Config,
  queryStr: string,
  values: any[]
) => {
  isDev && console.log(queryStr, values);
  return knex(config).raw(queryStr, values);
};

const execute = async (config: Knex.Config, query: AllQueryTypes<any>) => {
  const dbType = config.client as DbType;
  const params: ParamType[] = [];
  const queryStr = queryToString(query.meta, dbType, paramValueString(params));
  const values = paramsBindValues(params, dbType);
  if (dbType === 'sqlite3' && queryStr.indexOf(' ;;; ') !== -1) {
    const queryStrList = queryStr.split(' ;;; ');
    const resolveDataList = [];
    for (let i = 0; i < queryStrList.length; i++) {
      const str = queryStrList[i];
      const valueCount = str.split('?').length - 1;
      const resolveData = await executeKnex(
        config,
        str,
        values.splice(0, valueCount)
      );
      resolveDataList.push(resolveData);
    }
    return resolveDataList;
  } else {
    return await executeKnex(config, queryStr, values);
  }
};

export const executeOne = async <T>(
  config: Knex.Config,
  query: AllQueryTypes<T>
) => {
  let result = await execute(config, query);
  if (Array.isArray(result) && result.length === 1) {
    result = result[0];
  } else if (
    Array.isArray(result) &&
    isInsertQuery(query.meta) &&
    query.meta.returning
  ) {
    result = result.pop()?.pop();
  }
  return result;
};

export const executeList = async <T>(
  config: Knex.Config,
  query: AllQueryTypes<T>
) => {
  let result = (await execute(config, query)) as T[];
  if (!Array.isArray(result)) {
    result = [result];
  }
  return result;
};

export const executeMultiList = async <T>(
  config: Knex.Config,
  query: AllQueryTypes<T>
) => {
  const result = (await execute(config, query)) as T[][];
  return result;
};
