export type DbType = 'sqlite3' | 'pg' | 'mysql' | 'oracle' | 'sqlserver';
export type FieldType = 'string' | 'number' | 'date' | 'time' | 'boolean';

export interface IFieldLike<N, T extends FieldType> {
  fieldName: N;
  type: T;
}

export interface ITableLike<T> {
  fields: { [key in keyof T]: IFieldLike<key, any> };
}

export interface ITable<T> extends ITableLike<T> {
  tableName: string;
}

type ValType = boolean | number | Date | string | IFieldLike<any, any>;

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
        leftTable: leftTable.tableName,
        leftField,
        rightTable: rightTable.tableName,
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
      distinct: undefined,
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
