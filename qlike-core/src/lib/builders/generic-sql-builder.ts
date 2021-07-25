import * as ts from 'typescript';

import { SELECT, AllWhereType } from '../sqlike';
import {
  isTable,
  isJoin,
  isBetweenWhereType,
  isConditionWhereType,
  isInWhereType,
  isIsWhereType,
} from './builder-check';

ts.isAccessor(null);

export const selectQueryToString = (query: ReturnType<typeof SELECT>) => {
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
    str += whereStr(query.meta.where);
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

export const whereStr = <T>(where: AllWhereType<T>) => {
  let str = '';

  // isAttributeWhereType,
  // `first_name` = 'Test'
  const [fld, op, val, not] = where;
  if (not) {
    str += 'not ';
  }
  str += '`';
  str += fld;
  str += '` ';
  str += op;
  str += ' ';
  str += valueStr(val);

  if (isInWhereType(where)) {
    const [fld, op, val] = where;
  } else if (isIsWhereType(where)) {
    const [fld, op, val] = where;
  } else if (isBetweenWhereType(where)) {
    const [fld, op, val] = where;
  } else if (isConditionWhereType(where)) {
    const [fld, op, val] = where;
  }
  return str;
};

const valueStr = (val) => {
  return val;
};
