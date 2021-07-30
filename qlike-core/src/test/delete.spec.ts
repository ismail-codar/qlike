import test from 'ava';

import { DELETE } from '../lib/sqlike';
import { expectAsQueryString, k, usersTable } from '../utils/test-utils';

test('update simple 1', (t) => {
  const qlikeQuery = DELETE(usersTable).where(['id', '=', 1]);
  expectAsQueryString(t, qlikeQuery, 'delete from `users` wheeree id = 1');
});
