"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SELECT = exports.tableJoin = void 0;
exports.tableJoin = (joinType, leftTable, leftField, rightTable, rightField) => {
    const fields = Object.assign(Object.assign({}, leftTable.fields), rightTable.fields);
    return {
        joinType,
        left: leftTable,
        leftField,
        right: rightTable,
        rightField,
        fields,
        toJSON: () => {
            return {
                joinType,
                leftTable: leftTable.tableName,
                leftField,
                rightTable: rightTable.tableName,
                rightField,
            };
        },
    };
};
exports.SELECT = (from, ...fldList) => {
    const fields = {};
    fldList.forEach((item) => {
        fields[item] = from.fields[item];
    });
    const ret = {
        meta: {
            from,
            fields,
            distinct: undefined,
            where: undefined,
            groupBy: undefined,
            orderBy: undefined,
            limit: undefined,
        },
        toJSON: () => (Object.assign(Object.assign({}, ret.meta), {
            from: ret.meta.from,
            fields: Object.keys(ret.meta.fields),
        })),
        toString: () => JSON.stringify(ret.toJSON(), null, 1),
        distinct: () => {
            ret.meta.distinct = true;
            return ret;
        },
        where: (where) => {
            ret.meta.where = where;
            return ret;
        },
        groupBy: (...list) => {
            ret.meta.groupBy = list;
            return ret;
        },
        orderBy: (...list) => {
            ret.meta.orderBy = list;
            return ret;
        },
        limit: (limit, offset) => {
            ret.meta.limit = [limit, offset];
            return ret;
        },
    };
    return ret;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FsaWtlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9xdWVyeS9zcWxpa2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBNkRhLFFBQUEsU0FBUyxHQUFHLENBQ3ZCLFFBQTZDLEVBQzdDLFNBQW9CLEVBQ3BCLFNBQXdDLEVBQ3hDLFVBQXFCLEVBQ3JCLFVBQTBDLEVBQzFDLEVBQUU7SUFDRixNQUFNLE1BQU0sbUNBQVEsU0FBUyxDQUFDLE1BQU0sR0FBSyxVQUFVLENBQUMsTUFBTSxDQUFFLENBQUM7SUFDN0QsT0FBTztRQUNMLFFBQVE7UUFDUixJQUFJLEVBQUUsU0FBUztRQUNmLFNBQVM7UUFDVCxLQUFLLEVBQUUsVUFBVTtRQUNqQixVQUFVO1FBQ1YsTUFBTTtRQUNOLE1BQU0sRUFBRSxHQUFHLEVBQUU7WUFDWCxPQUFPO2dCQUNMLFFBQVE7Z0JBQ1IsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTO2dCQUM5QixTQUFTO2dCQUNULFVBQVUsRUFBRSxVQUFVLENBQUMsU0FBUztnQkFDaEMsVUFBVTthQUNYLENBQUM7UUFDSixDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVXLFFBQUEsTUFBTSxHQUFHLENBQ3BCLElBQW1CLEVBQ25CLEdBQUcsT0FBa0QsRUFDckQsRUFBRTtJQUNGLE1BQU0sTUFBTSxHQUFHLEVBQXNELENBQUM7SUFDdEUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxHQUFHLEdBQUc7UUFDVixJQUFJLEVBQUU7WUFDSixJQUFJO1lBQ0osTUFBTTtZQUNOLFFBQVEsRUFBRSxTQUFTO1lBQ25CLEtBQUssRUFBRSxTQUFTO1lBQ2hCLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLEtBQUssRUFBRSxTQUFTO1NBQ2pCO1FBQ0QsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLGlDQUNULEdBQUcsQ0FBQyxJQUFJLEdBQ1I7WUFDRCxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJO1lBQ25CLE1BQU0sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ3JDLEVBQ0Q7UUFDRixRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNyRCxRQUFRLEVBQUUsR0FBRyxFQUFFO1lBQ2IsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ3pCLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUNELEtBQUssRUFBRSxDQUFDLEtBQStCLEVBQUUsRUFBRTtZQUN6QyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDdkIsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDO1FBQ0QsT0FBTyxFQUFFLENBQUMsR0FBRyxJQUFrQixFQUFFLEVBQUU7WUFDakMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUNELE9BQU8sRUFBRSxDQUFDLEdBQUcsSUFBK0MsRUFBRSxFQUFFO1lBQzlELEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUN4QixPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUM7UUFDRCxLQUFLLEVBQUUsQ0FBQyxLQUFhLEVBQUUsTUFBYyxFQUFFLEVBQUU7WUFDdkMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDakMsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDO0tBQ0YsQ0FBQztJQUNGLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyxDQUFDIn0=