import * as schema from "../schema";
import * as fs from "fs";
import { TsSchemaGenerator } from "../helpers/schema";

const tsSchemaGenerator = new TsSchemaGenerator(schema);
tsSchemaGenerator.buildSchema();

fs.writeFile("schema.ts", tsSchemaGenerator.outputSchema(), function (err) {
  if (err) console.log(err);
  console.log("Schema Written > schema.ts");
});
