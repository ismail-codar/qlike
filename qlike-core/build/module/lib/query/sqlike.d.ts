export interface IFieldLike<N, T extends 'string' | 'number' | 'date' | 'time' | 'boolean'> {
    fieldName: N;
    type: T;
}
export interface ITableLike<T> {
    fields: {
        [key in keyof T]: IFieldLike<key, any>;
    };
}
export interface ITable<T> extends ITableLike<T> {
    tableName: string;
}
declare type ValType = boolean | number | Date | string | IFieldLike<any, any>;
declare type ConditionWhereType<T> = [
    left: AllWhereType<T>,
    op: 'AND' | 'OR',
    right: AllWhereType<T>
];
declare type AttributeWhereType<T> = [
    fld: T,
    op: '<>' | '<=' | '>=' | '=' | '<' | '>' | 'startsWith' | 'endsWith' | 'contains',
    val: ValType
];
declare type InWhereType<T> = [
    fld: T,
    op: 'in' | 'not_in',
    val: ValType[]
];
declare type IsWhereType<T> = [fld: T, op: 'is' | 'not_is', val: 'NULL'];
declare type BetweenWhereType<T> = [
    fld: T,
    op: 'between',
    val: [v1: ValType, v2: ValType]
];
declare type AllWhereType<T> = AttributeWhereType<T> | InWhereType<T> | IsWhereType<T> | BetweenWhereType<T> | ConditionWhereType<T>;
export declare const tableJoin: <L, R>(joinType: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL', leftTable: ITable<L>, leftField: keyof L, rightTable: ITable<R>, rightField: keyof R) => {
    joinType: "INNER" | "LEFT" | "RIGHT" | "FULL";
    left: ITable<L>;
    leftField: keyof L;
    right: ITable<R>;
    rightField: keyof R;
    fields: { [key in keyof L]: IFieldLike<key, any>; } & { [key_1 in keyof R]: IFieldLike<key_1, any>; };
    toJSON: () => {
        joinType: "INNER" | "LEFT" | "RIGHT" | "FULL";
        leftTable: string;
        leftField: keyof L;
        rightTable: string;
        rightField: keyof R;
    };
};
export declare const SELECT: <T, FieldsType extends keyof T>(from: ITableLike<T>, ...fldList: (keyof T & FieldsType)[]) => {
    meta: {
        from: ITableLike<T>;
        fields: { [key in FieldsType]: { [key_1 in keyof T]: IFieldLike<key_1, any>; }[key]; };
        distinct: any;
        where: any;
        groupBy: any;
        orderBy: any;
        limit: any;
    };
    toJSON: () => {
        from: ITableLike<T>;
        fields: string[];
        distinct: any;
        where: any;
        groupBy: any;
        orderBy: any;
        limit: any;
    };
    toString: () => string;
    distinct: () => any;
    where: (where: AllWhereType<FieldsType>) => any;
    groupBy: (...list: FieldsType[]) => any;
    orderBy: (...list: [fld: FieldsType, type: "asc" | "desc"][]) => any;
    limit: (limit: number, offset: number) => any;
};
export {};
