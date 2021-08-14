import {
  AllWhereType,
  BetweenWhereType,
  ConditionWhereType,
  DeleteMetaType,
  DeleteReturnType,
  InsertMetaType,
  InsertReturnType,
  InWhereType,
  IsWhereType,
  ITable,
  ITableLike,
  SelectMetaType,
  SelectReturnType,
  tableJoin,
  UpdateMetaType,
  UpdateReturnType,
} from '../sqlike';

export const isTable = <T>(
  tbl: ITableLike<T> | ITable<T>
): tbl is ITable<T> => {
  return !!tbl['name'] && !!tbl['fields'];
};

export const isJoin = (
  tbl: ITableLike<any> | ITable<any>
): tbl is ReturnType<typeof tableJoin> => {
  // const aa: ReturnType<typeof tableJoin>;
  return !!tbl['joinType'];
};

export const isInWhereType = <T>(
  where: AllWhereType<T>
): where is InWhereType<T> => {
  return where[1] === 'in';
};

export const isIsWhereType = <T>(
  where: AllWhereType<T>
): where is IsWhereType<T> => {
  return where[1] === 'is';
};

export const isBetweenWhereType = <T>(
  where: AllWhereType<T>
): where is BetweenWhereType<T> => {
  return where[1] === 'between';
};

export const isConditionWhereType = <T>(
  where: AllWhereType<T>
): where is ConditionWhereType<T> => {
  return where[1] === 'and' || where[1] === 'or';
};

export type AllQueryTypes<T> =
  | SelectReturnType<T>
  | InsertReturnType<T>
  | UpdateReturnType<T>
  | DeleteReturnType<T>;

export type AllQueryMetaTypes<T> =
  | SelectMetaType<T>
  | InsertMetaType<T>
  | UpdateMetaType<T>
  | DeleteMetaType<T>;

export const isSelectQuery = <T>(
  query: AllQueryTypes<T> | any
): query is SelectReturnType<T> => {
  return !!query.meta?.from;
};

export const isInsertQuery = <T>(
  query: AllQueryTypes<T> | any
): query is InsertReturnType<T> => {
  return !!query.meta?.into;
};

export const isUpdateQuery = <T>(
  query: AllQueryTypes<T> | any
): query is UpdateReturnType<T> => {
  return !!query.meta?.updateTable;
};

export const isDeleteQuery = <T>(
  query: AllQueryTypes<T> | any
): query is DeleteReturnType<T> => {
  return !!query.meta?.deleteTable;
};
