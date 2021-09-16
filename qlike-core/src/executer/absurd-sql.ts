const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const executeAbsurdSql = (
  config: any,
  queryStr: string,
  values: any[]
) => {
  isDev && console.log(queryStr, values);
  //   TODO const result = executeAbsurdSql(config).raw(queryStr, values);
  //   return result;
};
