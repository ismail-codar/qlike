import { SELECT, DbType } from '../sqlike';
import { isTable, isJoin } from './builder-check';
import { fieldFullString, tableString, whereString } from './sql-builder-utils';

export const selectQueryToString = (
  query: ReturnType<typeof SELECT>,
  dbType: DbType
) => {
  const queryMeta = query.meta;
  let str = 'select';
  // fields
  if (!queryMeta.fields) {
    str += ' *';
  } else {
    str += ' `';
    str += Object.keys(queryMeta.fields).join('`, `');
    str += '`';
  }
  // from
  str += ' from ';
  const fromTable = isTable(queryMeta.from)
    ? queryMeta.from.tableName
    : isJoin(queryMeta.from)
    ? queryMeta.from.left.tableName
    : '';
  str += tableString(fromTable);
  // join
  if (isJoin(queryMeta.from)) {
    str += ` ${queryMeta.from.joinType.toLowerCase()} join ${tableString(
      queryMeta.from.right.tableName
    )} on ${fieldFullString(
      queryMeta.from.left.tableName,
      queryMeta.from.leftField
    )} = ${fieldFullString(
      queryMeta.from.right.tableName,
      queryMeta.from.rightField
    )}`;
  }
  // where
  if (query.meta.where) {
    str += ' where ';
    const whereStr = whereString(query.meta.from, query.meta.where, dbType);
    str += whereStr.substr(1, whereStr.length - 2);
  }

  return str;
};
