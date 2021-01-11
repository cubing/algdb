import {
  TypeDefinition,
  TypeDefinitionField,
  ScalarDefinition,
  InputTypeDefinition,
} from "jomql";
import * as Resolver from "./resolver";
import { deepAssign, isObject, capitalizeString } from "./shared";
import { DataTypes, Sequelize, DataType } from "sequelize";
import { BaseService, NormalService, PaginatedService } from "../core/services";

import * as Scalars from "../scalars";
import { TypeDefCustomOptions } from "../../types";

/*
 ** Standard Fields
 */

// generic field builder
export function generateStandardField(params: {
  name?: string;
  allowNull: boolean;
  isArray?: boolean;
  hidden?: boolean;
  defaultValue?: unknown;
  sqlType: DataType;
  type: ScalarDefinition | string;
  sqlDefinition?: object;
  customOptions?: object;
  mysqlOptions?: object;
  typeDefOptions?: Partial<TypeDefinitionField>;
}) {
  const {
    name,
    allowNull,
    isArray = false,
    hidden = false,
    defaultValue,
    sqlType,
    type,
    sqlDefinition,
    customOptions = { addable: true, updateable: true },
    mysqlOptions,
    typeDefOptions,
  } = params;
  const typeDef = {
    type: type,
    isArray: isArray,
    allowNull: allowNull,
    required: defaultValue === undefined && !allowNull,
    customOptions: <TypeDefCustomOptions>{
      mysqlOptions: {
        sqlDefinition: {
          type: sqlType,
          allowNull: allowNull,
          ...(!!defaultValue && { defaultValue: defaultValue }),
          ...sqlDefinition,
        },
        ...mysqlOptions,
      },
      ...customOptions,
    },
    hidden,
    ...typeDefOptions,
  };
  return name
    ? {
        [name]: typeDef,
      }
    : typeDef;
}

export function generateStringField(params: {
  name?: string;
  allowNull: boolean;
  defaultValue?: unknown;
  hidden?: boolean;
  type?: ScalarDefinition;
  sqlDefinition?: object;
  customOptions?: object;
  mysqlOptions?: object;
  typeDefOptions?: object;
}) {
  const {
    name,
    allowNull = true,
    defaultValue,
    hidden,
    type,
    sqlDefinition,
    customOptions,
    mysqlOptions,
  } = params;
  return generateStandardField({
    name,
    allowNull: allowNull,
    defaultValue,
    hidden,
    sqlType: DataTypes.STRING,
    type: type ?? Scalars.string,
    sqlDefinition,
    customOptions,
    mysqlOptions,
  });
}

// as UNIX timestamp
export function generateDateField(params: {
  name?: string;
  allowNull: boolean;
  defaultValue?: unknown;
  hidden?: boolean;
  sqlDefinition?: object;
  customOptions?: object;
}) {
  const {
    name,
    allowNull = true,
    defaultValue,
    hidden,
    sqlDefinition,
    customOptions,
  } = params;
  return generateStandardField({
    name,
    allowNull: allowNull,
    defaultValue,
    hidden,
    sqlType: DataTypes.DATE,
    type: Scalars.unixTimestamp,
    sqlDefinition,
    customOptions,
    mysqlOptions: { getter: (field) => "UNIX_TIMESTAMP(" + field + ")" },
  });
}

export function generateTextField(params: {
  name?: string;
  allowNull: boolean;
  defaultValue?: unknown;
  hidden?: boolean;
  sqlDefinition?: object;
  customOptions?: object;
}) {
  const {
    name,
    allowNull = true,
    defaultValue,
    hidden,
    sqlDefinition,
    customOptions,
  } = params;
  return generateStandardField({
    name,
    allowNull: allowNull,
    defaultValue,
    hidden,
    sqlType: DataTypes.TEXT,
    type: Scalars.string,
    sqlDefinition,
    customOptions,
  });
}

export function generateJsonAsStringField(params: {
  name?: string;
  allowNull: boolean;
  hidden?: boolean;
  defaultValue?: unknown;
  sqlDefinition?: object;
  customOptions?: object;
}) {
  const {
    name,
    allowNull = true,
    defaultValue,
    hidden,
    sqlDefinition,
    customOptions,
  } = params;
  return generateStandardField({
    name,
    allowNull: allowNull,
    defaultValue,
    hidden,
    isArray: false,
    sqlType: DataTypes.TEXT,
    type: Scalars.jsonAsString,
    sqlDefinition,
    customOptions,
  });
}

export function generateIntegerField(params: {
  name?: string;
  allowNull: boolean;
  defaultValue?: unknown;
  hidden?: boolean;
  sqlDefinition?: object;
  customOptions?: object;
}) {
  const {
    name,
    allowNull = true,
    defaultValue,
    hidden,
    sqlDefinition,
    customOptions,
  } = params;
  return generateStandardField({
    name,
    allowNull: allowNull,
    defaultValue,
    hidden,
    isArray: false,
    sqlType: DataTypes.INTEGER,
    type: Scalars.number,
    sqlDefinition,
    customOptions,
  });
}

export function generateFloatField(params: {
  name?: string;
  allowNull: boolean;
  defaultValue?: unknown;
  hidden?: boolean;
  sqlDefinition?: object;
  customOptions?: object;
}) {
  const {
    name,
    allowNull = true,
    defaultValue,
    hidden,
    sqlDefinition,
    customOptions,
  } = params;
  return generateStandardField({
    name,
    allowNull: allowNull,
    defaultValue,
    hidden,
    isArray: false,
    sqlType: DataTypes.FLOAT(11, 1),
    type: Scalars.number,
    sqlDefinition,
    customOptions,
  });
}

export function generateDecimalField(params: {
  name?: string;
  allowNull: boolean;
  defaultValue?: unknown;
  hidden?: boolean;
  sqlDefinition?: object;
  customOptions?: object;
}) {
  const {
    name,
    allowNull = true,
    defaultValue,
    hidden,
    sqlDefinition,
    customOptions,
  } = params;
  return generateStandardField({
    name,
    allowNull: allowNull,
    defaultValue,
    hidden,
    isArray: false,
    sqlType: DataTypes.DECIMAL(11, 2),
    type: Scalars.number,
    sqlDefinition,
    customOptions,
  });
}

export function generateBooleanField(params: {
  name?: string;
  allowNull: boolean;
  defaultValue?: unknown;
  hidden?: boolean;
  sqlDefinition?: object;
  customOptions?: object;
}) {
  const {
    name,
    allowNull = true,
    defaultValue,
    hidden,
    sqlDefinition,
    customOptions,
  } = params;
  return generateStandardField({
    name,
    allowNull: allowNull,
    defaultValue,
    hidden,
    isArray: false,
    sqlType: DataTypes.BOOLEAN,
    type: Scalars.boolean,
    sqlDefinition,
    customOptions,
  });
}

// should handle kenums too
export function generateEnumField(params: {
  name?: string;
  scalarDefinition: ScalarDefinition;
  allowNull: boolean;
  hidden?: boolean;
  defaultValue?: unknown;
  sqlDefinition?: object;
  customOptions?: object;
}) {
  const {
    name,
    allowNull = true,
    defaultValue,
    hidden,
    scalarDefinition,
    sqlDefinition,
    customOptions,
  } = params;

  // if scalarDefinition.parseValue, run that on defaultValue

  return generateStandardField({
    name,
    allowNull: allowNull,
    defaultValue: scalarDefinition.parseValue
      ? scalarDefinition.parseValue(defaultValue, [])
      : defaultValue,
    hidden,
    isArray: false,
    sqlType: DataTypes.STRING,
    type: scalarDefinition,
    sqlDefinition,
    customOptions,
  });
}

/*
 ** Field Helpers (Commonly used fields)
 */

export function generateCreatedAtField() {
  return generateDateField({
    name: "created_at",
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    customOptions: { addable: false, updateable: false }, // not addable or updateable
  });
}

export function generateUpdatedAtField() {
  return generateDateField({
    name: "updated_at",
    allowNull: true,
    customOptions: { addable: false, updateable: false }, // not addable or updateable
  });
}

export function generateIdField() {
  return generateStandardField({
    name: "id",
    allowNull: false,
    isArray: false,
    sqlType: DataTypes.INTEGER,
    type: Scalars.id,
    sqlDefinition: { autoIncrement: true, primaryKey: true },
    customOptions: { addable: false, updateable: false }, // not addable or updateable
  });
}

export function generateCreatedByField(service: NormalService) {
  return generateJoinableField({
    name: "created_by",
    allowNull: false,
    service,
    customOptions: { addable: false, updateable: false }, // not addable or updateable
  });
}

export function generateJoinableField(params: {
  name?: string;
  allowNull: boolean;
  service: NormalService;
  sqlDefinition?: object;
  customOptions?: object;
}) {
  const {
    name,
    allowNull = true,
    service,
    sqlDefinition,
    customOptions,
  } = params;
  return generateStandardField({
    name,
    allowNull: allowNull,
    sqlType: DataTypes.INTEGER,
    type: service.typename,
    sqlDefinition,
    customOptions,
    mysqlOptions: {
      joinInfo: {
        type: service.typename,
      },
    },
  });
}

// alternative strategy for "joins"
export function generateDataloadableField(params: {
  name?: string;
  allowNull: boolean;
  service: NormalService;
  sqlDefinition?: object;
  customOptions?: object;
}) {
  const {
    name,
    allowNull = true,
    service,
    sqlDefinition,
    customOptions,
  } = params;
  return generateStandardField({
    name,
    allowNull: allowNull,
    sqlType: DataTypes.INTEGER,
    type: service.typename,
    sqlDefinition,
    customOptions,
    typeDefOptions: {
      dataloader: (req, args, query, typename, currentObject) => {
        // aggregator function that must accept args = { id: [] }
        return Resolver.resolveTableRows(service.typename, req, query, {
          where: { fields: [{ field: "id", value: args.id }] },
        });
      },
    },
  });
}

// should work for *most* cases
// returns resolver object instead of a typeDef because it is also used to generate the rootResolver
export function generatePaginatorPivotResolverObject(params: {
  name?: string;
  pivotService: PaginatedService;
  currentService?: BaseService;
}) {
  const { name, pivotService, currentService } = params;

  const filterByField = currentService
    ? currentService.typename.toLowerCase()
    : null;

  const sortByScalarDefinition: ScalarDefinition = {
    name: pivotService.typename + "SortBy",
    types: Object.keys(pivotService.sortFieldsMap).map((ele) => `"${ele}"`),
    parseValue: (value, typename) => {
      if (typeof value !== "string" || !(value in pivotService.sortFieldsMap))
        throw new Error("Invalid sortBy key");
      return value;
    },
  };

  const filterByScalarDefinition: ScalarDefinition = {
    name: pivotService.typename + "FilterByFields",
    types: Object.keys(pivotService.filterFieldsMap).map((ele) => `"${ele}"`),
    parseValue: (value: unknown, typename) => {
      // must be string
      if (typeof value !== "string")
        throw new Error("FilterBy key must be string");

      // check if field is in filterFieldsMap
      if (value && !(value in pivotService.filterFieldsMap)) {
        throw new Error("Invalid filterBy key");
      }

      return value;
    },
  };

  const filterByTypeDefinition: InputTypeDefinition = {
    name: pivotService.typename + "FilterByObject",
    fields: {
      field: {
        type: filterByScalarDefinition,
        required: true,
        isArray: false,
      },
      operator: {
        type: Scalars.filterOperator,
        required: false,
        isArray: false,
      },
      value: {
        type: Scalars.unknown,
        required: true,
        isArray: false,
      },
    },
  };

  const groupByScalarDefinition: ScalarDefinition = {
    name: pivotService.typename + "GroupBy",
    types: Object.keys(pivotService.groupByFieldsMap).map((ele) => `"${ele}"`),
    parseValue: (value, typename) => {
      if (
        typeof value !== "string" ||
        !(value in pivotService.groupByFieldsMap)
      )
        throw new Error("Invalid groupBy key");
      return value;
    },
  };

  const resolverFunction = filterByField
    ? (req, args, query, typename, currentObject) => {
        const { __args: extractedArgs, ...extractedQuery } = query;
        return pivotService.paginator.getRecord(
          req,
          deepAssign(
            { ...extractedArgs },
            {
              filterBy: [
                {
                  field: filterByField,
                  value: currentObject.id,
                },
              ],
            }
          ),
          extractedQuery
        );
      }
    : (req, query, args) => pivotService.paginator.getRecord(req, query, args);

  return {
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
          filterBy: { type: filterByTypeDefinition, isArray: true },
          groupBy: { type: groupByScalarDefinition, isArray: true },
          search: { type: Scalars.string },
        },
        inputsValidator: (args, fieldPath) => {
          // check for invalid first/last, before/after combos
          // after
          const fieldString = ["root"].concat(...fieldPath).join(".");
          const errorMessageSuffix = ` for args on field '${fieldString}'`;

          if (!isObject(args)) {
            throw new Error("Args required" + errorMessageSuffix);
          }

          if ("after" in args) {
            if (!("first" in args))
              throw new Error(
                "Cannot use after without first" + errorMessageSuffix
              );
            if ("last" in args || "before" in args)
              throw new Error(
                "Cannot use after with last/before" + errorMessageSuffix
              );
          }

          // first
          if ("first" in args) {
            if ("last" in args || "before" in args)
              throw new Error(
                "Cannot use after with last/before" + errorMessageSuffix
              );
          }

          // before
          if ("before" in args) {
            if (!("last" in args))
              throw new Error(
                "Cannot use before without last" + errorMessageSuffix
              );
          }

          // last
          if ("last" in args) {
            if (!("before" in args))
              throw new Error(
                "Cannot use before without last" + errorMessageSuffix
              );
          }

          if (!("first" in args) && !("last" in args))
            throw new Error(
              "One of first or last required" + errorMessageSuffix
            );
        },
      },
    },
    resolver: resolverFunction,
  };
}
