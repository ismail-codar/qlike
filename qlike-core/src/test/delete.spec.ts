import test from 'ava';

import { paramValueString } from '../lib/builders/sql-builder-utils';
import { DELETE, ParamType } from '../lib/sqlike';

import { expectAsQueryString, usersTable } from './helpers/test-utils';

test('delete simple 1', (t) => {
  const qlikeQuery = DELETE(usersTable).where(['id', '=', 1]);
  expectAsQueryString(t, qlikeQuery, 'delete from `users` where `id` = 1');
});

test('delete simple params 1', (t) => {
  const qlikeQuery = DELETE(usersTable).where(['id', '=', 1]);
  const params: ParamType[] = [];
  expectAsQueryString(
    t,
    qlikeQuery,
    'delete from `users` where `id` = ?',
    paramValueString(params)
  );
  t.is(params[0].val, 1);
  t.is(params[0].field.name, 'id');
});
