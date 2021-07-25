import * as ts from 'typescript';

import { AllWhereType, IFieldLike, ITableLike, SELECT } from '../sqlike';

import {
  isBetweenWhereType,
  isConditionWhereType,
  isInWhereType,
  isIsWhereType,
  isJoin,
  isTable,
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
    str += ' where ';
    const strWhere = whereStr(query.meta.from, query.meta.where);
    str += strWhere.substr(1, strWhere.length - 2);
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
  where: AllWhereType<string>
) => {
  let str = '';
  // isAttributeWhereType,
  // `first_name` = 'Test'
  const [fld, op, val, not] = where;
  if (not) {
    str += 'not ';
  }

  let leftStr = '';
  let rightStr = '';

  if (typeof fld === 'string') {
    leftStr += '`';
    leftStr += fld;
    leftStr += '`';
  } else {
    leftStr += whereStr(from, fld as AllWhereType<string>);
  }

  if (typeof val === 'object') {
    rightStr = whereStr(from, val as AllWhereType<string>);
  } else {
    const fieldType = from.fields[fld as string].type;
    rightStr = valueStr(val, fieldType);
  }

  str += '(';
  str += leftStr;
  str += ' ';
  str += op;
  str += ' ';
  str += rightStr;
  str += ')';

  // if (isInWhereType(where)) {
  //   const [fld, op, val] = where;
  // } else if (isIsWhereType(where)) {
  //   const [fld, op, val] = where;
  // } else if (isBetweenWhereType(where)) {
  //   const [fld, op, val] = where;
  // } else if (isConditionWhereType(where)) {
  //   const [fld, op, val] = where;
  // }

  return str;
};

const valueStr = (
  val,
  fieldType: 'string' | 'number' | 'date' | 'time' | 'boolean'
) => {
  if (fieldType === 'string') return "'" + val + "'";
  else return val;
};
