import * as ts from 'typescript';

import { IFieldLike, ITable, ITableLike, SELECT, tableJoin } from '../sqlike';

ts.isAccessor(null);

export const toQueryString = (query: ReturnType<typeof SELECT>) => {
  const queryMeta = query.meta;
  let str = 'select';
  if (!queryMeta.fields) {
    str += ' *';
  } else {
    str += ' `';
    str += Object.keys(queryMeta.fields).join('`, `');
    str += '`';
  }
  str += ' from ';
  const fromTable = isTable(queryMeta.from)
    ? queryMeta.from.tableName
    : isJoin(queryMeta.from)
    ? queryMeta.from.left.tableName
    : '';
  str += tableStr(fromTable);
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

const isTable = <T>(tbl: ITableLike<T>): tbl is ITable<T> => {
  return !!tbl['tableName'];
};

const isJoin = (tbl: ITableLike<any>): tbl is ReturnType<typeof tableJoin> => {
  // const aa: ReturnType<typeof tableJoin>;
  return !!tbl['joinType'];
};
