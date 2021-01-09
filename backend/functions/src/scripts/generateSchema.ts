import * as schema from "../schema";
import * as fs from "fs";
import { CustomSchemaGenerator } from "../helpers/schema";

const tsSchemaGenerator = new CustomSchemaGenerator(schema);
tsSchemaGenerator.buildSchema();
tsSchemaGenerator.processSchema();

fs.writeFile("schema.ts", tsSchemaGenerator.outputSchema(), function (err) {
  if (err) console.log(err);
  console.log("Schema Written > schema.ts");
});
