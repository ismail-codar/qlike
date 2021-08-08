export type DbType = 'sqlite3' | 'pg' | 'mysql' | 'oracle' | 'sqlserver';
export type FieldType =
  | 'numeric'
  | 'varchar'
  | 'text'
  | 'timestamp'
  | 'datetime'
  | 'smallint'
  | 'int'
  | 'integer'
  | 'char'
  | 'blobsubtypetext'
  | 'decimal'
  | 'blob';

export interface ParamType {
  field: IFieldLike<any>;
  val: any;
  dbType: DbType;
}

export type ValueStringFn = (
  val,
  field: IFieldLike<any>,
  dbType: DbType
) => any;

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

export type SelectMetaType<T> = {
  from: any;
  // fields: { [key in FieldsType]: { [key in keyof T]: IFieldLike<key> }[key] };
  fields: { [key in keyof T]: IFieldLike<key> };
  distinct: boolean;
  where: AllWhereType<keyof T>;
  groupBy: (keyof T)[];
  orderBy: [fld: keyof T, type: 'asc' | 'desc'][];
  limit: [limit: number, offset: number];
};
export const SELECT = <T>(
  from: ITableLike<T>,
  ...fldList: (keyof typeof from.fields & keyof T)[]
) => {
  const fields = {} as { [key in keyof T]: typeof from.fields[key] };
  fldList.forEach((item) => {
    fields[item] = from.fields[item];
  });

  const meta: SelectMetaType<T> = {
    from,
    fields,
    distinct: undefined as boolean,
    where: undefined,
    groupBy: undefined,
    orderBy: undefined,
    limit: undefined,
  };
  const ret = {
    meta,
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
    orderBy: (...list: [fld: keyof T, type: 'asc' | 'desc'][]) => {
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

type IntoValuesType<T> =
  | { [key in keyof { [key in keyof T]: IFieldLike<key> }]?: any }
  | { [key in keyof { [key in keyof T]: IFieldLike<key> }]?: any }[]
  | SelectMetaType<T>;
export type InsertMetaType<T> = {
  into: ITable<T>;
  values: IntoValuesType<T>;
  returning: (keyof T)[];
};
export const INSERT = <T>(into: ITable<T>, values: IntoValuesType<T>) => {
  const meta: InsertMetaType<T> = {
    into,
    values,
    returning: undefined,
  };
  const ret = {
    meta,
    returning: (...list: (keyof T)[]) => {
      meta.returning = list;
      return ret;
    },
    toJSON: () => ret.meta,
    toString: () => JSON.stringify(ret.toJSON(), null, 1),
  };
  return ret;
};

export type UpdateMetaType<T> = {
  updateTable: ITable<T>;
  set: { [key in keyof { [key in keyof T]: IFieldLike<key> }]?: any };
  where: AllWhereType<keyof T>;
  returning: (keyof T)[];
};
export const UPDATE = <T>(
  updateTable: ITable<T>,
  set: { [key in keyof T]?: any }
) => {
  const meta: UpdateMetaType<T> = {
    updateTable,
    set,
    where: undefined,
    returning: undefined,
  };
  const ret = {
    meta,
    toJSON: () => ret.meta,
    toString: () => JSON.stringify(ret.toJSON(), null, 1),
    where: (where: AllWhereType<keyof T>) => {
      ret.meta.where = where;
      return ret;
    },
    returning: (...list: (keyof T)[]) => {
      ret.meta.returning = list;
      return ret;
    },
  };
  return ret;
};

export type DeleteMetaType<T> = {
  deleteTable: ITable<T>;
  where: AllWhereType<keyof T>;
  returning: (keyof T)[];
};
export const DELETE = <T>(deleteTable: ITable<T>) => {
  const meta: DeleteMetaType<T> = {
    deleteTable,
    where: undefined,
    returning: undefined,
  };
  const ret = {
    meta,
    toJSON: () => ret.meta,
    toString: () => JSON.stringify(ret.toJSON(), null, 1),
    where: (where: AllWhereType<keyof typeof deleteTable.fields>) => {
      ret.meta.where = where;
      return ret;
    },
    returning: (...list: (keyof T)[]) => {
      ret.meta.returning = list;
      return ret;
    },
  };
  return ret;
};
