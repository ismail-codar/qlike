import knex from 'knex';
import schemaInspector from 'knex-schema-inspector';

import { IFieldLike, ITable } from '../lib/sqlike';

const database = knex({
  client: 'sqlite3',
  connection: {
    filename: 'doc/salila-sql/sqlite-sakila-db/sakila.db',
  },
  useNullAsDefault: true,
});

const inspector = schemaInspector(database);

const getSchema = async (): Promise<ITable<any>[]> => {
  const tables: ITable<any>[] = [];
  const dbTables = await inspector.tables();

  for (let i = 0; i < dbTables.length; i++) {
    const tableName = dbTables[i];
    const table: ITable<any> = { tableName, fields: {} };
    const tableColumns = await inspector.columnInfo(tableName);
    tableColumns.forEach((column) => {
      table.fields[column.name] = column as IFieldLike<any>;
    });
    tables.push(table);
  }

  return tables;
};

getSchema().then((schema) => {
  // console.log(JSON.stringify(schema, null, 1));
  const typeNames = [];
  schema.map((table) =>
    Object.keys(table.fields).map((fldName) => {
      if (!typeNames.includes(table.fields[fldName].data_type)) {
        typeNames.push(table.fields[fldName].data_type);
      }
    })
  );
  console.log(typeNames.join('" | "'));
  process.exit();
});
