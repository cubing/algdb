import "../schema";
import { objectTypeDefs } from "jomql";
import { knex } from "../utils/knex";
import * as fs from "fs";

export function isKnexNow(ele: unknown) {
  return Object.prototype.toString.call(ele) === "[object object]";
}

const output = generateMigration();

fs.writeFile("migration.ts", output, function (err) {
  if (err) console.log(err);
  console.log("Migration file written > migration.ts");
});

// generates a migration file based on the database schema
function generateMigration(initSubscriptions = true, force = false) {
  const upTablesMap: Map<string, Array<string>> = new Map();

  objectTypeDefs.forEach(async (typeDef, typeKey) => {
    // does every field not have a sql field?
    if (
      Object.values(typeDef.definition.fields).every(
        (typeDefField) => typeDefField.sqlOptions === undefined
      )
    ) {
      // if yes, skip
      return;
    }

    const operationsArray: string[] = [];

    // add to map
    upTablesMap.set(typeDef.definition.name, operationsArray);

    const indicesMap: Map<string, Set<string>> = new Map();

    Object.entries(typeDef.definition.fields).forEach(
      ([fieldName, typeDefField]) => {
        const sqlDefinition = typeDefField.sqlOptions?.sqlDefinition;

        // if has no sqlDefinition, skip
        if (!sqlDefinition) return;

        // if ID field, set ID and return
        if (fieldName === "id") {
          operationsArray.push("table.increments()");
          return;
        }

        let operationString = `table.${sqlDefinition.type}("${fieldName}")`;

        // handle (not) nullable
        operationString += typeDefField.allowNull
          ? `.nullable()`
          : `.notNullable()`;

        // set default value
        if (sqlDefinition.defaultValue !== undefined) {
          // add quotes if string, convert any objects to knex.fn.now()
          const defaultValueString =
            typeof sqlDefinition.defaultValue === "string"
              ? `"${sqlDefinition.defaultValue}"`
              : isKnexNow(sqlDefinition.defaultValue)
              ? "knex.fn.now()"
              : sqlDefinition.defaultValue;

          operationString += `.defaultTo(${defaultValueString})`;
        }

        // assemble unique indices
        if (sqlDefinition.unique !== undefined) {
          // if true, apply unique constraint to that column only
          if (sqlDefinition.unique === true) {
            operationString += `.unique()`;
          }

          // if string, add to indicesMap
          if (typeof sqlDefinition.unique === "string") {
            if (!indicesMap.has(sqlDefinition.unique)) {
              indicesMap.set(sqlDefinition.unique, new Set());
            }

            const index = indicesMap.get(sqlDefinition.unique);
            index!.add(fieldName);
          }
        }

        operationsArray.push(operationString);
      }
    );

    // add indices with names
    indicesMap.forEach((indexFields, indexName) => {
      operationsArray.push(
        `table.unique([${[...indexFields].map((ele) => `"${ele}"`).join(",")}])`
      );
    });
  });

  let upString = "";

  upTablesMap.forEach((value, tablename) => {
    upString += `knex.schema.createTable("${tablename}", function (table) { ${value
      .map((val) => val + ";")
      .join("")} }),\n`;
  });

  return `import * as Knex from "knex";

export async function up(knex: Knex): Promise<void[]> {
  return Promise.all([
    ${upString}
  ])
}

export async function down(knex: Knex): Promise<void[]> {
  return Promise.all([
    ${[...upTablesMap.keys()]
      .map((tablename) => `knex.schema.dropTable("${tablename}")`)
      .join(",")}
  ]);
}
`;
}
