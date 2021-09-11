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

test('where like keyword 1', (t) => {
  const qlikeQuery = SELECT(usersTable, 'id').where([
    'first_name',
    'like',
    '%ismail%',
  ]);

  const params: ParamType[] = [];
  expectAsQueryString(
    t,
    qlikeQuery,
    'select `id` from `users` where `first_name` like ?',
    paramValueString(params)
  );
  t.is(params[0].val, '%ismail%');
});
