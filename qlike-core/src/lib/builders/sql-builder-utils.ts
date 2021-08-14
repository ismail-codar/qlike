import {
  AllWhereType,
  DbType,
  IFieldLike,
  ITableLike,
  ValueStringFn,
} from '../sqlike';

import { isSelectQuery } from './builder-check';
import { selectQueryToString } from './generic-sql-builder';

export const tableString = (tableName: string) => {
  let str = '`';
  str += tableName;
  str += '`';
  return str;
};

export const fieldString = (fieldName: string) => {
  let str = '`';
  str += fieldName;
  str += '`';
  return str;
};

export const fieldFullString = (tableName: string, fieldName: string) => {
  let str = '`';
  str += tableName;
  str += '`.`';
  str += fieldName;
  str += '`';
  return str;
};

export const whereString = <T>(
  from: ITableLike<T>,
  where: AllWhereType<keyof T>,
  valueString: ValueStringFn,
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
    leftStr += whereString(
      from,
      fld as AllWhereType<keyof T>,
      valueString,
      dbType
    );
  } else {
    leftStr += '`';
    leftStr += fld;
    leftStr += '`';
  }

  if (isSelectQuery(val)) {
    rightStr = selectQueryToString(val.meta, dbType, valueString);
  } else if (typeof val === 'object') {
    rightStr = whereString(
      from,
      val as AllWhereType<keyof T>,
      valueString,
      dbType
    );
  } else {
    const field = from.fields[fld as string] as IFieldLike<any>;
    rightStr = valueString(val, field, dbType);
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

export const idField = <T>(fields: { [key in keyof T]: IFieldLike<key> }) => {
  const idName = Object.keys(fields).find((fieldName) => {
    const field = fields[fieldName] as IFieldLike<string>;
    return field.has_auto_increment;
  });
  return fields[idName] || fields['id'];
};

export const returningString = <T>(opt: {
  fieldList: (keyof T)[];
  usageType: 'insert' | 'update' | 'delete';
  tableName: string;
  idField: string;
  dbType: DbType;
}) => {
  const { fieldList, usageType, dbType, tableName, idField } = opt;
  let str = '';
  const returnFields =
    fieldList.length === 0
      ? '*'
      : fieldList
          .map((fieldName) => fieldString(fieldName as string))
          .join(', ');

  if (dbType === 'sqlite3' && usageType === 'insert') {
    str += ` ;;; SELECT ${returnFields} from \`${tableName}\` where \`${idField}\` = (select MAX(\`${idField}\`) from \`${tableName}\`)`;
  } else {
    str += ' returning ';
    str += returnFields;
  }
  return str;
};
