import { DbType, FieldType, INSERT, SELECT } from '../sqlike';

import { isJoin, isSelectQuery, isTable } from './builder-check';
import {
  fieldFullString,
  tableString,
  whereString,
  valueString,
} from './sql-builder-utils';

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

export const insertQueryToString = (
  query: ReturnType<typeof INSERT>,
  dbType: DbType
) => {
  const queryMeta = query.meta;
  let str = 'insert  into ';
  str += tableString(queryMeta.into.tableName);
  str += '(';
  str += Object.keys(queryMeta.values).join(', ');
  str += ')';
  if (isSelectQuery(queryMeta.values as any)) {
    // TODO isSelectQuery INSERT
  } else {
    const values = Array.isArray(query.meta.values)
      ? query.meta.values
      : [query.meta.values];
    const fieldType: FieldType = null;
    str += values
      .map((item) => valueString(item, fieldType, dbType))
      .join(',\n');
  }

  return str;
};
