import * as fs from 'fs';
import * as path from 'path';

import commandLineArgs from 'command-line-args';
import knex from 'knex';
import schemaInspector from 'knex-schema-inspector';

import { FieldType, IFieldLike, ITable } from '../lib/sqlike';

const optionDefinitions = [
  { name: 'path', alias: 'p', type: String },
  { name: 'minimal', alias: 'm', type: Boolean },
];
const options = commandLineArgs(optionDefinitions);
let qlikeImportStr = "import { ITable } from 'qlike-core';";
if (!options.path) {
  qlikeImportStr = "import { ITable } from '../../lib/sqlike';";
  options.path = 'src/test/helpers/test-db.json';
  //   options.minimal = true;
}
console.log(options);

const dbFilePath = path.resolve(__dirname, '../../', options.path);
// @typescript-eslint/no-var-requires
const database = knex(require(dbFilePath));
const inspector = schemaInspector(database);

const getSchema = async (): Promise<ITable<any>[]> => {
  const tables: ITable<any>[] = [];
  const dbTables = await inspector.tables();

  for (let i = 0; i < dbTables.length; i++) {
    const tableName = dbTables[i];
    const table: ITable<any> = { name: tableName, fields: {} };
    const tableColumns = await inspector.columnInfo(tableName);
    tableColumns.forEach((column) => {
      table.fields[column.name] = column as IFieldLike<any>;
    });
    tables.push(table);
  }

  return tables;
};

const snakeToCamel = (str) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', '')
    );

const typeName = (data_type: FieldType) => {
  if (data_type.includes('char') || data_type.includes('text')) return 'string';
  else if (
    data_type.includes('int') ||
    data_type.includes('num') ||
    data_type === 'decimal'
  )
    return 'number';
  else if (data_type === 'timestamp' || data_type === 'datetime') return 'Date';
  else if (data_type.includes('blob')) return 'Blob';
  return data_type;
};

getSchema().then((schema) => {
  const tableCodes = [qlikeImportStr];
  schema.forEach((table) => {
    const tableKey = table.name;
    const tableName =
      tableKey.substr(0, 1).toUpperCase() + snakeToCamel(tableKey.substr(1));
    const tableCode = `
export interface ${tableName}Table {
  ${Object.keys(table.fields)
    .map(
      (fieldName) =>
        fieldName + ': ' + typeName(table.fields[fieldName].data_type) + ';'
    )
    .join('\n  ')}
}

export const ${
      tableName.substr(0, 1).toLowerCase() + tableName.substr(1)
    }Table: ITable<${tableName}Table> = {
  name: '${tableKey}',
  fields: {
    ${Object.keys(table.fields)
      .map((fieldName) =>
        options.minimal
          ? `${fieldName}: { name: '${fieldName}', data_type: '${table.fields[fieldName].data_type}' },`
          : `${fieldName}: ${JSON.stringify(table.fields[fieldName])},`
      )
      .join('\n    ')}
  },
};`;
    tableCodes.push(tableCode);
  });

  const tsFilePath = dbFilePath.substr(0, dbFilePath.length - 4) + 'ts';
  fs.writeFileSync(tsFilePath, tableCodes.join('\n'));

  process.exit();
});
