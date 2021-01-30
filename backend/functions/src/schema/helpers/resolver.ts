import {
  generateAnonymousRootResolver,
  generateJomqlResolverTree,
  processJomqlResolverTree,
  JomqlResolverNode,
  validateResultFields,
  JomqlQueryError,
  JomqlObjectType,
  objectTypeDefs,
  JomqlObjectTypeLookup,
  isRootResolverDefinition,
} from "jomql";

import * as mysqlHelper from "./mysql";
import {
  SqlQuerySelectObject,
  SqlWhereObject,
  SqlParams,
  SqlSelectQueryOutput,
} from "../../types";

import { isObject } from "../helpers/shared";
import type { Request } from "express";
export type CustomResolver = {
  resolver: Function;
  value?: any;
};

export type CustomResolverMap = {
  [x: string]: CustomResolver;
};

function collapseSqlOutput(
  obj: SqlSelectQueryOutput
): SqlSelectQueryOutput | null {
  const returnObject = {};
  const nestedFieldsSet: Set<string> = new Set();

  for (const field in obj) {
    if (field.match(/\./)) {
      const firstPart = field.substr(0, field.indexOf("."));
      const secondPart = field.substr(field.indexOf(".") + 1);

      // if field is set as null, skip
      if (returnObject[firstPart] === null) continue;

      // if field not in return object as object, set it
      if (!isObject(returnObject[firstPart])) {
        returnObject[firstPart] = {};
        nestedFieldsSet.add(firstPart);
      }

      // if secondPart is "id", set it to null
      if (secondPart === "id" && obj[field] === null) {
        returnObject[firstPart] = null;
        nestedFieldsSet.delete(firstPart);
        continue;
      }

      returnObject[firstPart][secondPart] = obj[field];
    } else {
      // leaf field, add to obj if not already set
      if (!(field in returnObject)) returnObject[field] = obj[field];
    }
  }

  // process the fields that are nested
  nestedFieldsSet.forEach((field) => {
    returnObject[field] = collapseSqlOutput(returnObject[field]);
  });
  return returnObject;
}

function collapseSqlOutputArray(objArray: SqlSelectQueryOutput[]) {
  return objArray.map((obj) => collapseSqlOutput(obj));
}

//validates the add fields, and then does the add operation
export async function addTableRow(
  typename: string,
  req,
  fieldPath: string[],
  args,
  rawFields = {},
  ignore = false
) {
  const typeDef = objectTypeDefs.get(typename);
  if (!typeDef)
    throw new Error(`Invalid TypeDefinition for type '${typename}'`);

  // assemble the mysql fields
  const sqlFields = {};

  // handle the custom setters
  const customResolvers: CustomResolverMap = {};

  for (const field in args) {
    if (field in typeDef.definition.fields) {
      // we are only checking this is args
      /*
      if (!typeDef.fields[field].addable) {
        throw new Error(`Field not addable: '${field}'`);
      }
      */

      // if finalValue is null, see if that is allowed -- also a failsafe
      validateResultFields(args[field], typeDef.definition.fields[field], [
        field,
      ]);

      // if it is a mysql field, add to mysqlFields
      if (typeDef.definition.fields[field].mysqlOptions) {
        sqlFields[field] = args[field];
      }

      // if it has a custom updater, add to customResolvers
      const customResolver = typeDef.definition.fields[field].updater;
      if (customResolver) {
        customResolvers[field] = {
          resolver: customResolver,
          value: args[field],
        };
      }
    }
  }

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
  fieldPath: string[],
  args,
  rawFields = {},
  whereObject: SqlWhereObject
) {
  //resolve the setters
  const typeDef = objectTypeDefs.get(typename);
  if (!typeDef) throw new Error("Invalid TypeDef: " + typename);

  //assemble the mysql fields
  const sqlFields = {};

  //handle the custom setters
  const customResolvers: CustomResolverMap = {};

  for (const field in args) {
    if (field in typeDef.definition.fields) {
      // if finalValue is null, see if that is allowed -- also a failsafe
      validateResultFields(args[field], typeDef.definition.fields[field], [
        field,
      ]);

      // if it is a mysql field, add to mysqlFields
      if (typeDef.definition.fields[field].mysqlOptions) {
        sqlFields[field] = args[field];
      }

      // if it has a custom updater, add to customResolvers
      const customResolver = typeDef.definition.fields[field].updater;
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
  fieldPath: string[],
  args,
  whereObject: SqlWhereObject
) {
  //resolve the deleters
  const typeDef = objectTypeDefs.get(typename);
  if (!typeDef) throw new Error("Invalid TypeDef: " + typename);

  //handle the custom deleters
  const customResolvers: CustomResolverMap = {};

  for (const field in typeDef.definition.fields) {
    // if it has a custom deleter, add to customResolvers
    const customResolver = typeDef.definition.fields[field].deleter;
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
  fieldPath: string[],
  externalQuery: { [x: string]: any },
  sqlParams: SqlParams,
  data = {},
  externalTypeDef?: JomqlObjectType
) {
  // shortcut: if no fields were requested, simply return empty object
  if (Object.keys(externalQuery).length < 1) return [{}];

  const anonymousRootResolver = generateAnonymousRootResolver(
    externalTypeDef ?? new JomqlObjectTypeLookup(typename)
  );

  // build an anonymous root resolver
  const jomqlResolverTree = generateJomqlResolverTree(
    externalQuery,
    anonymousRootResolver,
    fieldPath
  );

  // convert jomqlResolverNode into a validatedSqlQuery
  const validatedSqlSelectArray = generateSqlQuerySelectObject(
    jomqlResolverTree,
    [],
    fieldPath
  );

  const sqlQuery = {
    select: validatedSqlSelectArray,
    from: typename,
    ...sqlParams,
  };

  const jomqlResultsTreeArray: SqlSelectQueryOutput[] = collapseSqlOutputArray(
    await mysqlHelper.fetchTableRows(sqlQuery)
  );

  // finish processing jomqlResolverNode by running the resolvers on the data fetched thru sql.
  const processedResultsTree = await Promise.all(
    jomqlResultsTreeArray.map((jomqlResultsTree) =>
      processJomqlResolverTree({
        jomqlResultsNode: jomqlResultsTree,
        jomqlResolverNode: jomqlResolverTree,
        req,
        data,
        fieldPath,
      })
    )
  );

  // handle aggregated fields -- must be nested query. cannot be array of scalars like [1, 2, 3, 4] at the moment
  if (jomqlResolverTree.nested) {
    await handleAggregatedQueries(
      processedResultsTree,
      jomqlResolverTree.nested,
      req,
      data,
      fieldPath
    );
  }

  return processedResultsTree;
}

function generateSqlQuerySelectObject(
  jomqlResolverNode: JomqlResolverNode,
  parentFields: string[] = [],
  fieldPath: string[]
) {
  const sqlSelectObjectArray: SqlQuerySelectObject[] = [];

  // if root resolver object, skip.
  if (isRootResolverDefinition(jomqlResolverNode.typeDef)) {
    return sqlSelectObjectArray;
  }
  const nested = jomqlResolverNode.nested;

  const mysqlOptions = jomqlResolverNode.typeDef.mysqlOptions;

  if (parentFields.length < 1 || mysqlOptions) {
    // if nested with no resolver and no dataloader
    if (
      nested &&
      !jomqlResolverNode.typeDef.resolver &&
      !jomqlResolverNode.typeDef.dataloader
    ) {
      let addIdField = true;
      let fieldsAdded = 0;
      for (const field in jomqlResolverNode.nested) {
        // indicate if we need to add the id field later
        if (field === "id") addIdField = false;

        const parentPlusCurrentField = parentFields.concat(field);
        const arrayToAdd = generateSqlQuerySelectObject(
          jomqlResolverNode.nested[field],
          parentPlusCurrentField,
          fieldPath
        );
        fieldsAdded += arrayToAdd.length;
        sqlSelectObjectArray.push(...arrayToAdd);
      }

      // if any sql fields requested at this node, add the id field if not already added
      if (fieldsAdded > 0 && addIdField) {
        sqlSelectObjectArray.push({
          field: parentFields.concat("id").join("."),
        });
      }
    } else {
      // if not root level AND joinHidden, throw error
      if (parentFields.length > 1 && mysqlOptions!.joinHidden) {
        throw new JomqlQueryError({
          message: `Requested field not allowed to be accessed directly in an nested context`,
          fieldPath: fieldPath.concat(parentFields),
        });
      } else {
        sqlSelectObjectArray.push({
          field: parentFields.join("."),
        });
      }
    }
  }

  return sqlSelectObjectArray;
}

export function countTableRows(typename: string, whereObject: SqlWhereObject) {
  return mysqlHelper.countTableRows(typename, whereObject);
}

async function handleAggregatedQueries(
  resultsArray: any[],
  nestedResolverNodeMap: { [x: string]: JomqlResolverNode },
  req: Request,
  args: any,
  data: any,
  fieldPath: string[] = []
) {
  for (const field in nestedResolverNodeMap) {
    const currentFieldPath = fieldPath.concat(field);
    // if root resolver object, skip.
    const typeDef = nestedResolverNodeMap[field].typeDef;
    if (isRootResolverDefinition(typeDef)) {
      continue;
    }

    const dataloaderFn = typeDef.dataloader;
    const nestedResolver = nestedResolverNodeMap[field].nested;
    if (dataloaderFn && nestedResolverNodeMap[field].query) {
      const keySet = new Set();

      // aggregate ids
      resultsArray.forEach((result) => {
        if (result) keySet.add(result[field]);
      });

      // set ids in data
      data.idArray = [...keySet];

      // lookup all the ids
      const aggregatedResults = await dataloaderFn({
        req,
        args,
        query: nestedResolverNodeMap[field].query!,
        currentObject: {},
        fieldPath: currentFieldPath,
        data,
      });

      // build id -> record map
      const recordMap = new Map();
      aggregatedResults.forEach((result: any) => {
        recordMap.set(result.id, result);
      });

      // join the records in memory
      resultsArray.forEach((result) => {
        if (result) result[field] = recordMap.get(result[field]);
      });
    } else if (nestedResolver) {
      // if field does not have a dataloader, it must be nested.
      // build the array of records that will need replacing and go deeper
      const nestedResultsArray = resultsArray.reduce((total: any[], result) => {
        if (result) total.push(result[field]);
        return total;
      }, []);

      await handleAggregatedQueries(
        nestedResultsArray,
        nestedResolver,
        req,
        args,
        data,
        currentFieldPath
      );
    }
  }
}
