import test from 'ava';

import { DELETE } from '../lib/sqlike';

import { expectAsQueryString, k, usersTable } from './helpers/test-utils';

test('delete simple 1', (t) => {
  const qlikeQuery = DELETE(usersTable).where(['id', '=', 1]);
  expectAsQueryString(t, qlikeQuery, 'delete from `users` where `id` = 1');
});
