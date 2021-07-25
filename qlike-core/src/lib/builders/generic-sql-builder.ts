import * as ts from 'typescript';

import {
  AllWhereType,
  DbType,
  FieldType,
  IFieldLike,
  ITableLike,
  SELECT,
} from '../sqlike';

import { isJoin, isTable } from './builder-check';

ts.isAccessor(null);

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
  str += tableStr(fromTable);
  // join
  if (isJoin(queryMeta.from)) {
    str += ` ${queryMeta.from.joinType.toLowerCase()} join ${tableStr(
      queryMeta.from.right.tableName
    )} on ${fieldFullStr(
      queryMeta.from.left.tableName,
      queryMeta.from.leftField
    )} = ${fieldFullStr(
      queryMeta.from.right.tableName,
      queryMeta.from.rightField
    )}`;
  }

  // where
  if (query.meta.where) {
    str += ' where ';
    const strw = whereStr(query.meta.from, query.meta.where, dbType);
    str += strw.substr(1, strw.length - 2);
  }

  return str;
};

const tableStr = <T>(tableName: string) => {
  let str = '`';
  str += tableName;
  str += '`';
  return str;
};

const fieldFullStr = <T>(tableName: string, fieldName: string) => {
  let str = '`';
  str += tableName;
  str += '`.`';
  str += fieldName;
  str += '`';
  return str;
};

export const whereStr = (
  from: ITableLike<unknown>,
  where: AllWhereType<string>,
  dbType: DbType
) => {
  let str = '';
  const [fld, op, val, not] = where;

  if (not) {
    str += 'not ';
  }

  let leftStr = '';
  let rightStr = '';

  if (typeof val === 'object') {
    leftStr += whereStr(from, fld as AllWhereType<string>, dbType);
  } else {
    leftStr += '`';
    leftStr += fld;
    leftStr += '`';
  }

  if (typeof val === 'object') {
    rightStr = whereStr(from, val as AllWhereType<string>, dbType);
  } else {
    const fieldType = from.fields[fld as string].type;
    rightStr = valueStr(val, fieldType, dbType);
  }

  str += '(';
  str += leftStr;
  str += ' ';
  str += op;
  str += ' ';
  str += rightStr;
  str += ')';

  return str;
};

const valueStr = (val, fieldType: FieldType, dbType: DbType) => {
  if (fieldType === 'string') return "'" + val + "'";
  else return val;
};
