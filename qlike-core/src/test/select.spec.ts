import test from 'ava';

import { SELECT, tableJoin } from '../lib/sqlike';

import {
  accountsTable,
  expectAsKnexQuery,
  expectAsQueryString,
  k,
  usersTable,
} from './helpers/test-utils';

test('users accounts join 1', (t) => {
  const qlikeQuery = SELECT(
    tableJoin('right', usersTable, 'id', accountsTable, 'user_id'),
    'id',
    'user_id'
  );

  // k.max('user_id').as('maxUser')
  const knexQuery = k
    .select('id', 'user_id')
    .from('users')
    .rightJoin('accounts', 'users.id', 'accounts.user_id');

  expectAsKnexQuery(t, qlikeQuery.meta, knexQuery);
});

test('where 1', (t) => {
  const qlikeQuery = SELECT(usersTable, 'id')
    .where([['first_name', '=', 'Test'], 'and', ['last_name', '=', 'User']])
    .orderBy({
      first_name: 'desc',
      last_name: 'asc',
    });

  const queryMeta = qlikeQuery.meta;
  expectAsQueryString(
    t,
    queryMeta,
    "select `id` from `users` where (`first_name` = 'Test') and (`last_name` = 'User') order by first_name desc, last_name asc"
  );
});
