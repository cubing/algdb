import {
  ObjectTypeDefinitionField,
  ScalarDefinition,
  InputTypeDefinition,
  ResolverFunction,
  RootResolverFunction,
  JomqlArgsError,
  lookupSymbol,
  objectTypeDefs,
  JomqlInitializationError,
  JomqlInputType,
  JomqlScalarType,
  JomqlObjectTypeLookup,
  JomqlObjectType,
  JomqlInputFieldType,
  ArrayOptions,
} from "jomql";
import { knex } from "../../utils/knex";
import * as Resolver from "./resolver";
import { deepAssign, isObject, capitalizeString } from "./shared";
import { BaseService, NormalService, PaginatedService } from "../core/services";
import { linkDefs } from "../links";
import * as Scalars from "../scalars";
import type {
  ObjectTypeDefSqlOptions,
  SqlDefinition,
  SqlType,
} from "../../types";

type GenerateFieldParams = {
  name?: string;
  description?: string;
  allowNull: boolean;
  hidden?: boolean;
  defaultValue?: unknown;
  sqlDefinition?: Partial<SqlDefinition>;
  sqlOptions?: Partial<ObjectTypeDefSqlOptions>;
  typeDefOptions?: Partial<ObjectTypeDefinitionField>;
};

/*
 ** Standard Fields
 */

// generic field builder
export function generateStandardField(
  params: {
    sqlType?: SqlType;
    type: JomqlScalarType | JomqlObjectTypeLookup | JomqlObjectType;
    arrayOptions?: ArrayOptions;
  } & GenerateFieldParams
) {
  const {
    name,
    description,
    allowNull,
    arrayOptions,
    hidden = false,
    defaultValue,
    sqlType,
    type,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  } = params;
  const typeDef = <ObjectTypeDefinitionField>{
    type,
    description,
    arrayOptions,
    allowNull,
    required: defaultValue === undefined && !allowNull,
    sqlOptions: sqlType
      ? {
          sqlDefinition: {
            type: sqlType,
            ...(defaultValue !== undefined && { defaultValue: defaultValue }),
            ...sqlDefinition,
          },
          ...sqlOptions,
        }
      : undefined,
    hidden,
    addable: true, // default addable and updateable
    updateable: true,
    ...typeDefOptions,
  };
  return name
    ? {
        [name]: typeDef,
      }
    : typeDef;
}

// NOT a sql field.
export function generateGenericScalarField(
  params: {
    type: JomqlScalarType;
    arrayOptions?: ArrayOptions;
  } & GenerateFieldParams
) {
  const {
    name,
    description,
    allowNull = true,
    arrayOptions,
    defaultValue,
    hidden,
    type,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull,
    arrayOptions,
    defaultValue,
    hidden,
    type: type ?? Scalars.string,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  });
}

export function generateStringField(
  params: {
    type?: JomqlScalarType;
  } & GenerateFieldParams
) {
  const {
    name,
    description,
    allowNull = true,
    defaultValue,
    hidden,
    type,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull,
    defaultValue,
    hidden,
    sqlType: "string",
    type: type ?? Scalars.string,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  });
}

// as UNIX timestamp
export function generateDateField(
  params: {
    nowOnly?: boolean; // if the unix timestamp can only be set to now()
  } & GenerateFieldParams
) {
  const {
    name,
    description,
    allowNull = true,
    defaultValue,
    hidden,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
    nowOnly,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull,
    defaultValue,
    hidden,
    sqlType: "dateTime",
    type: Scalars.unixTimestamp,
    sqlDefinition,
    sqlOptions: {
      getter: (field) => "extract(epoch from " + field + ")",
      parseValue: nowOnly
        ? () => knex.fn.now()
        : (value: unknown) => {
            console.log(value);
            if (typeof value !== "number") throw 1; // should never happen
            return new Date(value);
          },
      ...sqlOptions,
    },
    typeDefOptions,
  });
}

export function generateTextField(params: GenerateFieldParams) {
  const {
    name,
    description,
    allowNull = true,
    hidden,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull: allowNull,
    hidden,
    sqlType: "text",
    type: Scalars.string,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  });
}

export function generateIntegerField(params: GenerateFieldParams) {
  const {
    name,
    description,
    allowNull = true,
    defaultValue,
    hidden,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull,
    defaultValue,
    hidden,
    sqlType: "integer",
    type: Scalars.number,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  });
}

export function generateFloatField(params: GenerateFieldParams) {
  const {
    name,
    description,
    allowNull = true,
    defaultValue,
    hidden,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull,
    defaultValue,
    hidden,
    sqlType: "float",
    type: Scalars.number,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  });
}

export function generateDecimalField(params: GenerateFieldParams) {
  const {
    name,
    description,
    allowNull = true,
    defaultValue,
    hidden,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull,
    defaultValue,
    hidden,
    sqlType: "decimal",
    type: Scalars.number,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  });
}

export function generateBooleanField(params: GenerateFieldParams) {
  const {
    name,
    description,
    allowNull = true,
    defaultValue,
    hidden,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull,
    defaultValue,
    hidden,
    sqlType: "boolean",
    type: Scalars.boolean,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  });
}

// array of strings, stored in mysql as JSON
export function generateArrayField(
  params: {
    type: JomqlScalarType;
    allowNullElement?: boolean;
  } & GenerateFieldParams
) {
  const {
    name,
    description,
    allowNull = true,
    allowNullElement = false,
    hidden,
    type,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    arrayOptions: {
      allowNullElement,
    },
    allowNull,
    hidden,
    sqlType: "json",
    type,
    sqlDefinition,
    sqlOptions: {
      // necessary for inserting JSON into DB properly
      parseValue: (val) => JSON.stringify(val),
      ...sqlOptions,
    },
    typeDefOptions: {
      ...typeDefOptions,
    },
  });
}

// should handle kenums too
export function generateEnumField(
  params: {
    scalarDefinition: JomqlScalarType;
    isKenum?: boolean;
  } & GenerateFieldParams
) {
  const {
    name,
    description,
    allowNull = true,
    defaultValue,
    hidden,
    scalarDefinition,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
    isKenum = false,
  } = params;

  // if scalarDefinition.parseValue, run that on defaultValue

  return generateStandardField({
    name,
    description,
    allowNull: allowNull,
    defaultValue:
      scalarDefinition.definition.parseValue && defaultValue !== undefined
        ? scalarDefinition.definition.parseValue(defaultValue)
        : defaultValue,
    hidden,
    sqlType: isKenum ? "integer" : "string",
    type: scalarDefinition,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  });
}

/*
 ** Field Helpers (Commonly used fields)
 */

export function generateCreatedAtField() {
  return generateDateField({
    name: "created_at",
    description: "When the record was created",
    allowNull: false,
    defaultValue: knex.fn.now(),
    typeDefOptions: { addable: false, updateable: false }, // not addable or updateable
  });
}

export function generateUpdatedAtField() {
  return generateDateField({
    name: "updated_at",
    description: "When the record was last updated",
    allowNull: true,
    typeDefOptions: { addable: false, updateable: false }, // not addable or updateable
    nowOnly: true,
  });
}

export function generateIdField() {
  return generateStandardField({
    name: "id",
    description: "The unique ID of the field",
    allowNull: false,
    sqlType: "integer",
    type: Scalars.id,
    sqlDefinition: undefined, // not in sql
    typeDefOptions: { addable: false, updateable: false }, // not addable or updateable
  });
}

export function generateTypenameField(service: BaseService) {
  return generateGenericScalarField({
    name: "__typename",
    description: "The typename of the record",
    allowNull: false,
    type: Scalars.string,
    typeDefOptions: {
      resolver: () => service.typename,
      args: new JomqlInputFieldType({
        required: false,
        allowNull: false,
        type: Scalars.number,
      }),
      addable: false,
      updateable: false, // not addable or updateable
    },
  });
}

export function generateCreatedByField(service: NormalService) {
  return generateJoinableField({
    name: "created_by",
    allowNull: false,
    service,
    typeDefOptions: { addable: false, updateable: false }, // not addable or updateable
  });
}

export function generateJoinableField(
  params: {
    service: NormalService;
  } & GenerateFieldParams
) {
  const {
    name,
    description,
    allowNull = true,
    defaultValue,
    hidden,
    sqlOptions,
    sqlDefinition,
    typeDefOptions,
    service,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull,
    defaultValue,
    hidden,
    sqlType: "integer",
    type: service.typeDefLookup,
    sqlDefinition,
    typeDefOptions,
    sqlOptions: {
      joinInfo: {
        type: service.typename,
      },
      ...sqlOptions,
    },
  });
}

// alternative strategy for "joins"
export function generateDataloadableField(
  params: {
    service: NormalService;
  } & GenerateFieldParams
) {
  const {
    name,
    description,
    allowNull = true,
    defaultValue,
    hidden,
    service,
    sqlDefinition,
    sqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull,
    defaultValue,
    hidden,
    sqlType: "integer",
    type: service.typeDefLookup,
    sqlDefinition,
    sqlOptions,
    typeDefOptions: {
      defer: true,
      dataloader: ({ req, args, query, currentObject, fieldPath, data }) => {
        // if data.idArray empty, return empty array
        if (!data.idArray.length) return Promise.resolve([]);
        // aggregator function that must accept data.idArray = [1, 2, 3, ...]
        return Resolver.getObjectType(
          service.typename,
          req,
          fieldPath,
          query,
          {
            where: {
              fields: [{ field: "id", operator: "in", value: data.idArray }],
            },
          },
          data
        );
      },
      ...typeDefOptions,
    },
  });
}

// should work for *most* cases
// returns resolver object instead of a typeDef because it is also used to generate the rootResolver
export function generatePaginatorPivotResolverObject(params: {
  name?: string;
  pivotService: PaginatedService;
  currentService?: NormalService;
}) {
  const { name, pivotService, currentService } = params;

  const filterByField = currentService
    ? currentService.typename.toLowerCase()
    : null;

  const sortByScalarDefinition: ScalarDefinition = {
    name: pivotService.typename + "SortByKey",
    types: Object.keys(pivotService.sortFieldsMap).map((ele) => `"${ele}"`),
    parseValue: (value) => {
      if (typeof value !== "string" || !(value in pivotService.sortFieldsMap))
        throw true;
      return value;
    },
  };

  const filterByTypeDefinition: InputTypeDefinition = {
    name: pivotService.typename + "FilterByObject",
    fields: {},
  };

  // populate the fields nextTick, to allow objectTypeDefs to load
  process.nextTick(() => {
    Object.entries(pivotService.filterFieldsMap).reduce(
      (total, [filterKey, filterValue]) => {
        const actualFilterKey = filterValue.field ?? filterKey;
        // traverse the fields to find the scalarDefinition
        const keyParts = actualFilterKey.split(".");
        let currentType;
        let allowNull = false;
        let currentObjectTypeField;
        let currentTypeDef = pivotService.getTypeDef();
        keyParts.forEach((keyPart, keyIndex) => {
          if (keyPart in currentTypeDef.definition.fields) {
            currentType = currentTypeDef.definition.fields[keyPart].type;
            currentObjectTypeField = currentTypeDef.definition.fields[keyPart];
          } else {
            // look in link fields and generate required joins
            linkDefs.forEach((linkDef, linkName) => {
              if (
                linkDef.types.has(keyPart) &&
                linkDef.types.has(currentTypeDef.definition.name)
              ) {
                currentType = linkDef.types.get(keyPart)?.typeDefLookup;
                currentObjectTypeField = linkDef.types.get(keyPart);
              }
            });
          }

          // if currentType undefined, must be an unrecognized field
          if (!currentType) {
            throw new JomqlInitializationError({
              message: `Invalid field '${filterKey}' on '${currentTypeDef.definition.name}'`,
            });
          }

          // if one in the chain has allowNull === true, then allowNull
          if (currentObjectTypeField.allowNull) allowNull = true;

          // if has next field and currentType is JomqlObjectType, get and set the next typeDef
          if (keyParts[keyIndex + 1]) {
            if (currentType instanceof JomqlObjectTypeLookup) {
              const lookupTypeDef = objectTypeDefs.get(currentType.name);

              if (!lookupTypeDef) {
                throw new JomqlInitializationError({
                  message: `Invalid typeDef lookup for '${currentType.name}'`,
                });
              }

              currentTypeDef = lookupTypeDef;
            } else if (currentType instanceof JomqlObjectType) {
              currentTypeDef = currentType;
            } else {
              // must be scalar. should be over
            }
          }
        });

        // final value must be scalar at the moment
        if (!(currentType instanceof JomqlScalarType)) {
          throw new JomqlInitializationError({
            message: `Final filter field must be a scalar type. Field: '${filterKey}'`,
          });
        }

        total[filterKey] = new JomqlInputFieldType({
          type: new JomqlInputType(
            {
              name: `${pivotService.typename}FilterByField/${filterKey}`,
              fields: {
                operator: new JomqlInputFieldType({
                  type: Scalars.filterOperator,
                  required: false,
                }),
                value: new JomqlInputFieldType({
                  type: currentType,
                  required: true,
                  allowNull,
                }),
              },
            },
            true
          ),
          required: false,
          allowNull: false,
          arrayOptions: {
            allowNullElement: false,
          },
        });
        return total;
      },
      filterByTypeDefinition.fields
    );
  });

  const groupByScalarDefinition: ScalarDefinition = {
    name: pivotService.typename + "GroupByKey",
    types: Object.keys(pivotService.groupByFieldsMap).map((ele) => `"${ele}"`),
    parseValue: (value) => {
      if (
        typeof value !== "string" ||
        !(value in pivotService.groupByFieldsMap)
      )
        throw true;
      return value;
    },
  };

  let rootResolverFunction: RootResolverFunction | undefined;
  let resolverFunction: ResolverFunction | undefined;

  if (filterByField) {
    resolverFunction = async ({
      req,
      args,
      fieldPath,
      query,
      fieldValue,
      parentValue,
      data,
    }) => {
      // args should be validated already
      const validatedArgs = <any>args;
      // check if currentObject.id was requested
      let parentItemId = parentValue?.id ?? data.rootArgs?.args?.id;

      // if not available, must be looked up using non-id key, fetch
      if (!parentItemId) {
        const results = <any>await currentService!.getRecord({
          req,
          fieldPath,
          args: { ...data.rootArgs },
          query: {
            id: lookupSymbol,
          },
          isAdmin: true,
          data,
        });

        // should always exist
        parentItemId = results.id;
      }

      return pivotService.paginator.getRecord({
        req,
        fieldPath,
        args: deepAssign(
          { ...validatedArgs },
          {
            filterBy: {
              [filterByField]: [
                {
                  value: parentItemId,
                },
              ],
            },
          }
        ),
        query,
        data,
      });
    };
  } else {
    rootResolverFunction = (inputs) => pivotService.paginator.getRecord(inputs);
  }

  const hasSearchFields =
    pivotService.searchFieldsMap &&
    Object.keys(pivotService.searchFieldsMap).length > 0;

  return <ObjectTypeDefinitionField>{
    type: new JomqlObjectTypeLookup(pivotService.paginator.typename),
    isArray: false,
    allowNull: false,
    args: new JomqlInputFieldType({
      required: true,
      type: new JomqlInputType(
        {
          name: "get" + capitalizeString(pivotService.paginator.typename),
          fields: {
            first: new JomqlInputFieldType({
              type: Scalars.number,
            }),
            last: new JomqlInputFieldType({
              type: Scalars.number,
            }),
            after: new JomqlInputFieldType({
              type: Scalars.string,
            }),
            before: new JomqlInputFieldType({
              type: Scalars.string,
            }),
            sortBy: new JomqlInputFieldType({
              type: new JomqlScalarType(sortByScalarDefinition, true),
              arrayOptions: {
                allowNullElement: false,
              },
            }),
            sortDesc: new JomqlInputFieldType({
              type: Scalars.boolean,
              arrayOptions: {
                allowNullElement: false,
              },
            }),
            filterBy: new JomqlInputFieldType({
              type: new JomqlInputType(filterByTypeDefinition, true),
            }),
            groupBy: new JomqlInputFieldType({
              type: new JomqlScalarType(groupByScalarDefinition, true),
              arrayOptions: {
                allowNullElement: false,
              },
            }),
            ...(hasSearchFields && {
              search: new JomqlInputFieldType({
                type: Scalars.string,
              }),
            }),
          },
          inputsValidator: (args, fieldPath) => {
            // check for invalid first/last, before/after combos

            // after
            if (!isObject(args)) {
              throw new JomqlArgsError({
                message: `Args required`,
                fieldPath,
              });
            }

            if ("after" in args) {
              if (!("first" in args))
                throw new JomqlArgsError({
                  message: `Cannot use after without first`,
                  fieldPath,
                });
              if ("last" in args || "before" in args)
                throw new JomqlArgsError({
                  message: `Cannot use after with last/before`,
                  fieldPath,
                });
            }

            // first
            if ("first" in args) {
              if ("last" in args || "before" in args)
                throw new JomqlArgsError({
                  message: `Cannot use after with last/before`,
                  fieldPath,
                });
            }

            // before
            if ("before" in args) {
              if (!("last" in args))
                throw new JomqlArgsError({
                  message: `Cannot use before without last`,
                  fieldPath,
                });
            }

            // last
            if ("last" in args) {
              if (!("before" in args))
                throw new JomqlArgsError({
                  message: `Cannot use before without last`,
                  fieldPath,
                });
            }

            if (!("first" in args) && !("last" in args))
              throw new JomqlArgsError({
                message: `One of first or last required`,
                fieldPath,
              });
          },
        },
        true
      ),
    }),
    resolver: rootResolverFunction ?? resolverFunction,
  };
}
