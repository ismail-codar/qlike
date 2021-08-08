import {
  AllWhereType,
  BetweenWhereType,
  ConditionWhereType,
  DeleteMetaType,
  InsertMetaType,
  InWhereType,
  IsWhereType,
  ITable,
  ITableLike,
  SelectMetaType,
  tableJoin,
  UpdateMetaType,
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

export type AllQueryMetaTypes<T> =
  | SelectMetaType<T>
  | InsertMetaType<T>
  | UpdateMetaType<T>
  | DeleteMetaType<T>;

export const isSelectQuery = <T>(
  queryMeta: AllQueryMetaTypes<T> | any
): queryMeta is SelectMetaType<T> => {
  return !!queryMeta?.from;
};

export const isInsertQuery = <T>(
  queryMeta: AllQueryMetaTypes<T> | any
): queryMeta is InsertMetaType<T> => {
  return !!queryMeta?.into;
};

export const isUpdateQuery = <T>(
  queryMeta: AllQueryMetaTypes<T> | any
): queryMeta is UpdateMetaType<T> => {
  return !!queryMeta?.updateTable;
};

export const isDeleteQuery = <T>(
  queryMeta: AllQueryMetaTypes<T> | any
): queryMeta is DeleteMetaType<T> => {
  return !!queryMeta?.deleteTable;
};
