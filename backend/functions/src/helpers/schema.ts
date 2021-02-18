import { TsSchemaGenerator } from "jomql";
export class CustomSchemaGenerator extends TsSchemaGenerator {
  constructor(jomqlOptions) {
    super(jomqlOptions);
    this.scaffoldStr += `
type Edge<T> = {
  __typename: Field<string, undefined>;
  node: Field<T, undefined>;
  cursor: Field<string, undefined>;
};

export type FilterByField<T> = {
  eq?: T
  neq?: T
  gt?: T
  lt?: T
  in?: T[]
  nin?: T[]
  regex?: Scalars['regex']
}\n\n`;
  }

  // additional post-processing of the schema
  processSchema() {
    // loop through this.inputTypeTsTypeFields and find places to simplify
    this.inputTypeTsTypeFields.value.forEach((value, key) => {
      // if inputDefName contains FilterByField/, transform it into a FilterByField<T>
      if (key.match(/FilterByField\//)) {
        if (typeof value.value !== "string") {
          const filterByType = value.value.get("eq")?.value;
          if (filterByType) {
            this.inputTypeTsTypeFields.value.set(key, {
              value: `FilterByField<${filterByType}>`,
              isNullable: false,
              isOptional: false,
            });
          }
        }
      }
    });

    // loop through types and find places to simplify
    this.typeDocumentRoot.value.forEach((value, key) => {
      // if typeDefKey ends in Edge, simplify to generic to save space
      if (key.match(/Edge$/)) {
        this.typeDocumentRoot.value.set(key, {
          value: `Edge<${key.replace(/Edge$/, "")}>`,
          isNullable: false,
          isOptional: false,
        });
      }
    });
  }
}
