export type DbType = 'sqlite3' | 'pg' | 'mysql' | 'oracle' | 'sqlserver';
export type FieldType =
  | 'numeric'
  | 'varchar'
  | 'timestamp'
  | 'smallint'
  | 'int'
  | 'char'
  | 'blobsubtypetext'
  | 'decimal'
  | 'blob';

export interface IFieldLike<N> {
  name: N;
  data_type: FieldType;
  table?: string;
  default_value?: any | null;
  max_length?: number | null;
  numeric_precision?: number | null;
  numeric_scale?: number | null;
  is_nullable?: boolean;
  is_unique?: boolean;
  is_primary_key?: boolean;
  is_generated?: boolean;
  has_auto_increment?: boolean;
  foreign_key_table?: string | null;
  foreign_key_column?: string | null;
  comment?: string | null;
  schema?: string;
  foreign_key_schema?: string | null;
}

export interface ITableLike<T> {
  fields: { [key in keyof T]: IFieldLike<key> };
}

export interface ITable<T> extends ITableLike<T> {
  name: string;
}

type ValType = boolean | number | Date | string | IFieldLike<any>;

export type ConditionWhereType<T> = [
  fld: AllWhereType<T>,
  op: 'and' | 'or',
  val: AllWhereType<T>,
  not?: 'NOT'
];

export type AttributeWhereType<T> = [
  fld: T,
  op:
    | '<>'
    | '<='
    | '>='
    | '='
    | '<'
    | '>'
    | 'startsWith'
    | 'endsWith'
    | 'contains',
  val: ValType,
  not?: 'NOT'
];

export type InWhereType<T> = [
  fld: T,
  op: 'in',
  // TODO val: ReturnType<typeof SELECT> | ValType[]
  val: ValType[],
  not?: 'NOT'
];

export type IsWhereType<T> = [fld: T, op: 'is', val: 'null', not?: 'NOT'];

export type BetweenWhereType<T> = [
  fld: T,
  op: 'between',
  val: [v1: ValType, v2: ValType],
  not?: 'NOT'
];

export type AllWhereType<T> =
  | AttributeWhereType<T>
  | InWhereType<T>
  | IsWhereType<T>
  | BetweenWhereType<T>
  | ConditionWhereType<T>;

export const tableJoin = <L, R>(
  joinType: 'inner' | 'left' | 'right' | 'full',
  leftTable: ITable<L>,
  leftField: keyof typeof leftTable.fields,
  rightTable: ITable<R>,
  rightField: keyof typeof rightTable.fields
) => {
  const fields = { ...leftTable.fields, ...rightTable.fields };
  return {
    joinType,
    left: leftTable,
    leftField,
    right: rightTable,
    rightField,
    fields,
    toJSON: () => {
      return {
        joinType,
        leftTable: leftTable.name,
        leftField,
        rightTable: rightTable.name,
        rightField,
      };
    },
  };
};

export const SELECT = <T, FieldsType extends keyof T>(
  from: ITableLike<T>,
  ...fldList: (keyof typeof from.fields & FieldsType)[]
) => {
  const fields = {} as { [key in FieldsType]: typeof from.fields[key] };
  fldList.forEach((item) => {
    fields[item] = from.fields[item];
  });

  const ret = {
    meta: {
      from,
      fields,
      distinct: undefined as boolean,
      where: undefined,
      groupBy: undefined,
      orderBy: undefined,
      limit: undefined,
    },
    toJSON: () => ({
      ...ret.meta,
      ...{
        from: ret.meta.from,
        fields: Object.keys(ret.meta.fields),
      },
    }),
    toString: () => JSON.stringify(ret.toJSON(), null, 1),
    distinct: () => {
      ret.meta.distinct = true;
      return ret;
    },
    where: (where: AllWhereType<keyof typeof from.fields>) => {
      ret.meta.where = where;
      return ret;
    },
    groupBy: (...list: (keyof typeof from.fields)[]) => {
      ret.meta.groupBy = list;
      return ret;
    },
    orderBy: (...list: [fld: FieldsType, type: 'asc' | 'desc'][]) => {
      ret.meta.orderBy = list;
      return ret;
    },
    limit: (limit: number, offset: number) => {
      ret.meta.limit = [limit, offset];
      return ret;
    },
  };
  return ret;
};

// https://dev.mysql.com/doc/refman/8.0/en/insert.html
// https://www.sqlite.org/lang_insert.html
//  https://www.techonthenet.com/sqlite/insert.php
export const INSERT = <T, FieldsType extends keyof T>(
  into: ITable<T>,
  values:
    | { [key in keyof typeof into.fields]?: any }
    | { [key in keyof typeof into.fields]?: any }[]
    | ReturnType<typeof SELECT>
) => {
  const ret = {
    meta: {
      into,
      values,
    },
    toJSON: () => ret.meta,
    toString: () => JSON.stringify(ret.toJSON(), null, 1),
  };
  return ret;
};

export const UPDATE = <T, FieldsType extends keyof T>(
  updateTable: ITable<T>,
  set: { [key in keyof typeof updateTable.fields]?: any }
) => {
  const ret = {
    meta: {
      updateTable,
      set,
      where: undefined,
    },
    toJSON: () => ret.meta,
    toString: () => JSON.stringify(ret.toJSON(), null, 1),
    where: (where: AllWhereType<keyof typeof updateTable.fields>) => {
      ret.meta.where = where;
      return ret;
    },
  };
  return ret;
};

export const DELETE = <T, FieldsType extends keyof T>(
  deleteTable: ITable<T>
) => {
  const ret = {
    meta: {
      deleteTable,
      where: undefined,
    },
    toJSON: () => ret.meta,
    toString: () => JSON.stringify(ret.toJSON(), null, 1),
    where: (where: AllWhereType<keyof typeof deleteTable.fields>) => {
      ret.meta.where = where;
      return ret;
    },
  };
  return ret;
};
