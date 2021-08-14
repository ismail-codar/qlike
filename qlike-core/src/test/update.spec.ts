import test from 'ava';

import { UPDATE } from '../lib/sqlike';

import { expectAsQueryString, usersTable } from './helpers/test-utils';

test('update simple 1', (t) => {
  const qlikeQuery = UPDATE(usersTable, {
    first_name: 'ismail',
    last_name: 'codar',
  });
  expectAsQueryString(
    t,
    qlikeQuery,
    "update `users` set `first_name` = 'ismail', `last_name` = 'codar'"
  );
});

test('update returning 1', (t) => {
  const qlikeQuery = UPDATE(usersTable, {
    first_name: 'ismail',
    last_name: 'codar',
  }).returning('first_name');
  expectAsQueryString(
    t,
    qlikeQuery,
    "update `users` set `first_name` = 'ismail', `last_name` = 'codar' returning `first_name`"
  );
});
