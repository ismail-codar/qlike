import { primitiveValueString } from '../../utils/query-utils';
import {
  DbType,
  DeleteMetaType,
  IFieldLike,
  InsertMetaType,
  SelectMetaType,
  UpdateMetaType,
  ValueStringFn,
} from '../sqlike';

import { isJoin, isSelectQuery, isTable } from './builder-check';
import {
  fieldFullString,
  fieldString,
  idField,
  returningString,
  tableString,
  whereString,
} from './sql-builder-utils';

export const selectQueryToString = <T>(
  queryMeta: SelectMetaType<T>,
  dbType: DbType,
  valueString: ValueStringFn = primitiveValueString
) => {
  let str = 'select';
  if (queryMeta.distinct) {
    str += ' distinct';
  }
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
  if (queryMeta.where) {
    str += ' where ';
    const whereStr = whereString(
      queryMeta.from,
      queryMeta.where,
      valueString,
      dbType
    );
    str += whereStr.substr(1, whereStr.length - 2);
  }
  if (queryMeta.orderBy) {
    str += ' order by ';
    str += Object.keys(queryMeta.orderBy)
      .map((fieldName) => {
        return fieldString(fieldName) + ' ' + queryMeta.orderBy[fieldName];
      })
      .join(', ');
  }
  if (queryMeta.limit) {
    str += ' limit ';
    str += queryMeta.limit[0];
    str += ', ';
    str += queryMeta.limit[1];
  }

  return str;
};

export const insertQueryToString = <T>(
  queryMeta: InsertMetaType<T>,
  dbType: DbType,
  valueString: ValueStringFn
) => {
  const fieldNames = Array.isArray(queryMeta.values)
    ? Object.keys(queryMeta.values[0])
    : Object.keys(queryMeta.values);
  let str = 'insert into ';
  str += tableString(queryMeta.into.name);
  str += ' (`';
  str += fieldNames.join('`, `');
  str += '`) ';
  if (isSelectQuery(queryMeta.values)) {
    // TODO as any
    str += selectQueryToString(
      queryMeta.values as SelectMetaType<T>,
      dbType,
      valueString
    );
  } else {
    const values = Array.isArray(queryMeta.values)
      ? queryMeta.values
      : [queryMeta.values];
    str += 'values ';
    str += values
      .map((item) => {
        return (
          '(' +
          fieldNames
            .map((fieldKey) => {
              const field = queryMeta.into.fields[fieldKey] as IFieldLike<any>;
              return valueString(item[fieldKey], field, dbType);
            })
            .join(', ') +
          ')'
        );
      })
      .join(',\n');
  }
  if (queryMeta.returning) {
    str += returningString<T>({
      fieldList: queryMeta.returning,
      usageType: 'insert',
      dbType,
      tableName: queryMeta.into.name,
      idField: idField<T>(queryMeta.into.fields).name,
    });
  }

  return str;
};

export const updateQueryToString = <T>(
  queryMeta: UpdateMetaType<T>,
  dbType: DbType,
  valueString: ValueStringFn
) => {
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
  if (queryMeta.where) {
    str += ' where ';
    const whereStr = whereString<T>(
      queryMeta.updateTable,
      queryMeta.where,
      valueString,
      dbType
    );
    str += whereStr.substr(1, whereStr.length - 2);
  }
  if (queryMeta.returning) {
    str += returningString<T>({
      fieldList: queryMeta.returning,
      usageType: 'update',
      dbType,
      tableName: queryMeta.updateTable.name,
      idField: idField<T>(queryMeta.updateTable.fields).name,
    });
  }
  return str;
};

export const deleteQueryToString = <T>(
  queryMeta: DeleteMetaType<T>,
  dbType: DbType,
  valueString: ValueStringFn
) => {
  let str = 'delete from ';
  str += tableString(queryMeta.deleteTable.name);
  // where
  if (queryMeta.where) {
    str += ' where ';
    const whereStr = whereString(
      queryMeta.deleteTable,
      queryMeta.where,
      valueString,
      dbType
    );
    str += whereStr.substr(1, whereStr.length - 2);
  }
  if (queryMeta.returning) {
    str += returningString<T>({
      fieldList: queryMeta.returning,
      usageType: 'delete',
      dbType,
      tableName: queryMeta.deleteTable.name,
      idField: idField<T>(queryMeta.deleteTable.fields).name,
    });
  }
  return str;
};
