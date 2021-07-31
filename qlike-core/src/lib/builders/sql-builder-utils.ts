import {
  AllWhereType,
  DbType,
  FieldType,
  IFieldLike,
  ITableLike,
} from '../sqlike';

export const tableString = <T>(tableName: string) => {
  let str = '`';
  str += tableName;
  str += '`';
  return str;
};

export const fieldString = <T>(fieldName: string) => {
  let str = '`';
  str += fieldName;
  str += '`';
  return str;
};

export const fieldFullString = <T>(tableName: string, fieldName: string) => {
  let str = '`';
  str += tableName;
  str += '`.`';
  str += fieldName;
  str += '`';
  return str;
};

export const whereString = (
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
    leftStr += whereString(from, fld as AllWhereType<string>, dbType);
  } else {
    leftStr += '`';
    leftStr += fld;
    leftStr += '`';
  }

  if (typeof val === 'object') {
    rightStr = whereString(from, val as AllWhereType<string>, dbType);
  } else {
    const field = from.fields[fld as string] as IFieldLike<any>;
    rightStr = valueString(val, field.data_type, dbType);
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

export const valueString = (val, fieldType: FieldType, dbType: DbType) => {
  if (fieldType.includes('char')) return "'" + val + "'";
  else return val;
};
