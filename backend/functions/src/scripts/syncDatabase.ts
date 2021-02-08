import "../schema";
import { objectTypeDefs } from "jomql";
// import { typeDef as subscriptionTypeDef } from "../schema/helpers/subscription";
// import { env } from "../config";
import { knex } from "../utils/knex";

syncDatabase();

async function syncDatabase(initSubscriptions = true, force = false) {
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

    await knex.schema
      .createTable(typeDef.definition.name, (table) => {
        const indicesMap: Map<string, Set<string>> = new Map();
        Object.entries(typeDef.definition.fields).forEach(
          ([fieldName, typeDefField]) => {
            const sqlDefinition = typeDefField.sqlOptions?.sqlDefinition;

            // if has no sqlDefinition, skip
            if (!sqlDefinition) return;

            // if ID field, set ID and return
            if (fieldName === "id") {
              table.increments();
              return;
            }

            // set type
            const tableReference = table[sqlDefinition.type](fieldName);

            // handle (not) nullable
            typeDefField.allowNull
              ? tableReference.nullable()
              : tableReference.notNullable();

            // set default value
            if (sqlDefinition.defaultValue !== undefined)
              tableReference.defaultTo(sqlDefinition.defaultValue);

            // assemble unique indices
            if (sqlDefinition.unique !== undefined) {
              // if true, apply unique constraint to that column only
              if (sqlDefinition.unique === true) {
                tableReference.unique();
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
          }
        );

        // add indices with names
        indicesMap.forEach((indexFields, indexName) => {
          table.unique([...indexFields]);
        });
      })
      .then(() => {
        console.log(`table '${typeDef.definition.name}' created`);
      })
      .catch((err) => {
        console.log(`table '${typeDef.definition.name}' FAILED`);
        console.log(err);
      });
  });
}
