import knex from 'knex';
import schemaInspector from 'knex-schema-inspector';

const database = knex({
  client: 'sqlite3',
  connection: {
    filename: 'doc/salila-sql/sqlite-sakila-db/sakila.db',
  },
  useNullAsDefault: true,
});

const inspector = schemaInspector(database);
inspector.tables().then((tables) => {
  console.log(tables);
  tables.forEach((tableName) => {
    inspector.columnInfo(tableName).then((columns) => {
      console.log(columns);
    });
  });
});
