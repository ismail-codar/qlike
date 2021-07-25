import {
  AllWhereType,
  BetweenWhereType,
  ConditionWhereType,
  INSERT,
  InWhereType,
  IsWhereType,
  ITable,
  ITableLike,
  SELECT,
  tableJoin,
} from '../sqlike';

export const isTable = <T>(tbl: ITableLike<T>): tbl is ITable<T> => {
  return !!tbl['tableName'];
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

export const isSelectQuery = <T>(
  query: ReturnType<typeof SELECT> | ReturnType<typeof INSERT> | {} | []
): query is ReturnType<typeof SELECT> => {
  return !!query?.['meta']?.from;
};

export const isInsertQuery = <T>(
  query: ReturnType<typeof SELECT> | ReturnType<typeof INSERT> | {} | []
): query is ReturnType<typeof INSERT> => {
  return !!query?.['meta']?.into;
};
