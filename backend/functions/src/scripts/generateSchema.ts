import * as schema from "../schema";
import * as fs from "fs";
import { CustomSchemaGenerator } from "../helpers/schema";

// process nextTick, to allow inputType definitions to load
process.nextTick(() => {
  const tsSchemaGenerator = new CustomSchemaGenerator(schema);
  tsSchemaGenerator.buildSchema();
  tsSchemaGenerator.processSchema();

  fs.writeFile("schema.ts", tsSchemaGenerator.outputSchema(), function (err) {
    if (err) console.log(err);
    console.log("Schema Written > schema.ts");
  });
});
