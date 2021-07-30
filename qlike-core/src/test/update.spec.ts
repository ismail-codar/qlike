import test from 'ava';

import { UPDATE } from '../lib/sqlike';
import { expectAsQueryString, k, usersTable } from '../utils/test-utils';

test('update simple 1', (t) => {
  const qlikeQuery = UPDATE(usersTable);
  expectAsQueryString(
    t,
    qlikeQuery,
    "update `users` set `first_name` = 'ismail', `last_name` = 'codar'"
  );
});
