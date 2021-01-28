import {
  TypeDefinitionField,
  ScalarDefinition,
  InputTypeDefinition,
  ArgDefinition,
  ResolverFunction,
  RootResolverFunction,
  JomqlArgsError,
  lookupSymbol,
} from "jomql";
import * as Resolver from "./resolver";
import { deepAssign, isObject, capitalizeString } from "./shared";
import { DataTypes, Sequelize, DataType } from "sequelize";
import { BaseService, NormalService, PaginatedService } from "../core/services";
import { linkDefs } from "../links";
import * as Scalars from "../scalars";
import { typeDefs } from "../typeDefs";
import { JomqlInitializationError } from "jomql/lib/classes";
import type { TypeDefSqlOptions } from "../../types";

type GenerateFieldParams = {
  name?: string;
  description?: string;
  allowNull: boolean;
  hidden?: boolean;
  defaultValue?: unknown;
  sqlDefinition?: Partial<any>;
  mysqlOptions?: Partial<TypeDefSqlOptions>;
  typeDefOptions?: Partial<TypeDefinitionField>;
};

/*
 ** Standard Fields
 */

// generic field builder
export function generateStandardField(
  params: {
    sqlType?: DataType;
    type: ScalarDefinition | string;
    isArray: boolean;
  } & GenerateFieldParams
) {
  const {
    name,
    description,
    allowNull,
    isArray = false,
    hidden = false,
    defaultValue,
    sqlType,
    type,
    sqlDefinition,
    mysqlOptions,
    typeDefOptions,
  } = params;
  const typeDef = <TypeDefinitionField>{
    type,
    description,
    isArray,
    allowNull,
    required: defaultValue === undefined && !allowNull,
    mysqlOptions: sqlType
      ? {
          sqlDefinition: {
            type: sqlType,
            allowNull,
            ...(!!defaultValue && { defaultValue: defaultValue }),
            ...sqlDefinition,
          },
          ...mysqlOptions,
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
    type: ScalarDefinition;
    isArray?: boolean;
  } & GenerateFieldParams
) {
  const {
    name,
    description,
    allowNull = true,
    isArray = false,
    defaultValue,
    hidden,
    type,
    sqlDefinition,
    mysqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull,
    isArray,
    defaultValue,
    hidden,
    type: type ?? Scalars.string,
    sqlDefinition,
    mysqlOptions,
    typeDefOptions,
  });
}

export function generateStringField(
  params: {
    type?: ScalarDefinition;
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
    mysqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull,
    isArray: false,
    defaultValue,
    hidden,
    sqlType: DataTypes.STRING,
    type: type ?? Scalars.string,
    sqlDefinition,
    mysqlOptions,
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
    mysqlOptions,
    typeDefOptions,
    nowOnly,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull: allowNull,
    isArray: false,
    defaultValue,
    hidden,
    sqlType: DataTypes.DATE,
    type: Scalars.unixTimestamp,
    sqlDefinition,
    mysqlOptions: {
      getter: (field) => "UNIX_TIMESTAMP(" + field + ")",
      setter: nowOnly
        ? () => "now()"
        : (field) => "FROM_UNIXTIME(" + field + ")",
      ...mysqlOptions,
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
    mysqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull: allowNull,
    isArray: false,
    hidden,
    sqlType: DataTypes.TEXT,
    type: Scalars.string,
    sqlDefinition,
    mysqlOptions,
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
    mysqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull,
    defaultValue,
    hidden,
    isArray: false,
    sqlType: DataTypes.INTEGER,
    type: Scalars.number,
    sqlDefinition,
    mysqlOptions,
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
    mysqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull,
    defaultValue,
    hidden,
    isArray: false,
    sqlType: DataTypes.FLOAT(11, 1),
    type: Scalars.number,
    sqlDefinition,
    mysqlOptions,
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
    mysqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull,
    defaultValue,
    hidden,
    isArray: false,
    sqlType: DataTypes.DECIMAL(11, 2),
    type: Scalars.number,
    sqlDefinition,
    mysqlOptions,
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
    mysqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull,
    defaultValue,
    hidden,
    isArray: false,
    sqlType: DataTypes.BOOLEAN,
    type: Scalars.boolean,
    sqlDefinition,
    mysqlOptions,
    typeDefOptions,
  });
}

// array of strings, stored in mysql as JSON
export function generateArrayField(
  params: {
    type: ScalarDefinition;
  } & GenerateFieldParams
) {
  const {
    name,
    description,
    allowNull = true,
    hidden,
    type,
    sqlDefinition,
    mysqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    isArray: true,
    allowNull: allowNull,
    hidden,
    sqlType: DataTypes.TEXT,
    type,
    sqlDefinition,
    mysqlOptions: {
      parseValue: (val) => JSON.stringify(val),
      ...mysqlOptions,
    },
    typeDefOptions: {
      resolver({ fieldPath, fieldValue }): ResolverFunction {
        return fieldValue ? JSON.parse(fieldValue) : [];
      },
      ...typeDefOptions,
    },
  });
}

// should handle kenums too
export function generateEnumField(
  params: {
    scalarDefinition: ScalarDefinition;
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
    mysqlOptions,
    typeDefOptions,
  } = params;

  // if scalarDefinition.parseValue, run that on defaultValue

  return generateStandardField({
    name,
    description,
    allowNull: allowNull,
    defaultValue:
      scalarDefinition.parseValue && defaultValue !== undefined
        ? scalarDefinition.parseValue(defaultValue)
        : defaultValue,
    hidden,
    isArray: false,
    sqlType: DataTypes.STRING,
    type: scalarDefinition,
    sqlDefinition,
    mysqlOptions,
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
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
    isArray: false,
    sqlType: DataTypes.INTEGER,
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
    isArray: false,
    type: Scalars.string,
    typeDefOptions: {
      resolver: () => service.typename,
      args: {
        type: {
          fields: {
            format: {
              type: Scalars.number,
            },
          },
        },
      },
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
    mysqlOptions,
    sqlDefinition,
    typeDefOptions,
    service,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull,
    isArray: false,
    defaultValue,
    hidden,
    sqlType: DataTypes.INTEGER,
    type: service.typename,
    sqlDefinition,
    typeDefOptions,
    mysqlOptions: {
      joinInfo: {
        type: service.typename,
      },
      ...mysqlOptions,
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
    mysqlOptions,
    typeDefOptions,
  } = params;
  return generateStandardField({
    name,
    description,
    allowNull,
    defaultValue,
    hidden,
    isArray: false,
    sqlType: DataTypes.INTEGER,
    type: service.typename,
    sqlDefinition,
    mysqlOptions,
    typeDefOptions: {
      defer: true,
      dataloader: ({ req, args, query, currentObject, fieldPath, data }) => {
        // aggregator function that must accept data.idArray = [1, 2, 3, ...]
        return Resolver.resolveTableRows(
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

  // populate the fields nextTick, to allow typeDefs to load
  process.nextTick(() => {
    Object.entries(pivotService.filterFieldsMap).reduce(
      (total, [filterKey, filterValue]) => {
        const actualFilterKey = filterValue.field ?? filterKey;
        // traverse the fields to find the scalarDefinition
        const keyParts = actualFilterKey.split(".");
        let currentType;
        let currentTypeDef = pivotService.typeDef;
        keyParts.forEach((keyPart, keyIndex) => {
          if (keyPart in currentTypeDef.fields) {
            currentType = currentTypeDef.fields[keyPart].type;
          } else {
            // to-do: handle linked types
            // look in link fields and generate required joins
            linkDefs.forEach((linkDef, linkName) => {
              if (
                linkDef.types.has(keyPart) &&
                linkDef.types.has(currentTypeDef.name)
              ) {
                currentType = keyPart;
              }
            });
          }

          // if currentType undefined, must be an unrecognized field
          if (!currentType)
            throw new JomqlInitializationError({
              message: `Invalid field '${filterKey}' on '${currentTypeDef.name}'`,
            });

          // if has next field and currentType is string, get and set the next typeDef
          if (keyParts[keyIndex + 1] && typeof currentType === "string") {
            const nextTypeDef = typeDefs.get(currentType);
            if (!nextTypeDef)
              throw new JomqlInitializationError({
                message: `Invalid typeDef ${currentType}`,
              });
            currentTypeDef = nextTypeDef;
          }
        });

        total[filterKey] = <ArgDefinition>{
          type: <InputTypeDefinition>{
            name: `${pivotService.typename}FilterByField/${filterKey}`,
            fields: {
              operator: <ArgDefinition>{
                type: Scalars.filterOperator,
                required: false,
                isArray: false,
              },
              value: <ArgDefinition>{
                type:
                  typeof currentType === "string"
                    ? `get${capitalizeString(currentType)}`
                    : currentType,
                required: true,
                isArray: false,
              },
            },
          },
          required: false,
          isArray: true,
        };
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
      // check if currentObject.id was requested
      let parentItemId = parentValue?.id ?? data.rootArgs?.args?.id;

      // if not available, must be looked up using non-id key, fetch
      if (!parentItemId) {
        const results = await currentService!.getRecord({
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
          { ...args },
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

  return <TypeDefinitionField>{
    type: pivotService.paginator.typename,
    isArray: false,
    allowNull: false,
    args: {
      required: true,
      type: {
        name: "get" + capitalizeString(pivotService.paginator.typename),
        fields: {
          first: { type: Scalars.number },
          last: { type: Scalars.number },
          after: { type: Scalars.string },
          before: { type: Scalars.string },
          sortBy: { type: sortByScalarDefinition, isArray: true },
          sortDesc: { type: Scalars.boolean, isArray: true },
          filterBy: { type: filterByTypeDefinition, isArray: false },
          groupBy: { type: groupByScalarDefinition, isArray: true },
          search: { type: Scalars.string },
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
    },
    resolver: rootResolverFunction ?? resolverFunction,
  };
}
