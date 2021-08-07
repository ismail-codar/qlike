import { DbType, FieldType, IFieldLike, ParamType, ValueStringFn } from '..';
import {
  AllQueryTypes,
  isInsertQuery,
  isSelectQuery,
  isUpdateQuery,
} from '../lib/builders/builder-check';
import {
  deleteQueryToString,
  insertQueryToString,
  selectQueryToString,
  updateQueryToString,
} from '../lib/builders/generic-sql-builder';

export const isNumericDataType = (dataType: FieldType) =>
  dataType.includes('num') ||
  dataType.includes('int') ||
  dataType === 'decimal';

export const isDateDataType = (dataType: FieldType) =>
  dataType === 'timestamp' || dataType === 'datetime';

export const isStringDataType = (dataType: FieldType) =>
  dataType.includes('char') || dataType.includes('text');

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

export const queryToString = (
  qlikeQuery: AllQueryTypes,
  dbType: DbType = 'sqlite3',
  valueString: ValueStringFn = primitiveValueString
) => {
  const qlikeQueryStr = isSelectQuery(qlikeQuery)
    ? selectQueryToString(qlikeQuery, dbType, valueString)
    : isInsertQuery(qlikeQuery)
    ? insertQueryToString(qlikeQuery, dbType, valueString)
    : isUpdateQuery(qlikeQuery)
    ? updateQueryToString(qlikeQuery, dbType, valueString)
    : deleteQueryToString(qlikeQuery, dbType, valueString);
  return qlikeQueryStr;
};

export const paramsBindValues = (
  params: ParamType[],
  dbType: DbType = 'sqlite3'
) => {
  if (dbType === 'sqlite3') {
    return params.map((p) => {
      if (isNumericDataType(p.field.data_type)) {
        return Number(p.val);
      } else {
        return p.val.toString();
      }
    });
  } else {
    return params.map((p) => p.val.toString());
  }
};
