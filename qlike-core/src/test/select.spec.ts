import test from 'ava';

import { ParamType, SELECT, tableJoin } from '../lib/sqlike';
import { paramValueString } from '../utils/query-utils';

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

  expectAsKnexQuery(t, qlikeQuery, knexQuery);
});

test('where 1', (t) => {
  const qlikeQuery = SELECT(usersTable, 'id')
    .where([['first_name', '=', 'Test'], 'and', ['last_name', '=', 'User']])
    .orderBy({
      first_name: 'desc',
      last_name: 'asc',
    });

  expectAsQueryString(
    t,
    qlikeQuery,
    "select `id` from `users` where (`first_name` = 'Test') and (`last_name` = 'User') order by `first_name` desc, `last_name` asc"
  );
});

test('where IN keyword 1', (t) => {
  const qlikeQuery = SELECT(usersTable, 'id').where([
    'id',
    'in',
    SELECT(usersTable, 'id').where(['id', 'in', [1, 2]]),
  ]);

  expectAsQueryString(
    t,
    qlikeQuery,
    'select `id` from `users` where `id` in (select `id` from `users` where `id` in (1, 2))'
  );

  const params: ParamType[] = [];
  expectAsQueryString(
    t,
    qlikeQuery,
    'select `id` from `users` where `id` in (select `id` from `users` where `id` in (?, ?))',
    paramValueString(params)
  );
  t.is(params[0].val, 1);
  t.is(params[1].val, 2);
});
