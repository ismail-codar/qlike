export const tableJoin = (joinType, leftTable, leftField, rightTable, rightField) => {
    const fields = { ...leftTable.fields, ...rightTable.fields };
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
export const SELECT = (from, ...fldList) => {
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
        toJSON: () => ({
            ...ret.meta,
            ...{
                from: ret.meta.from,
                fields: Object.keys(ret.meta.fields),
            },
        }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FsaWtlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9xdWVyeS9zcWxpa2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBNkRBLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxDQUN2QixRQUE2QyxFQUM3QyxTQUFvQixFQUNwQixTQUF3QyxFQUN4QyxVQUFxQixFQUNyQixVQUEwQyxFQUMxQyxFQUFFO0lBQ0YsTUFBTSxNQUFNLEdBQUcsRUFBRSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDN0QsT0FBTztRQUNMLFFBQVE7UUFDUixJQUFJLEVBQUUsU0FBUztRQUNmLFNBQVM7UUFDVCxLQUFLLEVBQUUsVUFBVTtRQUNqQixVQUFVO1FBQ1YsTUFBTTtRQUNOLE1BQU0sRUFBRSxHQUFHLEVBQUU7WUFDWCxPQUFPO2dCQUNMLFFBQVE7Z0JBQ1IsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTO2dCQUM5QixTQUFTO2dCQUNULFVBQVUsRUFBRSxVQUFVLENBQUMsU0FBUztnQkFDaEMsVUFBVTthQUNYLENBQUM7UUFDSixDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxDQUNwQixJQUFtQixFQUNuQixHQUFHLE9BQWtELEVBQ3JELEVBQUU7SUFDRixNQUFNLE1BQU0sR0FBRyxFQUFzRCxDQUFDO0lBQ3RFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sR0FBRyxHQUFHO1FBQ1YsSUFBSSxFQUFFO1lBQ0osSUFBSTtZQUNKLE1BQU07WUFDTixRQUFRLEVBQUUsU0FBUztZQUNuQixLQUFLLEVBQUUsU0FBUztZQUNoQixPQUFPLEVBQUUsU0FBUztZQUNsQixPQUFPLEVBQUUsU0FBUztZQUNsQixLQUFLLEVBQUUsU0FBUztTQUNqQjtRQUNELE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ2IsR0FBRyxHQUFHLENBQUMsSUFBSTtZQUNYLEdBQUc7Z0JBQ0QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSTtnQkFDbkIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDckM7U0FDRixDQUFDO1FBQ0YsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDckQsUUFBUSxFQUFFLEdBQUcsRUFBRTtZQUNiLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUN6QixPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUM7UUFDRCxLQUFLLEVBQUUsQ0FBQyxLQUErQixFQUFFLEVBQUU7WUFDekMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUNELE9BQU8sRUFBRSxDQUFDLEdBQUcsSUFBa0IsRUFBRSxFQUFFO1lBQ2pDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUN4QixPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQyxHQUFHLElBQStDLEVBQUUsRUFBRTtZQUM5RCxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDeEIsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDO1FBQ0QsS0FBSyxFQUFFLENBQUMsS0FBYSxFQUFFLE1BQWMsRUFBRSxFQUFFO1lBQ3ZDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2pDLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztLQUNGLENBQUM7SUFDRixPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMsQ0FBQyJ9