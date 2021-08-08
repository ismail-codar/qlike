import test from 'ava';

import { DELETE, ParamType } from '../lib/sqlike';
import { paramValueString } from '../utils/query-utils';

import { expectAsQueryString, usersTable } from './helpers/test-utils';

test('delete simple 1', (t) => {
  const qlikeQuery = DELETE(usersTable).where(['id', '=', 1]);
  expectAsQueryString(t, qlikeQuery.meta, 'delete from `users` where `id` = 1');
});

test('delete simple params 1', (t) => {
  const qlikeQuery = DELETE(usersTable).where(['id', '=', 1]);
  const params: ParamType[] = [];
  expectAsQueryString(
    t,
    qlikeQuery.meta,
    'delete from `users` where `id` = ?',
    paramValueString(params)
  );
  t.is(params[0].val, 1);
  t.is(params[0].field.name, 'id');
});
