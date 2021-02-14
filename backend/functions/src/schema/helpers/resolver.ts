import {
  generateAnonymousRootResolver,
  generateJomqlResolverTree,
  processJomqlResolverTree,
  JomqlResolverNode,
  JomqlQueryError,
  JomqlObjectType,
  objectTypeDefs,
  JomqlObjectTypeLookup,
  isRootResolverDefinition,
  JomqlBaseError,
} from "jomql";

import * as sqlHelper from "./sql";
import {
  SqlQuerySelectObject,
  SqlWhereObject,
  SqlParams,
  SqlSelectQueryOutput,
  CustomResolverFunction,
} from "../../types";

import { isObject } from "../helpers/shared";
import type { Request } from "express";

type CustomResolver = {
  resolver: CustomResolverFunction;
  value?: unknown;
};

type CustomResolverMap = {
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
export async function createObjectType({
  typename,
  req,
  fieldPath,
  addFields,
  ignore = false,
}: {
  typename: string;
  req: Request;
  fieldPath: string[];
  addFields: { [x: string]: unknown };
  ignore?: boolean;
}): Promise<any> {
  const typeDef = objectTypeDefs.get(typename);
  if (!typeDef) {
    throw new JomqlBaseError({
      message: `Invalid typeDef '${typename}'`,
      fieldPath,
    });
  }

  // assemble the mysql fields
  const sqlFields = {};

  // handle the custom setters
  const customResolvers: CustomResolverMap = {};

  for (const field in addFields) {
    if (!(field in typeDef.definition.fields)) {
      throw new JomqlBaseError({
        message: `Invalid field`,
        fieldPath,
      });
    }

    // if it is a mysql field, add to mysqlFields
    if (typeDef.definition.fields[field].sqlOptions) {
      sqlFields[field] = addFields[field];
    }

    // if it has a custom updater, add to customResolvers
    const customResolver = typeDef.definition.fields[field].updater;
    if (customResolver) {
      customResolvers[field] = {
        resolver: customResolver,
        value: addFields[field],
      };
    }
  }

  let addedResults;

  // do the mysql fields first, if any
  if (Object.keys(sqlFields).length > 0) {
    addedResults = await sqlHelper.insertTableRow(
      typename,
      sqlFields,
      fieldPath,
      ignore
    );
  }

  const resultObject = addedResults ? addedResults[0] : {};

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
export async function updateObjectType({
  typename,
  req,
  fieldPath,
  updateFields,
  id,
}: {
  typename: string;
  req: Request;
  fieldPath: string[];
  updateFields: { [x: string]: unknown };
  id: number;
}): Promise<any> {
  const typeDef = objectTypeDefs.get(typename);
  if (!typeDef) {
    throw new JomqlBaseError({
      message: `Invalid typeDef '${typename}'`,
      fieldPath,
    });
  }

  //assemble the mysql fields
  const sqlFields = {};

  //handle the custom setters
  const customResolvers: CustomResolverMap = {};

  for (const field in updateFields) {
    if (!(field in typeDef.definition.fields)) {
      throw new JomqlBaseError({
        message: `Invalid update field`,
        fieldPath,
      });
    }

    // if it is a mysql field, add to mysqlFields
    if (typeDef.definition.fields[field].sqlOptions) {
      sqlFields[field] = updateFields[field];
    }

    // if it has a custom updater, add to customResolvers
    const customResolver = typeDef.definition.fields[field].updater;
    if (customResolver) {
      customResolvers[field] = {
        resolver: customResolver,
        value: updateFields[field],
      };
    }
  }

  // do the mysql first, if any fields
  if (Object.keys(sqlFields).length > 0) {
    await sqlHelper.updateTableRow(
      typename,
      sqlFields,
      { fields: [{ field: "id", value: id }] },
      fieldPath
    );
  }

  const resultObject = {
    id,
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
export async function deleteObjectType({
  typename,
  req,
  fieldPath,
  id,
}: {
  typename: string;
  req: Request;
  fieldPath: string[];
  id: number;
}): Promise<any> {
  //resolve the deleters
  const typeDef = objectTypeDefs.get(typename);
  if (!typeDef) {
    throw new JomqlBaseError({
      message: `Invalid typeDef '${typename}'`,
      fieldPath,
    });
  }

  let hasSqlFields = false;

  //handle the custom deleters
  const customResolvers: CustomResolverMap = {};

  for (const field in typeDef.definition.fields) {
    // see if it has sql fields
    if (typeDef.definition.fields[field].sqlOptions && !hasSqlFields)
      hasSqlFields = true;

    // if it has a custom deleter, add to customResolvers
    const customResolver = typeDef.definition.fields[field].deleter;
    if (customResolver) {
      customResolvers[field] = {
        resolver: customResolver,
      };
    }
  }

  // do the mysql first
  if (hasSqlFields)
    await sqlHelper.removeTableRow(
      typename,
      { fields: [{ field: "id", value: id }] },
      fieldPath
    );

  const resultObject = {
    id,
  };

  //handle the custom deleter functions, which might rely on primary keys
  for (const field in customResolvers) {
    await customResolvers[field].resolver(typename, req, null, resultObject);
  }

  return resultObject;
}

export async function getObjectType(
  typename: string,
  req,
  fieldPath: string[],
  externalQuery: unknown,
  sqlParams: SqlParams,
  data = {},
  externalTypeDef?: JomqlObjectType
): Promise<unknown[]> {
  // shortcut: if no fields were requested, simply return empty object
  if (isObject(externalQuery) && Object.keys(externalQuery).length < 1)
    return [{}];

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
    await sqlHelper.fetchTableRows(sqlQuery, fieldPath)
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
    await handleAggregatedQueries({
      resultsArray: processedResultsTree,
      nestedResolverNodeMap: jomqlResolverTree.nested,
      req,
      data,
      fieldPath,
    });
  }

  return processedResultsTree;
}

export function countObjectType(
  typename: string,
  fieldPath: string[],
  whereObject: SqlWhereObject
): Promise<number> {
  return sqlHelper.countTableRows(typename, whereObject, fieldPath);
}

function generateSqlQuerySelectObject(
  jomqlResolverNode: JomqlResolverNode,
  parentFields: string[] = [],
  fieldPath: string[]
): SqlQuerySelectObject[] {
  const sqlSelectObjectArray: SqlQuerySelectObject[] = [];

  // if root resolver object, skip.
  if (isRootResolverDefinition(jomqlResolverNode.typeDef)) {
    return sqlSelectObjectArray;
  }
  const nested = jomqlResolverNode.nested;

  const sqlOptions = jomqlResolverNode.typeDef.sqlOptions;

  if (parentFields.length < 1 || sqlOptions) {
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
      if (parentFields.length > 1 && sqlOptions!.joinHidden) {
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

async function handleAggregatedQueries({
  resultsArray,
  nestedResolverNodeMap,
  req,
  args,
  data,
  fieldPath = [],
}: {
  resultsArray: any[];
  nestedResolverNodeMap: { [x: string]: JomqlResolverNode };
  req: Request;
  args?: unknown;
  data: any;
  fieldPath?: string[];
}): Promise<void> {
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
        query: nestedResolverNodeMap[field].query,
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

      await handleAggregatedQueries({
        resultsArray: nestedResultsArray,
        nestedResolverNodeMap: nestedResolver,
        req,
        args,
        data,
        fieldPath: currentFieldPath,
      });
    }
  }
}
