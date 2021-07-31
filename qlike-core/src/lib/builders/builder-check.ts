import {
  AllWhereType,
  BetweenWhereType,
  ConditionWhereType,
  DELETE,
  INSERT,
  InWhereType,
  IsWhereType,
  ITable,
  ITableLike,
  SELECT,
  tableJoin,
  UPDATE,
} from '../sqlike';

export const isTable = <T>(tbl: ITableLike<T>): tbl is ITable<T> => {
  return !!tbl['name'] && !!tbl['fields'];
};

export const isJoin = (
  tbl: ITableLike<any>
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

export type AllQueryTypes =
  | ReturnType<typeof SELECT>
  | ReturnType<typeof INSERT>
  | ReturnType<typeof UPDATE>
  | ReturnType<typeof DELETE>;

export const isSelectQuery = <T>(
  query: AllQueryTypes | any
): query is ReturnType<typeof SELECT> => {
  return !!query?.['meta']?.from;
};

export const isInsertQuery = <T>(
  query: AllQueryTypes | any
): query is ReturnType<typeof INSERT> => {
  return !!query?.['meta']?.into;
};

export const isUpdateQuery = <T>(
  query: AllQueryTypes | any
): query is ReturnType<typeof UPDATE> => {
  return !!query?.['meta']?.updateTable;
};

export const isDeleteQuery = <T>(
  query: AllQueryTypes | any
): query is ReturnType<typeof DELETE> => {
  return !!query?.['meta']?.deleteTable;
};
