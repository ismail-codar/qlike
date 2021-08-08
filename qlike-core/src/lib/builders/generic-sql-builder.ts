import { primitiveValueString } from '../../utils/query-utils';
import {
  DbType,
  DELETE,
  IFieldLike,
  INSERT,
  SELECT,
  UPDATE,
  ValueStringFn,
} from '../sqlike';

import { isJoin, isSelectQuery, isTable } from './builder-check';
import {
  fieldFullString,
  fieldString,
  tableString,
  whereString,
} from './sql-builder-utils';

export const selectQueryToString = (
  query: ReturnType<typeof SELECT>,
  dbType: DbType = 'sqlite3',
  valueString: ValueStringFn = primitiveValueString
) => {
  const queryMeta = query.meta;
  let str = 'select';
  // fields
  if (Object.keys(queryMeta.fields).length === 0) {
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
    const whereStr = whereString(
      query.meta.from,
      query.meta.where,
      valueString,
      dbType
    );
    str += whereStr.substr(1, whereStr.length - 2);
  }

  return str;
};

export const insertQueryToString = (
  query: ReturnType<typeof INSERT>,
  dbType: DbType,
  valueString: ValueStringFn
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
    str += selectQueryToString(queryMeta.values, dbType, valueString);
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
              return valueString(item[fieldKey], field, dbType);
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
  dbType: DbType,
  valueString: ValueStringFn
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
        valueString(queryMeta.set[fieldKey], field, dbType)
      );
    })
    .join(', ');
  // where
  if (query.meta.where) {
    str += ' where ';
    const whereStr = whereString(
      query.meta.updateTable,
      query.meta.where,
      valueString,
      dbType
    );
    str += whereStr.substr(1, whereStr.length - 2);
  }
  return str;
};

export const deleteQueryToString = (
  query: ReturnType<typeof DELETE>,
  dbType: DbType,
  valueString: ValueStringFn
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
      valueString,
      dbType
    );
    str += whereStr.substr(1, whereStr.length - 2);
  }
  return str;
};
