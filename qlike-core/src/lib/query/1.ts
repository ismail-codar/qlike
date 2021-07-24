import { ITable, ITableLike, SELECT, tableJoin } from './sqlike';

interface Student {
  id: string;
  name: string;
  surName: string;
}

interface School {
  id: number;
  schoolName: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const studentTable: ITable<Student> = {
  tableName: 'student',
  fields: {
    id: { fieldName: 'id', type: 'number' },
    name: { fieldName: 'name', type: 'string' },
    surName: { fieldName: 'surName', type: 'string' },
  },
};

const schoolTable: ITable<School> = {
  tableName: 'school',
  fields: {
    id: { fieldName: 'id', type: 'number' },
    schoolName: { fieldName: 'schoolName', type: 'string' },
  },
};

const userTable: ITable<User> = {
  tableName: 'users',
  fields: {
    id: { fieldName: 'id', type: 'number' },
    name: { fieldName: 'name', type: 'string' },
    email: { fieldName: 'email', type: 'string' },
  },
};

const studentJoinSchool = tableJoin(
  'INNER',
  schoolTable,
  'schoolName',
  studentTable,
  'surName'
);

const s1 = SELECT(studentJoinSchool, 'name', 'schoolName').where([
  ['name', 'contains', 'ismail'],
  'AND',
  ['schoolName', 'contains', 'marmara'],
]);

const s2 = SELECT(studentJoinSchool, 'name', 'schoolName', 'surName')
  .distinct()
  .where([
    ['name', 'between', ['ismail', 'codar']],
    'AND',
    ['schoolName', '=', studentJoinSchool.fields.schoolName],
  ])
  .groupBy('name', 'schoolName')
  // .having()
  .orderBy(['name', 'desc'])
  .limit(1, 3);

// const s3 = SELECT(studentJoinSchool);

console.log(JSON.stringify(s2, null, 1));
