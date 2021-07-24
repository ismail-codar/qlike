import test, { ExecutionContext } from 'ava';
// const { knex } = require('knex');
import { Knex, knex } from 'knex';

import { SELECT, tableJoin } from '../lib/sqlike';

import { accountsTable, expectAsKnexQuery, k, usersTable } from './test-utils';

test('users accounts join 1', (t) => {
  const qlikeQuery = SELECT(
    tableJoin('RIGHT', usersTable, 'id', accountsTable, 'user_id'),
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
