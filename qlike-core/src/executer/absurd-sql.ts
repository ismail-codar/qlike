import initSqlJs from '@jlongster/sql.js';
import { SQLiteFS } from 'absurd-sql';
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend';
import { DbConfig } from '../exec';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const initAbsurdSql: (options?: {
  fileName?: string;
  backend?: any;
  page_size?: number;
}) => any = async ({
  fileName = 'db',
  backend = undefined,
  page_size = 8192,
} = {}) => {
  let SQL = await initSqlJs({ locateFile: (file) => file });
  let sqlFS = new SQLiteFS(SQL.FS, backend || new IndexedDBBackend());
  SQL.register_for_idb(sqlFS);
  SQL.FS.mkdir('/sql');
  SQL.FS.mount(sqlFS, {}, '/sql');
  let db = new SQL.Database('/sql/' + fileName + '.sqlite', {
    filename: true,
  });
  db.exec(`
    PRAGMA page_size=${page_size};
    PRAGMA journal_mode=MEMORY;
  `);
  return db;
};

export const executeAbsurdSql = async (
  config: Omit<DbConfig, 'execute'>,
  queryStr: string,
  values: any[]
) => {
  isDev && console.log(queryStr, values);
  // TODO transactions
  let result = null;
  if (values && values.length) {
    let stmt = config.connection.db.prepare(queryStr);
    stmt.run(values);
    if (queryStr.startsWith('select')) {
      stmt.step();
    }
    result = stmt.getAsObject();
    stmt.free();
  } else {
    result = config.connection.db.exec(queryStr);
  }

  return result.map((res) => {
    const columns = res.columns;
    return res.values.map((value) => {
      const obj = {};
      for (var i = 0; i < value.length; i++) {
        obj[columns[i]] = value[i];
      }
      return obj;
    });
  });
};
