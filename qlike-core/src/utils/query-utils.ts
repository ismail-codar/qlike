import { DbType, ValueStringFn } from '..';
import {
  AllQueryTypes,
  isInsertQuery,
  isSelectQuery,
  isUpdateQuery,
} from '../lib/builders/builder-check';
import {
  deleteQueryToString,
  insertQueryToString,
  selectQueryToString,
  updateQueryToString,
} from '../lib/builders/generic-sql-builder';
import { primitiveValueString } from '../lib/builders/sql-builder-utils';

export const queryToString = (
  qlikeQuery: AllQueryTypes,
  dbType: DbType = 'sqlite3',
  valueString: ValueStringFn = primitiveValueString
) => {
  const qlikeQueryStr = isSelectQuery(qlikeQuery)
    ? selectQueryToString(qlikeQuery, dbType, valueString)
    : isInsertQuery(qlikeQuery)
    ? insertQueryToString(qlikeQuery, dbType, valueString)
    : isUpdateQuery(qlikeQuery)
    ? updateQueryToString(qlikeQuery, dbType, valueString)
    : deleteQueryToString(qlikeQuery, dbType, valueString);
  return qlikeQueryStr;
};
