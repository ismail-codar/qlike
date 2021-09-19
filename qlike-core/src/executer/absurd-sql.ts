import initSqlJs from '@jlongster/sql.js';
import { SQLiteFS } from 'absurd-sql';
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend';
import { DbConfig } from '../exec';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export interface AbsurdSqlConnectionOptions {
  fileName?: string;
  backend?: any;
  page_size?: number;
}

export const initAbsurdSql: (options?: AbsurdSqlConnectionOptions) => any =
  async ({ fileName = 'db', backend = undefined, page_size = 8192 } = {}) => {
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
  values?: any[]
) => {
  isDev && console.log(queryStr, values);
  const db = config.connection.db;
  const isSelect = queryStr.startsWith('select');
  const isTransactional =
    queryStr.startsWith('insert') ||
    queryStr.startsWith('update') ||
    queryStr.startsWith('delete');
  // TODO transactions
  let result = null;
  if (values && values.length) {
    isTransactional && db.exec('BEGIN TRANSACTION');
    let stmt = db.prepare(queryStr);
    try {
      if (isSelect) {
        result = [stmt.getAsObject(values)];
        if (Object.values(result[0]).filter((item) => item).length === 0) {
          result = [];
        }
        while (stmt.step()) {
          result.push(stmt.getAsObject());
        }
      } else {
        stmt.run(values);
        stmt.step();
        result = stmt.getAsObject();
      }
    } catch (error) {
      console.error('executeAbsurdSql error->', error);
      debugger;
    }
    stmt.free();
    isTransactional && db.exec('COMMIT');
    return result;
  } else {
    let execResult = db.exec(queryStr);
    if (Array.isArray(execResult)) {
      execResult = execResult.map((res) => {
        const columns = res.columns;
        return res.values.map((value) => {
          const obj = {};
          for (var i = 0; i < value.length; i++) {
            obj[columns[i]] = value[i];
          }
          return obj;
        });
      });
    }
    result = [];
    for (var i = 0; i < execResult.length; i++) {
      result.push.apply(result, execResult[i]);
    }
    return result;
  }
};
