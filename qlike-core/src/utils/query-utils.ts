import { DbType } from '..';
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

export const queryToString = (qlikeQuery: AllQueryTypes, dbType: DbType) => {
  const qlikeQueryStr = isSelectQuery(qlikeQuery)
    ? selectQueryToString(qlikeQuery, dbType)
    : isInsertQuery(qlikeQuery)
    ? insertQueryToString(qlikeQuery, dbType)
    : isUpdateQuery(qlikeQuery)
    ? updateQueryToString(qlikeQuery, dbType)
    : deleteQueryToString(qlikeQuery, dbType);
  return qlikeQueryStr;
};
