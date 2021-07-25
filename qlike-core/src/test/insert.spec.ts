import test, { ExecutionContext } from 'ava';

import { INSERT } from '../lib/sqlike';
import { expectAsQueryString, k, usersTable } from '../utils/test-utils';

test('insert simple 1', (t) => {
  const qlikeQuery = INSERT(usersTable, {
    first_name: 'ismail',
    last_name: 'codar',
  });
  expectAsQueryString(
    t,
    qlikeQuery,
    "select `id` from `users` where (`first_name` = 'Test') and (`last_name` = 'User')"
  );
});
