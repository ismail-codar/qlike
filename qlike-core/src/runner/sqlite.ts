import sqlite3 from 'sqlite3';
import { Pool } from './pool';

const db = new sqlite3.Database(':memory:');

db.serialize(function () {
  db.run('CREATE TABLE lorem (info TEXT)');

  const stmt = db.prepare('INSERT INTO lorem VALUES (?)');
  for (let i = 0; i < 10; i++) {
    stmt.run('Ipsum ' + i);
  }
  stmt.finalize();

  db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
    console.log(row.id + ': ' + row.info);
  });
});

db.close();

// TODO https://github.com/mysqljs/mysql/blob/master/lib/Pool.js https://github.com/hyurl/better-sqlite-pool/blob/master/index.js

const pool = new Pool(null);

function getQuery(query) {
  var promise = new Promise(function (resolve, reject) {
    pool.acquire().then((connection) => {
      console.log('Connected as id ' + connection.threadId);
      connection.query(query, (error, results) => {
        connection.release();
        if (error) {
          reject('Error in database operation');
        } else {
          resolve(results);
        }
      });
    });
  });
  return promise;
}
