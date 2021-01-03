import {
  Schema,
  isScalarDefinition,
  RootResolverObject,
  ArgDefinition,
  BaseScalars,
  TypeDefinition,
  isInputTypeDefinition,
} from "jomql";
import { generatePaginatorInfoTypeDef } from "../schema/core/generators";

function isNestedValue(
  ele: tsTypeFieldFinalValue | tsTypeFields | string
): ele is tsTypeFields {
  return ele instanceof Map;
}

type tsTypeFields = Map<string, tsTypeFieldFinalValue | tsTypeFields>;

type tsTypeFieldFinalValue = {
  value: string;
  isArray: boolean;
  isNullable: boolean;
  isOptional: boolean;
};

export class TsSchemaGenerator {
  schema: Schema;
  scaffoldStr: string = `
// scaffolding
export type GetQuery<K extends keyof Root> = Record<
  K,
  Queryize<Argize<Root[K]["Query"], Root[K]["Args"]>>
>;

export type GetResponse<K extends keyof Root> = Omit<Root[K]["Response"], args>;

type Primitive = string | number | boolean | undefined | null;

type args = "__args";

type ElementType<T extends any[]> = T[number];

type Edge<T> = {
  node: T;
  cursor: string;
};

type Queryize<T> = {
  [P in keyof T]?: T[P] extends never
    ? never
    : T[P] extends Primitive
    ? true
    : P extends args
    ? T[P]
    : T[P] extends any[] // strips the array from any array types
    ? Queryize<ElementType<T[P]>>
    : Queryize<T[P]>;
};

type Argize<T, Args> = Args extends undefined
  ? T
  : Omit<T, args> & { __args?: Args };

type FilterObject<T> = {
  field: T;
  operator?: string;
  value: unknown;
};\n\n`;
  typeDocumentRoot: Map<string, tsTypeFields | string> = new Map();
  scalarTsTypeFields: tsTypeFields = new Map();
  inputTypeTsTypeFields: tsTypeFields = new Map();
  deferredTypeFields: Set<string> = new Set();

  constructor(schema: Schema) {
    this.schema = schema;
  }

  buildSchema() {
    // base scalars
    Object.entries(BaseScalars).forEach(([field, fieldDef]) => {
      if (isScalarDefinition(fieldDef)) {
        this.scalarTsTypeFields.set(fieldDef.name, {
          value: fieldDef.types.join("|"),
          isArray: false,
          isNullable: false,
          isOptional: false,
        });
      }
    });

    // addedScalars
    Object.entries(this.schema.scalars).forEach(([field, fieldDef]) => {
      if (isScalarDefinition(fieldDef)) {
        this.scalarTsTypeFields.set(fieldDef.name, {
          value: fieldDef.types.join("|"),
          isArray: false,
          isNullable: false,
          isOptional: false,
        });
      }
    });

    this.typeDocumentRoot.set("Scalars", this.scalarTsTypeFields);

    this.typeDocumentRoot.set("InputType", this.inputTypeTsTypeFields);

    // add main types
    this.schema.typeDefs.forEach((typeDef, typeDefKey) => {
      const mainTypeFields = this.processTypeDefinition(typeDef);

      const capitalizedTypeDefKey = capitalizeString(typeDefKey);

      this.typeDocumentRoot.set(capitalizedTypeDefKey, mainTypeFields);

      // check if this type was on any deferred lists. if so, remove.
      if (this.deferredTypeFields.has(capitalizedTypeDefKey)) {
        this.deferredTypeFields.delete(capitalizedTypeDefKey);
      }
    });

    // add root resolvers -- must be added AFTER types
    const rootTypeFields: tsTypeFields = new Map();

    this.typeDocumentRoot.set("Root", rootTypeFields);

    // aggregate all root resolvers
    const allRootResolversMap: Map<string, RootResolverObject> = new Map();

    Object.values(this.schema.rootResolvers).forEach((rootResolver) => {
      for (const key in rootResolver) {
        allRootResolversMap.set(key, rootResolver[key]);
      }
    });

    allRootResolversMap.forEach((rootResolver, key) => {
      const rootObject: tsTypeFields = new Map();
      const type = rootResolver.type;
      let typename;
      if (isScalarDefinition(type)) {
        // if it is a scalarDefinition, look up in scalar Definition table

        // if not exists, add it
        if (!this.scalarTsTypeFields.has(type.name)) {
          this.scalarTsTypeFields.set(type.name, {
            value: type.types.join("|"),
            isArray: !!rootResolver.isArray,
            isNullable: rootResolver.allowNull,
            isOptional: false,
          });
        }

        typename = `Scalars['${type.name}']`;
      } else {
        typename = capitalizeString(type);

        // if typename is not defined in the typeDocumentRoot, it is an unknown type. add it to the list.
        if (!this.typeDocumentRoot.has(typename)) {
          this.deferredTypeFields.add(typename);
        }
      }

      // parse the argDefinitions
      const argReference: tsTypeFieldFinalValue = this.processArgDefinition(
        rootResolver.args,
        key
      );

      // always set argReference to required, as it is under the Root type
      argReference.isOptional = false;

      rootObject.set("Query", {
        value: typename,
        isArray: false,
        isNullable: false,
        isOptional: false,
      });

      rootObject.set("Response", {
        value: typename,
        isArray: false,
        isNullable: false,
        isOptional: false,
      });

      rootObject.set("Args", argReference);

      rootTypeFields.set(key, rootObject);
    });

    // process deferred fields
    this.deferredTypeFields.forEach((ele) => {
      let fieldAdded = false;
      if (ele.match(/PaginatorInfo/)) {
        const typeDef = generatePaginatorInfoTypeDef();
        this.typeDocumentRoot.set(ele, this.processTypeDefinition(typeDef));
        fieldAdded = true;
      }

      // if typename ends in Edge, simplify to generic to save space
      if (ele.match(/Edge$/)) {
        this.typeDocumentRoot.set(ele, `Edge<${ele.replace(/Edge$/, "")}>`);
        fieldAdded = true;
      }

      if (fieldAdded) {
        this.deferredTypeFields.delete(ele);
      }
    });

    // if any deferred fields left, give a warning
    if (this.deferredTypeFields.size > 0) {
      console.log(
        "Warning: the schema file might not be complete due to some missing types"
      );
      console.log(this.deferredTypeFields);
    }
  }

  processTypeDefinition(typeDef: TypeDefinition) {
    const mainTypeFields: tsTypeFields = new Map();
    Object.entries(typeDef).forEach(([field, fieldDef]) => {
      const type = fieldDef.type;
      let typename;

      // if field is hidden, set the typename to never
      if (fieldDef.hidden) {
        typename = "never";
      } else if (isScalarDefinition(type)) {
        // if it is a scalarDefinition, look up in scalar Definition table

        // if not exists, add it
        if (!this.scalarTsTypeFields.has(type.name)) {
          this.scalarTsTypeFields.set(type.name, {
            value: type.types.join("|"),
            isArray: !!fieldDef.isArray,
            isNullable: false,
            isOptional: false,
          });
        }

        typename = `Scalars['${type.name}']`;
      } else {
        typename = capitalizeString(type);

        // if typename is not defined in the typeDocumentRoot, it is an unknown type. add it to the list.
        if (!this.typeDocumentRoot.has(typename)) {
          this.deferredTypeFields.add(typename);
        }
      }

      // for a XPaginator typeDefKey, the Edge should be named XEdge
      // we will simplify that using a generic type to save space
      /*
        if (typeDefKey.match(/Paginator$/) && typename.match(/Edge$/)) {
          typename = `Edge<${typename.replace(/Edge$/, "")}>`;
        }
        */

      mainTypeFields.set(field, {
        value: typename,
        isArray: !!fieldDef.isArray,
        isNullable: fieldDef.allowNull,
        isOptional: false,
      });
    });

    return mainTypeFields;
  }

  processArgDefinition(
    argDefinition: ArgDefinition | undefined,
    argName?: string
  ): tsTypeFieldFinalValue {
    let argTypename;
    if (argDefinition) {
      const argType = argDefinition.type;

      const inputTypeTypeFields: tsTypeFields = new Map();
      if (isInputTypeDefinition(argType)) {
        Object.entries(argType.fields).forEach(([key, argDef]) => {
          const finalValue = this.processArgDefinition(argDef);
          inputTypeTypeFields.set(key, finalValue);
        });
        const argDefName = argType.name ?? argName;

        if (!argDefName) throw new Error("At least 1 ArgDef is missing name");

        // add to type InputType if not exists
        if (!this.inputTypeTsTypeFields.has(argDefName)) {
          this.inputTypeTsTypeFields.set(argDefName, inputTypeTypeFields);
        }

        // update the argTypename
        argTypename = `InputType['${argDefName}']`;
      } else if (isScalarDefinition(argType)) {
        // if it is a scalarDefinition, look up in input Definition table

        // if not exists, add it
        if (!this.scalarTsTypeFields.has(argType.name)) {
          this.scalarTsTypeFields.set(argType.name, {
            value: argType.types.join("|"),
            isArray: false,
            isNullable: false,
            isOptional: false,
          });
        }

        argTypename = `Scalars['${argType.name}']`;
      } else {
        // string field,
        argTypename = capitalizeString(argType);
      }

      // if argName is a getX rootResolver and X is a known type, add as arg field on type X
      if (argName) {
        const keyParts = argName.split(/^get/);
        if (
          keyParts[0] === "" &&
          this.schema.typeDefs.has(lowercaseString(keyParts[1]))
        ) {
          const tsTypeField = this.typeDocumentRoot.get(keyParts[1]);
          if (tsTypeField && isNestedValue(tsTypeField)) {
            tsTypeField.set("__args", {
              value: `Root["${argName}"]["Args"]`,
              isArray: false,
              isNullable: false,
              isOptional: false,
            });
          }
        }
      }
    }

    return {
      value: argTypename ?? "undefined",
      isArray: argDefinition?.isArray ?? false,
      isNullable: false,
      isOptional: !argDefinition?.required ?? false,
    };
  }

  outputSchema(htmlMode = false) {
    // build final TS document
    let typesStr: string = "";

    this.typeDocumentRoot.forEach((tsTypeField, typename) => {
      typesStr +=
        `export type ${typename}=` +
        (isNestedValue(tsTypeField)
          ? this.buildTsDocument(tsTypeField)
          : tsTypeField) +
        `\n`;
    });

    const finalStr = this.scaffoldStr + typesStr;
    return htmlMode ? `<pre>${finalStr}</pre>` : finalStr;
  }

  buildTsDocument(tsTypeField: tsTypeFields) {
    let str = "{";
    tsTypeField.forEach((value, key) => {
      if (isNestedValue(value)) {
        // nested tsTypeField
        str += `${key}:${this.buildTsDocument(value)};`;
      } else {
        // string value
        str += `${key + (value.isOptional ? "?" : "")}:(${
          (value.value === "" ? "undefined" : value.value) +
          (value.isNullable ? "|null" : "") +
          ")" +
          (value.isArray ? "[]" : "")
        };`;
      }
    });
    str += "}";
    return str;
  }
}

function capitalizeString(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function lowercaseString(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function sanitizeType(val: any) {
  if (Array.isArray(val))
    return JSON.stringify(val.map((ele) => capitalizeString(ele)));
  else return capitalizeString(val);
}
