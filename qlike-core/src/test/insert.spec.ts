import test from 'ava';

import { INSERT } from '../lib/sqlike';

import { expectAsQueryString, usersTable } from './helpers/test-utils';

test('insert simple 1', (t) => {
  const qlikeQuery = INSERT(usersTable, [
    {
      first_name: 'ismail',
      last_name: 'codar',
    },
  ]);
  expectAsQueryString(
    t,
    qlikeQuery.meta,
    "insert into `users` (`first_name`, `last_name`) values ('ismail', 'codar')"
  );
});
