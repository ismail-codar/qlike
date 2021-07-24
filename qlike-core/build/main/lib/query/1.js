"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlike_1 = require("./sqlike");
const studentTable = {
    tableName: 'student',
    fields: {
        id: { fieldName: 'id', type: 'number' },
        name: { fieldName: 'name', type: 'string' },
        surName: { fieldName: 'surName', type: 'string' },
    },
};
const schoolTable = {
    tableName: 'school',
    fields: {
        id: { fieldName: 'id', type: 'number' },
        schoolName: { fieldName: 'schoolName', type: 'string' },
    },
};
const userTable = {
    tableName: 'users',
    fields: {
        id: { fieldName: 'id', type: 'number' },
        name: { fieldName: 'name', type: 'string' },
        email: { fieldName: 'email', type: 'string' },
    },
};
const studentJoinSchool = sqlike_1.tableJoin('INNER', schoolTable, 'schoolName', studentTable, 'surName');
const s1 = sqlike_1.SELECT(studentJoinSchool, 'name', 'schoolName').where([
    ['name', 'contains', 'ismail'],
    'AND',
    ['schoolName', 'contains', 'marmara'],
]);
const s2 = sqlike_1.SELECT(studentJoinSchool, 'name', 'schoolName', 'surName')
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvcXVlcnkvMS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFpRTtBQW1CakUsTUFBTSxZQUFZLEdBQW9CO0lBQ3BDLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLE1BQU0sRUFBRTtRQUNOLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtRQUN2QyxJQUFJLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7UUFDM0MsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO0tBQ2xEO0NBQ0YsQ0FBQztBQUVGLE1BQU0sV0FBVyxHQUFtQjtJQUNsQyxTQUFTLEVBQUUsUUFBUTtJQUNuQixNQUFNLEVBQUU7UUFDTixFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7UUFDdkMsVUFBVSxFQUFFLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO0tBQ3hEO0NBQ0YsQ0FBQztBQUVGLE1BQU0sU0FBUyxHQUFpQjtJQUM5QixTQUFTLEVBQUUsT0FBTztJQUNsQixNQUFNLEVBQUU7UUFDTixFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7UUFDdkMsSUFBSSxFQUFFLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO1FBQzNDLEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtLQUM5QztDQUNGLENBQUM7QUFFRixNQUFNLGlCQUFpQixHQUFHLGtCQUFTLENBQ2pDLE9BQU8sRUFDUCxXQUFXLEVBQ1gsWUFBWSxFQUNaLFlBQVksRUFDWixTQUFTLENBQ1YsQ0FBQztBQUVGLE1BQU0sRUFBRSxHQUFHLGVBQU0sQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQy9ELENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUM7SUFDOUIsS0FBSztJQUNMLENBQUMsWUFBWSxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUM7Q0FDdEMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxFQUFFLEdBQUcsZUFBTSxDQUFDLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxDQUFDO0tBQ2xFLFFBQVEsRUFBRTtLQUNWLEtBQUssQ0FBQztJQUNMLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN4QyxLQUFLO0lBQ0wsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7Q0FDekQsQ0FBQztLQUNELE9BQU8sQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDO0lBQzlCLFlBQVk7S0FDWCxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDekIsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUVmLHdDQUF3QztBQUV4QyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDIn0=