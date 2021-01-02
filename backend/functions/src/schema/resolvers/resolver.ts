import {
  generateJomqlResolverTree,
  processJomqlResolverTree,
  handleAggregatedQueries,
  TypeDefinition,
  JomqlResolverObject,
  validateResultFields,
} from "jomql";

import * as mysqlHelper from "../helpers/mysql";
import { typeDefs } from "../typeDefs";
import {
  SqlQuerySelectObject,
  SqlWhereObject,
  SqlParams,
  SqlSelectQueryOutput,
  TypeDefSqlOptions,
} from "../../types";

export type CustomResolver = {
  resolver: Function;
  value?: any;
};

export type CustomResolverMap = {
  [x: string]: CustomResolver;
};

function collapseObject(obj: SqlSelectQueryOutput) {
  const returnObject: SqlSelectQueryOutput = {};
  const checkArray: string[] = [];

  for (const field in obj) {
    if (field.includes(".")) {
      //const fieldParts = field.split('.');
      const firstPart = field.substr(0, field.indexOf("."));
      const secondPart = field.substr(field.indexOf(".") + 1);
      if (!(firstPart in returnObject)) {
        returnObject[firstPart] = {};
        checkArray.push(firstPart);
      }

      returnObject[firstPart][secondPart] = obj[field];
    } else {
      //if the field is id and it is null, return null
      if (field === "id" && obj[field] === null) {
        return null;
      }
      returnObject[field] = obj[field];
    }
  }

  checkArray.forEach((field) => {
    returnObject[field] = collapseObject(returnObject[field]);
  });

  return returnObject;
}

function collapseObjectArray(objArray: SqlSelectQueryOutput[]) {
  return objArray.map((obj) => collapseObject(obj));
}

//validates the add fields, and then does the add operation
export async function addTableRow(
  typename: string,
  req,
  args,
  rawFields = {},
  ignore = false
) {
  const typeDef: TypeDefinition | undefined = typeDefs.get(typename);
  if (!typeDef)
    throw new Error(`Invalid TypeDefinition for type '${typename}'`);

  // assemble the mysql fields
  const sqlFields = {};

  // handle the custom setters
  const customResolvers: CustomResolverMap = {};

  for (const field in args) {
    if (field in typeDef) {
      // skip if not addable -- a failsafe, since args validation should already catch this
      if (!typeDef[field].customOptions?.addable) {
        throw new Error(`Field not addable: '${field}'`);
      }

      // if finalValue is null, see if that is allowed
      validateResultFields(args[field], typeDef[field], [field]);

      // if it is a mysql field, add to mysqlFields
      if (typeDef[field].customOptions?.mysqlOptions) {
        sqlFields[field] = args[field];
      }

      // if it has a custom updater, add to customResolvers
      const customResolver = typeDef[field].updater;
      if (customResolver) {
        customResolvers[field] = {
          resolver: customResolver,
          value: args[field],
        };
      }
    }
  }

  // process adminFields -- will not check for addable for these
  /*
  for (const field in adminFields) {
    if (field in typeDef) {
      const type = typeDef[field].type;

      // if it is a scalar definition, use the parseValue function (if available) as a setter
      const finalValue =
        isScalarDefinition(type) && type.parseValue
          ? await type.parseValue(adminFields[field], field)
          : adminFields[field];

      // if finalValue is null, see if that is allowed
      if (
        finalValue === null ||
        (finalValue === undefined && !typeDef[field].allowNull)
      ) {
        throw new Error("Null value not allowed for field: '" + field + "'");
      }

      // if it is a mysql field, add to mysqlFields
      if (typeDef[field].mysqlOptions) {
        sqlFields[field] = finalValue;
      }

      // if it has a custom setter, add to customResolvers
      const customSetter = typeDef[field].setter;
      if (customSetter) {
        customResolvers[field] = {
          resolver: customSetter,
          value: finalValue,
        };
      }
    }
  }
  */

  let addedResults;

  // do the mysql fields first, if any
  if (Object.keys(sqlFields).length > 0) {
    addedResults = await mysqlHelper.insertTableRow(
      typename,
      sqlFields,
      rawFields,
      ignore
    );
  }

  const resultObject = {
    id: addedResults.insertId,
  };

  // handle the custom setter functions, which might rely on id of created object
  for (const field in customResolvers) {
    await customResolvers[field].resolver(
      typename,
      req,
      customResolvers[field].value,
      resultObject
    );
  }

  return resultObject;
}

// validates the update fields, and then does the update operation
export async function updateTableRow(
  typename: string,
  req,
  args,
  rawFields = {},
  whereObject: SqlWhereObject
) {
  //resolve the setters
  const typeDef: TypeDefinition | undefined = typeDefs.get(typename);
  if (!typeDef) throw new Error("Invalid TypeDef: " + typename);

  //assemble the mysql fields
  const sqlFields = {};

  //handle the custom setters
  const customResolvers: CustomResolverMap = {};

  for (const field in args) {
    if (field in typeDef) {
      // skip if not updateable -- a failsafe, since args validation should already catch this
      if (!typeDef[field].customOptions?.updateable) {
        throw new Error(`Field not updateable: '${field}'`);
      }

      // if finalValue is null, see if that is allowed
      validateResultFields(args[field], typeDef[field], [field]);

      // if it is a mysql field, add to mysqlFields
      if (typeDef[field].customOptions?.mysqlOptions) {
        sqlFields[field] = args[field];
      }

      // if it has a custom updater, add to customResolvers
      const customResolver = typeDef[field].updater;
      if (customResolver) {
        customResolvers[field] = {
          resolver: customResolver,
          value: args[field],
        };
      }
    }
  }

  // do the mysql first, if any fields
  if (Object.keys(sqlFields).length > 0) {
    await mysqlHelper.updateTableRow(
      typename,
      sqlFields,
      rawFields,
      whereObject
    );
  }

  const resultObject = {
    id: args.id,
  };

  //handle the custom setter functions, which might rely on primary keys
  for (const field in customResolvers) {
    await customResolvers[field].resolver(
      typename,
      req,
      customResolvers[field].value,
      resultObject
    );
  }

  return resultObject;
}

// performs the delete operation
export async function deleteTableRow(
  typename: string,
  req,
  args,
  whereObject: SqlWhereObject
) {
  //resolve the deleters
  const typeDef: TypeDefinition | undefined = typeDefs.get(typename);
  if (!typeDef) throw new Error("Invalid TypeDef: " + typename);

  //handle the custom deleters
  const customResolvers: CustomResolverMap = {};

  for (const field in typeDef) {
    // if it has a custom deleter, add to customResolvers
    const customResolver = typeDef[field].deleter;
    if (customResolver) {
      customResolvers[field] = {
        resolver: customResolver,
      };
    }
  }

  // do the mysql first
  await mysqlHelper.removeTableRow(typename, whereObject);

  const resultObject = {
    id: args.id,
  };

  //handle the custom deleter functions, which might rely on primary keys
  for (const field in customResolvers) {
    await customResolvers[field].resolver(typename, req, null, resultObject);
  }

  return resultObject;
}

export async function resolveTableRows(
  typename: string,
  req,
  externalQuery: { [x: string]: any },
  sqlParams: SqlParams,
  args = {},
  externalTypeDef?: TypeDefinition
) {
  // shortcut: if no fields were requested, simply return typename
  if (Object.keys(externalQuery).length < 1) return [{ __typename: typename }];

  const typeDef: TypeDefinition | undefined =
    externalTypeDef ?? typeDefs.get(typename);
  if (!typeDef) throw new Error(`Invalid TypeDef: ${typename}`);

  // convert externalQuery into a resolver tree
  const jomqlResolverTree = generateJomqlResolverTree(externalQuery, typeDef);
  // convert jomqlResolverTree into a validatedSqlQuery
  const validatedSqlSelectArray = generateSqlQuerySelectObject(
    jomqlResolverTree
  );

  const sqlQuery = {
    select: validatedSqlSelectArray,
    from: typename,
    ...sqlParams,
  };

  const returnArray: SqlSelectQueryOutput[] = collapseObjectArray(
    await mysqlHelper.fetchTableRows(sqlQuery)
  );

  // finish processing jomqlResolverTree
  for (const returnObject of returnArray) {
    await processJomqlResolverTree(
      returnObject,
      jomqlResolverTree,
      typename,
      req,
      args
    );
  }

  // handle aggregated fields
  await handleAggregatedQueries(
    returnArray,
    jomqlResolverTree,
    typename,
    req,
    args
  );

  return returnArray;
}

function generateSqlQuerySelectObject(
  jomqlResolverTree: JomqlResolverObject,
  parentFields: string[] = []
) {
  const sqlSelectObjectArray: SqlQuerySelectObject[] = [];
  for (const field in jomqlResolverTree) {
    const nested = jomqlResolverTree[field].nested;
    const mysqlOptions = <TypeDefSqlOptions | undefined>(
      jomqlResolverTree[field].typeDef.customOptions?.mysqlOptions
    );
    if (mysqlOptions) {
      // if nested with no resolver and no dataloader
      if (
        nested &&
        !jomqlResolverTree[field].typeDef.resolver &&
        !jomqlResolverTree[field].typeDef.dataloader
      ) {
        sqlSelectObjectArray.push(
          ...generateSqlQuerySelectObject(nested, parentFields.concat(field))
        );
      } else {
        // if not root level AND joinHidden, throw error
        if (parentFields.length && mysqlOptions.joinHidden) {
          throw new Error(
            `Invalid Query: Requested field not allowed to be accessed directly in an nested context: '${parentFields
              .concat(field)
              .join(".")}'`
          );
        } else {
          sqlSelectObjectArray.push({
            field: parentFields.concat(field).join("."),
          });
        }
      }
    }
  }

  return sqlSelectObjectArray;
}

export function countTableRows(typename: string, whereObject: SqlWhereObject) {
  // validation of whereArray must happen in the application logic
  return mysqlHelper.countTableRows(typename, whereObject);
}
