import {
  DbType,
  DELETE,
  FieldType,
  IFieldLike,
  INSERT,
  ITable,
  SELECT,
  UPDATE,
} from '../sqlike';

import { isJoin, isSelectQuery, isTable } from './builder-check';
import {
  fieldFullString,
  fieldString,
  tableString,
  valueString,
  whereString,
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
    ? queryMeta.from.name
    : isJoin(queryMeta.from)
    ? queryMeta.from.left.name
    : '';
  str += tableString(fromTable);
  // join
  if (isJoin(queryMeta.from)) {
    str += ` ${queryMeta.from.joinType.toLowerCase()} join ${tableString(
      queryMeta.from.right.name
    )} on ${fieldFullString(
      queryMeta.from.left.name,
      queryMeta.from.leftField
    )} = ${fieldFullString(
      queryMeta.from.right.name,
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
  const fieldNames = Array.isArray(query.meta.values)
    ? Object.keys(query.meta.values[0])
    : Object.keys(query.meta.values);
  let str = 'insert into ';
  str += tableString(queryMeta.into.name);
  str += ' (`';
  str += fieldNames.join('`, `');
  str += '`) ';
  if (isSelectQuery(queryMeta.values)) {
    str += selectQueryToString(queryMeta.values, dbType);
  } else {
    const values = Array.isArray(query.meta.values)
      ? query.meta.values
      : [query.meta.values];
    str += 'values ';
    str += values
      .map((item) => {
        return (
          '(' +
          fieldNames
            .map((fieldKey) => {
              const field = query.meta.into.fields[fieldKey] as IFieldLike<any>;
              return valueString(item[fieldKey], field.data_type, dbType);
            })
            .join(', ') +
          ')'
        );
      })
      .join(',\n');
  }

  return str;
};

export const updateQueryToString = (
  query: ReturnType<typeof UPDATE>,
  dbType: DbType
) => {
  const queryMeta = query.meta;
  let str = 'update ';
  str += tableString(queryMeta.updateTable.name);
  str += ' set ';
  str += Object.keys(queryMeta.set)
    .map((fieldKey) => {
      const field = queryMeta.updateTable.fields[fieldKey] as IFieldLike<any>;
      return (
        fieldString(fieldKey) +
        ' = ' +
        valueString(queryMeta.set[fieldKey], field.data_type, dbType)
      );
    })
    .join(', ');
  // where
  if (query.meta.where) {
    str += ' where ';
    const whereStr = whereString(
      query.meta.updateTable,
      query.meta.where,
      dbType
    );
    str += whereStr.substr(1, whereStr.length - 2);
  }
  return str;
};

export const deleteQueryToString = (
  query: ReturnType<typeof DELETE>,
  dbType: DbType
) => {
  const queryMeta = query.meta;
  let str = 'delete from ';
  str += tableString(queryMeta.deleteTable.name);
  // where
  if (query.meta.where) {
    str += ' where ';
    const whereStr = whereString(
      query.meta.deleteTable,
      query.meta.where,
      dbType
    );
    str += whereStr.substr(1, whereStr.length - 2);
  }
  return str;
};
