import { TsSchemaGenerator } from "jomql";

export class CustomSchemaGenerator extends TsSchemaGenerator {
  constructor(schema) {
    super(schema);
    this.scaffoldStr =
      `// Query builder
const queryResult = executeJomql({
  // Start typing here to get hints
});

export function executeJomql<Key extends keyof Root>(
  query: GetQuery<Key>
): GetResponse<Key> {
  return;
}
    ` + this.scaffoldStr;

    this.scaffoldStr += `
type Edge<T> = {
  node: Omit<T, args>;
  cursor: string;
};

type FilterByObject<T> = {
  field: T;
  operator?: string;
  value: unknown;
};\n\n`;
  }

  // additional post-processing of the schema
  processSchema() {
    // loop through this.inputTypeTsTypeFields and find places to simplify
    this.inputTypeTsTypeFields.forEach((value, key) => {
      // if inputDefName is ends in FilterByObject, process differently
      if (key.match(/FilterByObject$/)) {
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
      }
    });

    // loop through types and find places to simplify
    this.typeDocumentRoot.forEach((value, key) => {
      // if typeDefKey ends in Edge, simplify to generic to save space
      if (key.match(/Edge$/)) {
        this.typeDocumentRoot.set(key, {
          value: {
            value: `Edge<${key.replace(/Edge$/, "")}>`,
            isArray: false,
            isNullable: false,
            isOptional: false,
          },
        });
      }
    });
  }
}
