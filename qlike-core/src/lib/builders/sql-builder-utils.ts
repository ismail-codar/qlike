import {
  AllWhereType,
  DbType,
  IFieldLike,
  ITableLike,
  ValueStringFn,
} from '../sqlike';

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

  if (typeof val === 'object') {
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

export const returningString = <T>(fieldList: (keyof T)[], dbType: DbType) => {
  let str = ' returning ';
  if (fieldList.length === 0) {
    if (dbType === 'sqlite3') {
      str += '*';
    } else {
      str += 'row';
    }
  } else {
    str += fieldList
      .map((fieldName) => fieldString(fieldName as string))
      .join(', ');
  }
  return str;
};
