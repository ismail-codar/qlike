import {
  AllWhereType,
  DbType,
  IFieldLike,
  ITableLike,
  ParamType,
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

export const whereString = (
  from: ITableLike<unknown>,
  where: AllWhereType<string>,
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
      fld as AllWhereType<string>,
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
      val as AllWhereType<string>,
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

export const primitiveValueString = (
  val,
  field: IFieldLike<any>,
  dbType: DbType
) => {
  if (val instanceof Date) {
    val = val.toISOString();
  } else if (typeof val === 'string') {
    val = val.replace(/'/g, "''");
  }
  if (
    (dbType && field.data_type.includes('char')) ||
    field.data_type.includes('text') ||
    field.data_type.includes('date') ||
    field.data_type.includes('time')
  )
    return "'" + val + "'";
  else return val;
};

export const paramValueString = (params: ParamType[]) => {
  const valueString: ValueStringFn = (
    val,
    field: IFieldLike<any>,
    dbType: DbType
  ) => {
    params.push({
      field,
      val,
      dbType,
    });
    return '?';
  };
  return valueString;
};
