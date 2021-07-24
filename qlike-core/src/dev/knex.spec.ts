import test from 'ava';
// const { knex } = require('knex');
import { Knex, knex } from 'knex';

const config: Knex.Config = {
  debug: true,
  client: 'sqlite3',
  useNullAsDefault: true,
};

test('users accounts join 1', (t) => {
  const q = knex(config)
    .select('*')
    .from('users')
    .rightJoin('accounts', 'users.id', 'accounts.user_id');
  const str = q.toQuery();
  t.is(
    str,
    'select * from `users` right join `accounts` on `users`.`id` = `accounts`.`user_id`'
  );
});
