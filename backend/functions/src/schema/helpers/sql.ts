import { linkDefs } from "../links";
import { executeDBQuery, knex } from "../../utils/knex";
import { isDev } from "../../config";

import type {
  SqlQueryObject,
  SqlWhereObject,
  SqlJoinFieldObject,
  SqlSelectFieldObject,
  SqlGroupFieldObject,
  SqlSortFieldObject,
  SqlWhereFieldObject,
} from "../../types";
import { JomqlBaseError, JomqlObjectType, objectTypeDefs } from "jomql";
import e = require("express");

export type JoinsMap = {
  [x: string]: string[];
};

export type AssemblyFunction = (
  tableName: string,
  tableAlias: string,
  fieldname: string,
  fieldObject: any,
  fieldIndex: number,
  currentTypeDef: JomqlObjectType
) => string;

// options for knex to handle conflicts
export type InsertTableRowOptions = {
  onConflict: {
    columns: string[];
    action: "ignore" | "merge";
  };
};

function generateError(err: Error, fieldPath?: string[]) {
  const errMessage = isDev ? err.message : "A SQL error has occurred";
  console.log(err);
  return new JomqlBaseError({
    message: errMessage,
    fieldPath,
  });
}

export async function fetchTableRows(
  sqlQuery: SqlQueryObject,
  fieldPath?: string[]
) {
  try {
    if (sqlQuery.select.length < 1) {
      return [{}];
    }

    let whereStatement = "";
    let orderStatement = "";
    let limitStatement = "";
    let groupByStatement = "";
    let joinStatement = "";

    const params = {};

    const previousJoins: JoinsMap = {};

    // handle select statements
    const selectResults = processSelectArray(
      sqlQuery.from,
      sqlQuery.select.concat(sqlQuery.rawSelect ?? []),
      previousJoins
    );

    if (selectResults.statements.length < 1) throw new Error("Invalid SQL");

    joinStatement += selectResults.joinStatement;

    const selectStatement = selectResults.statements.join(", ");

    // handle where statements
    if (sqlQuery.where) {
      const whereResults = processWhereObject(
        sqlQuery.from,
        sqlQuery.where,
        previousJoins,
        params
      );

      whereStatement = whereResults.whereStatement;
      joinStatement += whereResults.joinStatement;
    }

    if (!whereStatement) {
      whereStatement = "true";
    }

    //handle orderBy statements
    //field MUST be pre-validated
    if (sqlQuery.orderBy) {
      const orderResults = processSortArray(
        sqlQuery.from,
        sqlQuery.orderBy,
        previousJoins
      );

      orderStatement += orderResults.statements.join(", ");
      joinStatement += orderResults.joinStatement;
    }

    //handle limit statement
    if (sqlQuery.limit) {
      limitStatement += " LIMIT " + sqlQuery.limit ?? 0;
    }

    //handle limit/offset statements
    if (sqlQuery.groupBy) {
      const groupResults = processGroupArray(
        sqlQuery.from,
        sqlQuery.groupBy,
        previousJoins
      );

      groupByStatement += groupResults.statements.join(", ");
      joinStatement += groupResults.joinStatement;
    }

    // if distinct flag set, generate the distinct statement
    let distinctStatement = "";
    if (sqlQuery.distinct && orderStatement) {
      distinctStatement += orderStatement.replace(
        /(\sDESC NULLS LAST)|(\sASC NULLS FIRST)/g,
        ""
      );
    }

    const sqlQueryString =
      `SELECT ${
        distinctStatement ? "DISTINCT ON(" + distinctStatement + ") " : ""
      }${selectStatement} FROM "${sqlQuery.from}" AS "${
        sqlQuery.from + "0"
      }"${joinStatement} WHERE ${whereStatement}` +
      (groupByStatement ? " GROUP BY " + groupByStatement : "") +
      (orderStatement ? " ORDER BY " + orderStatement : "") +
      limitStatement;

    // mix in any miscParams
    if (sqlQuery.miscParams) {
      Object.assign(params, sqlQuery.miscParams);
    }

    const results = await executeDBQuery(sqlQueryString, params);
    return results;
  } catch (err) {
    throw generateError(err, fieldPath);
  }
}

export async function countTableRows(
  table: string,
  whereObject: SqlWhereObject,
  distinct?: boolean,
  fieldPath?: string[]
) {
  try {
    let whereStatement = "";
    let joinStatement = "";
    const previousJoins: JoinsMap = {};
    const params = {};

    const selectStatement = `count(${
      distinct ? "DISTINCT " : ""
    }"${table}0".id) AS count`;

    //handle where statements
    const whereResults = processWhereObject(
      table,
      whereObject,
      previousJoins,
      params
    );

    whereStatement += whereResults.whereStatement;
    joinStatement += whereResults.joinStatement;

    if (!whereStatement) {
      whereStatement = "true";
    }

    const sqlQuery = `SELECT ${selectStatement} FROM "${table}" AS "${
      table + "0"
    }"${joinStatement} WHERE ${whereStatement}`;

    const results = await executeDBQuery(sqlQuery, params);

    return Number(results[0].count);
  } catch (err) {
    throw generateError(err, fieldPath);
  }
}

export async function insertTableRow(
  table: string,
  setFields,
  fieldPath?: string[],
  options?: InsertTableRowOptions
) {
  try {
    // check if there is a mysql setter on the field
    const currentTypeDef = objectTypeDefs.get(table);
    if (!currentTypeDef) {
      throw new Error(`TypeDef for ${table} not found`);
    }

    // handle set fields
    for (const fieldname in setFields) {
      const parseValue =
        currentTypeDef.definition.fields[fieldname].sqlOptions?.parseValue;

      setFields[fieldname] = parseValue
        ? parseValue(setFields[fieldname])
        : setFields[fieldname];
    }

    let results;

    const action = options?.onConflict?.action;

    // handle custom options
    if (options?.onConflict) {
      if (action === "ignore") {
        results = await knex(table)
          .insert(setFields)
          .onConflict(options.onConflict.columns)
          .ignore()
          .returning(["id"]);
      } else {
        results = await knex(table)
          .insert(setFields)
          .onConflict(options.onConflict.columns)
          .merge()
          .returning(["id"]);
      }
    } else {
      results = await knex(table).insert(setFields).returning(["id"]);
    }

    return results;
  } catch (err) {
    throw generateError(err, fieldPath);
  }
}

export async function updateTableRow(
  table: string,
  setFields,
  whereObject: SqlWhereObject,
  fieldPath?: string[]
) {
  try {
    let whereStatement = "";
    let joinStatement = "";
    const previousJoins: JoinsMap = {};
    const params = {};

    // check if there is a mysql setter on the field
    const currentTypeDef = objectTypeDefs.get(table);
    if (!currentTypeDef) {
      throw new Error(`TypeDef for ${table} not found`);
    }

    // handle set fields
    for (const fieldname in setFields) {
      const parseValue =
        currentTypeDef.definition.fields[fieldname].sqlOptions?.parseValue;

      setFields[fieldname] = parseValue
        ? parseValue(setFields[fieldname])
        : setFields[fieldname];
    }

    // handle where statements
    if (whereObject) {
      const whereResults = processWhereObject(
        table,
        whereObject,
        previousJoins,
        params
      );

      whereStatement += whereResults.whereStatement;
      joinStatement += whereResults.joinStatement;
    }

    if (!whereStatement) {
      throw new Error("Invalid SQL");
    }

    const results = await knex({ [table + "0"]: table })
      .joinRaw(joinStatement)
      .whereRaw(whereStatement, params)
      .update(setFields);
    return results;
  } catch (err) {
    throw generateError(err, fieldPath);
  }
}

export async function removeTableRow(
  table: string,
  whereObject: SqlWhereObject,
  fieldPath?: string[]
) {
  try {
    let whereStatement = "";
    let joinStatement = "";
    const previousJoins: JoinsMap = {};
    const params = {};

    //handle where statements
    if (whereObject) {
      const whereResults = processWhereObject(
        table,
        whereObject,
        previousJoins,
        params
      );

      whereStatement += whereResults.whereStatement;
      joinStatement += whereResults.joinStatement;
    }

    if (!whereStatement) {
      throw new Error("Invalid SQL");
    }

    const results = await knex({ [table + "0"]: table })
      .joinRaw(joinStatement)
      .whereRaw(whereStatement, params)
      .delete();
    return results;
  } catch (err) {
    throw generateError(err, fieldPath);
  }
}

function processSelectArray(
  table: string,
  selectFieldsArray: SqlSelectFieldObject[],
  previousJoins: JoinsMap
) {
  return processJoins(
    table,
    selectFieldsArray,
    previousJoins,
    (
      tableName,
      tableAlias,
      fieldname,
      fieldObject,
      fieldIndex,
      currentTypeDef
    ) => {
      const getter =
        currentTypeDef.definition.fields[fieldname].sqlOptions?.getter;

      return (
        (getter
          ? getter(`"${tableAlias}".${fieldname}`)
          : `"${tableAlias}".${fieldname}`) +
        ' AS "' +
        (fieldObject.as ?? fieldObject.field) +
        '"'
      );
    }
  );
}

function isSqlWhereObject(
  obj: SqlWhereFieldObject | SqlWhereObject
): obj is SqlWhereObject {
  return (obj as SqlWhereObject).fields !== undefined;
}

function processWhereObject(
  table: string,
  whereObject: SqlWhereObject,
  previousJoins: JoinsMap,
  params,
  subIndexString = ""
) {
  const statements: string[] = [];
  let whereStatement = "";
  let joinStatement = "";

  const connective = whereObject.connective ?? "AND";

  whereObject.fields.forEach((whereSubObject, subIndex) => {
    // separate the SqlWhereFieldObject from SqlWhereObject
    const whereFieldObjects: SqlWhereFieldObject[] = [];
    const whereObjects: SqlWhereObject[] = [];

    if (isSqlWhereObject(whereSubObject)) {
      whereObjects.push(whereSubObject);
    } else {
      whereFieldObjects.push(whereSubObject);
    }

    // process SqlWhereFieldObjects, if any
    const results = processJoins(
      table,
      whereFieldObjects,
      previousJoins,
      (
        tableName,
        tableAlias,
        fieldname,
        fieldObject,
        fieldIndex,
        currentTypeDef
      ) => {
        // else, must be SqlWhereFieldObject
        const operator = fieldObject.operator ?? "eq";
        const placeholder = fieldname + subIndexString + "_" + subIndex;

        const getter =
          currentTypeDef.definition.fields[fieldname].sqlOptions?.getter;

        let whereSubstatement = getter
          ? getter(`"${tableAlias}".${fieldname}`)
          : `"${tableAlias}".${fieldname}`;

        switch (operator) {
          case "eq":
            if (fieldObject.value === null) {
              whereSubstatement += " IS NULL";
            } else {
              whereSubstatement += " = :" + placeholder;
              params[placeholder] = fieldObject.value;
            }
            break;
          case "neq":
            if (fieldObject.value === null) {
              whereSubstatement += " IS NOT NULL";
            } else {
              whereSubstatement += " != :" + placeholder;
              params[placeholder] = fieldObject.value;
            }
            break;
          case "gt":
            if (fieldObject.value === null) {
              throw new Error("Can't use this operator with null");
            } else {
              whereSubstatement += " > :" + placeholder;
              params[placeholder] = fieldObject.value;
            }
            break;
          case "lt":
            if (fieldObject.value === null) {
              throw new Error("Can't use this operator with null");
            } else {
              whereSubstatement += " < :" + placeholder;
              params[placeholder] = fieldObject.value;
            }
            break;
          case "in":
            if (Array.isArray(fieldObject.value)) {
              whereSubstatement += ` IN (${fieldObject.value.map(
                (ele, index) => `:${placeholder}_${index}`
              )})`;
              fieldObject.value.forEach((ele, index) => {
                params[placeholder + "_" + index] = ele;
              });
            } else {
              throw new Error("Must provide array for in/nin operators");
            }
            break;
          case "nin":
            if (Array.isArray(fieldObject.value)) {
              whereSubstatement += " NOT IN (:" + placeholder + ")";
              params[placeholder] = fieldObject.value;
            } else {
              throw new Error("Must provide array for in/nin operators");
            }
            break;
          case "regex":
            if (fieldObject.value instanceof RegExp) {
              // for regex, also need to cast the field as TEXT
              whereSubstatement = "CAST(" + whereSubstatement + " AS TEXT)";
              whereSubstatement += " ~ :" + placeholder;
              params[placeholder] = fieldObject.value
                .toString()
                .replace(/(^\/)|(\/[^\/]*$)/g, "");
            } else {
              throw new Error("Invalid Regex value");
            }
            break;
          case "like":
            if (fieldObject.value === null) {
              throw new Error("Can't use this operator with null");
            } else {
              whereSubstatement += " LIKE :" + placeholder;
              params[placeholder] = fieldObject.value;
            }
            break;
          default:
            throw new Error("Invalid operator");
        }

        return whereSubstatement;
      }
    );

    if (results.statements.length > 0) {
      statements.push(results.statements.join(" " + connective + " "));
    }

    joinStatement += results.joinStatement;

    // process SqlWhereObjects
    whereObjects.forEach((ele, whereObjectIndex) => {
      const res = processWhereObject(
        table,
        ele,
        previousJoins,
        params,
        subIndexString + "_" + whereObjectIndex
      );
      if (res.whereStatement) statements.push("(" + res.whereStatement + ")");
      joinStatement += res.joinStatement;
    });
  });

  if (statements.length > 0) {
    whereStatement = statements.join(" " + connective + " ");
  }

  return {
    // statements,
    whereStatement,
    joinStatement,
  };
}

function processSortArray(
  table: string,
  sortFieldsArray: SqlSortFieldObject[],
  previousJoins: JoinsMap
) {
  return processJoins(
    table,
    sortFieldsArray,
    previousJoins,
    (
      tableName,
      tableAlias,
      fieldname,
      fieldObject,
      fieldIndex,
      currentTypeDef
    ) =>
      `"${tableAlias}".${fieldname} ${
        fieldObject.desc ? "DESC NULLS LAST" : "ASC NULLS FIRST"
      }`
  );
}

function processGroupArray(
  table: string,
  groupFieldsArray: SqlGroupFieldObject[],
  previousJoins: JoinsMap
) {
  return processJoins(
    table,
    groupFieldsArray,
    previousJoins,
    (
      tableName,
      tableAlias,
      fieldname,
      fieldObject,
      fieldIndex,
      currentTypeDef
    ) => `"${tableAlias}".${fieldname}`
  );
}

function processJoins(
  table: string,
  fieldsArray: { [x: string]: any; joinFields?: SqlJoinFieldObject[] }[],
  previousJoins: JoinsMap,
  assemblyFn: AssemblyFunction
) {
  const statements: string[] = [];
  let joinStatement = "";

  fieldsArray.forEach((fieldObject, fieldIndex) => {
    const fieldPath = fieldObject.field.split(".");
    let currentTypeDef = objectTypeDefs.get(table);
    let tableAlias = table + "0";
    let tableName = table;

    if (!currentTypeDef)
      throw new Error("TypeDef for table: " + tableName + " does not exist");

    let joinTableAlias, fieldname;

    const joinArray: {
      joinTableName?: string;
      field: string;
      foreignField: string;
      andOn?: string[];
    }[] = [];

    // process the "normal" fields
    for (const field of fieldPath) {
      // does the field have a /
      // if yes, we need to join that table
      if (field.match(/\//)) {
        const fieldParts = field.split(/\//);

        // ensure fieldParts[0] refers to a linkDef
        const linkDef = linkDefs.get(fieldParts[0]);
        if (!linkDef) throw new Error(`Invalid linkDef '${fieldParts[0]}'`);

        // linkDef.types must ONLY contain tableName and the field in order to be treated as the first case
        if (
          linkDef.types.size === 2 &&
          linkDef.types.has(tableName) &&
          linkDef.types.has(fieldParts[1])
        ) {
          joinArray.unshift({
            joinTableName: fieldParts[0],
            field: "id",
            foreignField: tableName,
          });
        } else {
          // some fields missing, will need to do onAnd in join statement
          joinArray.unshift({
            joinTableName: fieldParts[0],
            field: "id",
            foreignField: tableName,
            // the andOn fields will be all of the types in the linkDef except the current type.
            andOn: [...linkDef.types.keys()].filter(
              (typename) => typename !== tableName
            ),
          });
        }

        joinArray.push({
          field: fieldParts[1],
          foreignField: "id",
        });
      } else {
        // going to assume the foreignKey is always "id"
        joinArray.push({
          field: field,
          foreignField: "id",
        });
      }
    }

    const cumulativeJoinFields: string[] = [];
    joinArray.forEach((ele, eleIndex) => {
      cumulativeJoinFields.push(ele.field);
      const cumulativeJoinFieldChain = cumulativeJoinFields.join(".");
      //if there's no next field, no more joins
      if (joinArray[eleIndex + 1]) {
        // check for valid field in the typeDef
        if (!(ele.field in currentTypeDef!.definition.fields))
          throw new Error(
            "Field: " + ele.field + " does not exist in Table: " + tableName
          );

        //join with this type
        const joinTableName =
          ele.joinTableName ??
          currentTypeDef!.definition.fields[ele.field].sqlOptions?.joinInfo
            ?.type;

        //if it requires a join, check if it was joined previously
        if (!joinTableName) throw new Error("Invalid Join Table");
        if (!(joinTableName in previousJoins)) {
          previousJoins[joinTableName] = [];
        }

        // always use a new join
        let newJoin = false;

        let index = previousJoins[joinTableName].lastIndexOf(
          cumulativeJoinFieldChain
        );

        //if index not exists, join the table and get the index.
        if (index === -1) {
          previousJoins[joinTableName].push(cumulativeJoinFieldChain);
          index = previousJoins[joinTableName].lastIndexOf(
            cumulativeJoinFieldChain
          );
          newJoin = true;
        }

        //always set the alias.
        joinTableAlias = joinTableName + (index + 1);

        if (newJoin) {
          //assemble join statement, if required
          joinStatement += ` LEFT JOIN "${joinTableName}" AS "${joinTableAlias}" ON "${tableAlias}".${ele.field} = "${joinTableAlias}".${ele.foreignField}`;

          // does it have a special onAnd field?
          if (ele.andOn) {
            ele.andOn.forEach((typename) => {
              joinStatement += ` AND "${joinTableAlias}".${typename} = :${typename}`;
            });
          }
        }

        // shift the typeDef, tableAlias, and tableName
        currentTypeDef = objectTypeDefs.get(joinTableName);
        // check for typeDef existence
        if (!currentTypeDef?.definition.fields)
          throw new Error(
            "TypeDef for table: " + tableName + " does not exist"
          );
        tableAlias = joinTableAlias;
        tableName = joinTableName;
      } else {
        //no more fields, set the fieldname
        fieldname = ele.field;
      }
    });

    // check if field exists in the table
    if (!(fieldname in currentTypeDef.definition.fields))
      throw new Error(
        "Field: " + fieldname + " does not exist in table: " + tableName
      );

    statements.push(
      assemblyFn(
        tableName,
        tableAlias,
        fieldname,
        fieldObject,
        fieldIndex,
        currentTypeDef
      )
    );
  });

  return {
    statements,
    joinStatement,
  };
}

export { executeDBQuery };
