import fs from 'fs';
import path from 'path';

import commandLineArgs from 'command-line-args';
import knex from 'knex';
import schemaInspector from 'knex-schema-inspector';

import { FieldType, IFieldLike, ITable } from '../lib/sqlike';
import {
  isDateDataType,
  isNumericDataType,
  isStringDataType,
} from '../utils/query-utils';
import { DbConfig } from '../exec';

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
if (!options.path.endsWith('.json')) {
  throw '--path must be a json file';
}

const dbFilePath = path.resolve(__dirname, '../../', options.path);
// @typescript-eslint/no-var-requires
const dbConfig = require(dbFilePath) as DbConfig;
const database = knex(dbConfig);
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
  if (isStringDataType(data_type)) return 'string';
  else if (isNumericDataType(data_type)) return 'number';
  else if (isDateDataType(data_type)) return 'Date';
  else if (data_type.includes('blob')) return 'Blob';
  return data_type;
};

const generateTables = (tables: ITable<any>[], tableCodes: string[]) => {
  tables.forEach((table) => {
    const tableKey = table.name;
    const tableName =
      tableKey.substr(0, 1).toUpperCase() + snakeToCamel(tableKey.substr(1));
    const tableCode = `
export interface ${tableName}Table {
  ${Object.keys(table.fields)
    .map((fieldName) => {
      const nullable =
        table.fields[fieldName].is_nullable ||
        table.fields[fieldName].has_auto_increment;
      return (
        fieldName +
        (nullable ? '?' : '') +
        ': ' +
        typeName(table.fields[fieldName].data_type) +
        ';'
      );
    })
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
};

getSchema().then((schema) => {
  let serverTables = schema.slice(0);
  let clientTables = [];
  let serverCodes = [qlikeImportStr];
  if (dbConfig.generator) {
    if (dbConfig.generator.serverTables) {
      serverTables = schema
        .slice(0)
        .filter((tbl) => dbConfig.generator.serverTables.includes(tbl.name));
    }
    if (dbConfig.generator.clientTables) {
      clientTables = schema
        .slice(0)
        .filter((tbl) => dbConfig.generator.clientTables.includes(tbl.name));
    }
  }
  generateTables(serverTables, serverCodes);
  const serverTsFilePath =
    dbFilePath.substr(0, dbFilePath.length - 5) + '-server-schema.ts';
  console.log(serverTsFilePath);
  fs.writeFileSync(serverTsFilePath, serverCodes.join('\n'));

  const clientTsFilePath =
    dbFilePath.substr(0, dbFilePath.length - 5) + '-client-schema.ts';
  if (clientTables.length) {
    const clientCodes = [qlikeImportStr];
    generateTables(clientTables, clientCodes);
    console.log(clientTsFilePath);
    fs.writeFileSync(clientTsFilePath, clientCodes.join('\n'));
  } else {
    if (fs.existsSync(clientTsFilePath)) {
      fs.unlinkSync(clientTsFilePath);
    }
  }
  process.exit();
});
