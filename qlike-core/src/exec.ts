import { AllQueryTypes, isInsertQuery } from './lib/builders/builder-check';
import { DbType, ParamType } from './lib/sqlike';
import {
  paramsBindValues,
  paramValueString,
  queryToString,
} from './utils/query-utils';

export interface DbConfig {
  client: DbType;
  connection: any;
  execute: (
    config: Omit<DbConfig, 'execute'>,
    queryStr: string,
    values: any[]
  ) => Promise<any>;
  useNullAsDefault?: boolean;
  generator?: {
    serverTables?: string[];
    clientTables?: string[];
  };
}

const execute = async (config: DbConfig, query: AllQueryTypes<any>) => {
  const dbType = config.client;
  const params: ParamType[] = [];
  const queryStr = queryToString(query, dbType, paramValueString(params));
  const values = paramsBindValues(params, dbType);
  if (queryStr.indexOf(' ;;; ') !== -1) {
    const queryStrList = queryStr.split(' ;;; ');
    const resolveDataList = [];
    for (let i = 0; i < queryStrList.length; i++) {
      const str = queryStrList[i];
      const valueCount = str.split('?').length - 1;
      const resolveData = await config.execute(
        config,
        str,
        values.splice(0, valueCount)
      );
      resolveDataList.push(resolveData);
    }
    return resolveDataList;
  } else {
    return await config.execute(config, queryStr, values);
  }
};

export const executeOne = async <T>(
  config: DbConfig,
  query: AllQueryTypes<T>
): Promise<T> => {
  let result = await execute(config, query);
  if (Array.isArray(result)) {
    if (result.length <= 1) {
      result = result[0];
    } else {
      if (isInsertQuery(query.meta) && query.meta.returning) {
        result = result.pop()?.pop();
      } else if (result.length > 1) {
        throw (
          'executeOne returns more than one result:\n' +
          queryToString(query, config.client)
        );
      }
    }
  }
  return result;
};

export const executeList = async <T>(
  config: DbConfig,
  query: AllQueryTypes<T>
): Promise<T[]> => {
  let result = (await execute(config, query)) as T[];
  if (!Array.isArray(result)) {
    result = [result];
  }
  return result;
};

export const executeMultiList = async <T>(
  config: DbConfig,
  query: AllQueryTypes<T>
): Promise<T[][]> => {
  const result = (await execute(config, query)) as T[][];
  return result;
};
