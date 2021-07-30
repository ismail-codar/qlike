import knex from 'knex';
import schemaInspector from 'knex-schema-inspector';

const database = knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'your_database_user',
    password: 'your_database_password',
    database: 'myapp_test',
    charset: 'utf8',
  },
});
