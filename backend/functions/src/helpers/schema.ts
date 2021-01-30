import { TsSchemaGenerator } from "jomql";

export class CustomSchemaGenerator extends TsSchemaGenerator {
  constructor() {
    super();
    this.scaffoldStr += `
type Edge<T> = {
  __typename: Field<string, undefined>;
  node: Field<T, undefined>;
  cursor: Field<string, undefined>;
};\n\n`;
  }

  // additional post-processing of the schema
  processSchema() {
    // loop through this.inputTypeTsTypeFields and find places to simplify
    this.inputTypeTsTypeFields.value.forEach((value, key) => {
      // if inputDefName is ends in FilterByObject, process differently
      /*       if (key.match(/FilterByObject$/)) {
        // replace the value
        this.inputTypeTsTypeFields.set(key, {
          value: `FilterByObject<Scalars["${key.replace(
            /FilterByObject$/,
            "FilterByFields"
          )}"]>`,
          isArray: false,
          isNullable: false,
          isOptional: false,
        });
      } */
    });

    // loop through types and find places to simplify
    this.typeDocumentRoot.value.forEach((value, key) => {
      // if typeDefKey ends in Edge, simplify to generic to save space
      if (key.match(/Edge$/)) {
        this.typeDocumentRoot.value.set(key, {
          value: `Edge<${key.replace(/Edge$/, "")}>`,
          isArray: false,
          isNullable: false,
          isOptional: false,
        });
      }
    });
  }
}
