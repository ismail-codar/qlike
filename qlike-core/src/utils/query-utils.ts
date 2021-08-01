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

export const queryToString = (qlikeQuery: AllQueryTypes, dbType: DbType) => {
  const valueString: ValueStringFn = primitiveValueString;
  const qlikeQueryStr = isSelectQuery(qlikeQuery)
    ? selectQueryToString(qlikeQuery, valueString, dbType)
    : isInsertQuery(qlikeQuery)
    ? insertQueryToString(qlikeQuery, valueString, dbType)
    : isUpdateQuery(qlikeQuery)
    ? updateQueryToString(qlikeQuery, valueString, dbType)
    : deleteQueryToString(qlikeQuery, valueString, dbType);
  return qlikeQueryStr;
};
