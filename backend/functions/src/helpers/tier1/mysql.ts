import { typeDefs } from '../../schema';

import mysql from '../../utils/mysql2';

import errorHelper from '../tier0/error';

export default class Mysql {
  static fetchTableRows(table, jqlQuery) {
    let where_statement = '';
    let order_statement = '';
    let limit_statement = '';
    let groupby_statement = '';

    const tableObject = {
      name: table,
      alias: null
    };

    const params = {};

    let { select_statement, join_statement, previous_joins } = this.buildSqlQuery(jqlQuery.select, tableObject, [], { [table]: [null] });

    //handle where statements
    if(jqlQuery.where) {
      const where_results = this.processJqlWhereArray(table, jqlQuery.where, previous_joins, params);

      where_statement += where_results.where_statement;
      join_statement += where_results.join_statement;
    }
  
    let after_statement = "";

    //handle after statement
    if(jqlQuery.after) {
      after_statement = table + ".id > " + parseInt(jqlQuery.after);
      where_statement += where_statement ? " AND " + after_statement : after_statement
    }
    
    if(!where_statement) {
      where_statement = "1";
    }

    //handle orderBy statements
    //field MUST be pre-validated
    if(jqlQuery.orderBy) {
      const orderResults = this.processJqlSortArray(table, jqlQuery.orderBy, previous_joins);

      order_statement += orderResults.order_statement;
      join_statement += orderResults.join_statement;
    }

    //handle limit/offset statements
    if(jqlQuery.limit) {
      limit_statement += " LIMIT " + parseInt(jqlQuery.limit) || 0;
    }

    //handle limit/offset statements
    if(jqlQuery.groupBy) {
      const groupResults = this.processJqlGroupArray(table, jqlQuery.groupBy, previous_joins);

      groupby_statement += groupResults.group_statement;
      join_statement += groupResults.join_statement;
    }

    /*
    if(jqlQuery.offset) {
      limit_statement += " OFFSET " + parseInt(jqlQuery.offset) || 0;
    }
    */

    const sqlQuery = "SELECT " + select_statement + " FROM " + table + join_statement + " WHERE " + where_statement + (groupby_statement ? " GROUP BY " + groupby_statement : "") + (order_statement ? " ORDER BY " + order_statement : "") + limit_statement;

    return mysql.executeDBQuery(sqlQuery, params);
  }

  static async countTableRows(table, whereArray) {
    let where_statement = '';
    let join_statement = '';
    const previous_joins = {};
    const params = {};

    const select_statement = "count(*) AS count";
    
    //handle where statements
    if(whereArray) {
      const where_results = this.processJqlWhereArray(table, whereArray, previous_joins, params);

      where_statement += where_results.where_statement;
      join_statement += where_results.join_statement;
    }

    if(!where_statement) {
      where_statement = "1";
    }

    const sqlQuery = "SELECT " + select_statement + " FROM " + table + join_statement + " WHERE " + where_statement;

    const results = await mysql.executeDBQuery(sqlQuery, params);

    return results[0].count;
  }

  //admin use only
  static insertTableRow(table, fields, raw_fields = {}, ignore = false) {
    let set_statement = '';
    const params = {};

    for(const fieldname in fields) {
      set_statement += fieldname + " = :" + fieldname + ", ";
      params[fieldname] = fields[fieldname];
    }

    //raw fields MUST be sanitized or internally added
    for(const fieldname in raw_fields) {
      set_statement += fieldname + " = " + raw_fields[fieldname] + ", ";
    }

    if(set_statement) {
      //remove trailing comma
      set_statement = set_statement.slice(0, -2);
    } else {
      throw errorHelper.generateError('Invalid SQL');
    }

    const query = "INSERT " + (ignore ? "IGNORE " : "") + "INTO " + table + " SET " + set_statement;

    return mysql.executeDBQuery(query, params);
  }

  //admin use only
  static updateTableRow(table, set_fields, raw_fields = {}, whereArray) {
    let set_statement = '';
    let where_statement = '';
    let join_statement = '';
    const previous_joins = {};
    const params = {};

    //handle set fields
    for(const fieldname in set_fields) {
      set_statement += fieldname + " = :" + fieldname + ", ";
      params[fieldname] = set_fields[fieldname];
    }

    //raw fields MUST be sanitized or internally added
    for(const fieldname in raw_fields) {
      set_statement += fieldname + " = " + raw_fields[fieldname] + ", ";
    }

    if(set_statement) {
      //remove trailing comma
      set_statement = set_statement.slice(0, -2);
    } else {
      throw errorHelper.generateError('Invalid SQL');
    }

    //handle where statements
    if(whereArray) {
      const where_results = this.processJqlWhereArray(table, whereArray, previous_joins, params);

      where_statement += where_results.where_statement;
      join_statement += where_results.join_statement;
    }
    
    if(!where_statement) {
      throw errorHelper.generateError('Invalid SQL');
    }

    //combine statements
    const query = "UPDATE " + table + join_statement + " SET " + set_statement + " WHERE " + where_statement;

    return mysql.executeDBQuery(query, params);
  }

  //admin use only
  static removeTableRow(table, whereArray) {
    let where_statement = '';
    let join_statement = '';
    const previous_joins = {};
    const params = {};

    //handle where statements
    if(whereArray) {
      const where_results = this.processJqlWhereArray(table, whereArray, previous_joins, params);

      where_statement += where_results.where_statement;
      join_statement += where_results.join_statement;
    }
    
    if(!where_statement) {
      throw errorHelper.generateError('Invalid SQL');
    }

    const query = "DELETE FROM " + table + join_statement + " WHERE " + where_statement;

    return mysql.executeDBQuery(query, params);
  }

  static buildSqlQuery(query, tableObject, parentEntries = <Array<string>> [], previousJoins = {}) {
    const returnObject = {
      select_statement: "",
      join_statement: "",
      previous_joins: previousJoins
    };
  
    for(const entry in query) {
      const parentEntriesCopy = parentEntries.slice();

      if(query[entry]?.mysqlOptions?.getter) {
        //process fields with bound functions
        returnObject.select_statement += query[entry].mysqlOptions.getter((tableObject.alias || tableObject.name) + '.' + entry) + ' AS "' + (parentEntriesCopy.length > 0 ? parentEntriesCopy.join('.') + '.' : '') + entry + '"';
      } else if(query[entry]?.mysqlOptions?.joinInfo?.type && query[entry]?.mysqlOptions?.joinInfo) {
        //process type fields
        //check if it is a joinable field and assemble the join statement
        const joinTableObject = {
          name: query[entry].mysqlOptions?.joinInfo?.type,
          alias: null
        };

        let index;

        //check to not join a table if already joined before
        if(!(joinTableObject.name in previousJoins)) {
          previousJoins[joinTableObject.name] = [entry];
          index = 0;
        } else {
          previousJoins[joinTableObject.name].push(entry);

          index = previousJoins[joinTableObject.name].lastIndexOf(entry);
        }
        
        //always set the alias
        joinTableObject.alias = joinTableObject.name + index;

        returnObject.join_statement += " LEFT JOIN " + joinTableObject.name + (joinTableObject.alias ? " " + joinTableObject.alias : "") + " ON " + (tableObject.alias ?? tableObject.name) + "." + entry + " = " + (joinTableObject.alias ?? joinTableObject.name) + "." + (query[entry].mysqlOptions.joinInfo.foreignKey ?? "id");

        //add entry to list of parent entries
        parentEntriesCopy.push(entry);
        const { select_statement, join_statement } = this.buildSqlQuery(query[entry].__nestedQuery, joinTableObject, parentEntriesCopy, previousJoins);
  
        returnObject.join_statement += join_statement;
        returnObject.select_statement += select_statement;
  
      } else {
        //raw field, just do table.entry
        returnObject.select_statement += (tableObject.alias || tableObject.name) + '.' + entry + ' AS "' + (parentEntriesCopy.length > 0 ? parentEntriesCopy.join('.') + '.' : '') + entry + '"';
      }
      returnObject.select_statement += ", ";
    }
  
    if(!returnObject.select_statement) {
      throw errorHelper.generateError('Invalid SQL');
    }

    //append the classname field
    returnObject.select_statement += '"' + tableObject.name + '" AS "' + (parentEntries.length > 0 ? parentEntries.join('.') + '.' : '') + '__typename", ';
  
    //remove trailing comma
    returnObject.select_statement = returnObject.select_statement.slice(0, -2);
  
    return returnObject;
  }

  static processJqlWhereArray(table, whereArray, previous_joins, params) {
    const where_statements = <Array<string>> [];
    let join_statement = "";

    whereArray.forEach((whereObject, whereIndex) => {
      const where_substatements = <Array<string>> [];
      const connective = whereObject.connective || 'AND';
      for(const fieldname in whereObject.fields) {
        const fieldPath = fieldname.split(".");
        const fieldObject = whereObject.fields[fieldname];
        let currentTypeDef = typeDefs[table];
        let currentTable = table;

        let joinTableAlias, finalFieldname;

        fieldPath.forEach((field, fieldIndex) => {
          //if there's no next field, no more joins
          if(fieldPath[fieldIndex+1]) {
            //join with this type
            const joinTableName = currentTypeDef[field]?.mysqlOptions?.joinInfo.type;

            //if it requires a join, check if it was joined previously
            if(joinTableName) {
              if(!(joinTableName in previous_joins)) {
                previous_joins[joinTableName] = [];
              }
      
              let newJoin = false;
              let index = previous_joins[joinTableName].indexOf(field);
      
              //if index not exists, join the table and get the index.
              if(index === -1) {
                previous_joins[joinTableName].push(field);
      
                index = previous_joins[joinTableName].indexOf(field);
                newJoin = true;
              }
      
              //always set the alias.
              joinTableAlias = joinTableName + index;
      
              if(newJoin) {
                //assemble join statement, if required
                join_statement += " LEFT JOIN " + joinTableName + " " + joinTableAlias + " ON " + currentTable + "." + field + " = " + joinTableAlias + "." + (currentTypeDef[field]?.mysqlOptions?.joinInfo?.foreignKey ?? "id");
              }
            }

            //shift the typeDef
            currentTypeDef = typeDefs[joinTableName];
            currentTable = joinTableAlias;
          } else {
            //no more fields, set the finalFieldname
            finalFieldname = field;
          }
        });

        const operator = fieldObject.operator ?? '=';
        const tableName = joinTableAlias || table;
        const placeholder = (finalFieldname in params) ? finalFieldname + whereIndex : finalFieldname;

        //value must be array with at least 2 elements
        if(operator === "BETWEEN") {
          where_substatements.push(tableName + "." + finalFieldname + " BETWEEN :" + fieldname + "0 AND :" + fieldname + "1");
          
          params[fieldname + "0"] = fieldObject.value[0];
          params[fieldname + "1"] = fieldObject.value[1];
        } else {
          if(Array.isArray(fieldObject.value)) {
            where_substatements.push(tableName + "." + finalFieldname + " IN (:" + placeholder + ")");
            params[placeholder] = fieldObject.value;
          } else if(fieldObject.value === null) {
            //if fieldvalue.value === null, change the format accordingly
            where_substatements.push(tableName + "." + finalFieldname + " IS NULL");
          } else {
            where_substatements.push(tableName + "." + finalFieldname + " " + operator + " :" + placeholder);
            params[placeholder] = fieldObject.value;
          }
        }
      }
      if(where_substatements.length > 0) {
        where_statements.push("(" + where_substatements.join(" " + connective + " ") + ")");
      }
    });

    const where_statement = where_statements.join(" AND ");

    return {
      where_statement,
      join_statement
    };
  }

  static processJqlSortArray(table, sortArray, previous_joins) {
    const sort_statements = <Array<string>> [];
    let join_statement = "";

    sortArray.forEach((sortObject) => {
      const fieldPath = sortObject.field.split(".");
      let currentTypeDef = typeDefs[table];
      let currentTable = table;

      let joinTableAlias, finalFieldname;

      fieldPath.forEach((field, fieldIndex) => {
        //if there's no next field, no more joins
        if(fieldPath[fieldIndex+1]) {
          //join with this type
          const joinTableName = currentTypeDef[field]?.mysqlOptions?.joinInfo.type;

          //if it requires a join, check if it was joined previously
          if(joinTableName) {
            if(!(joinTableName in previous_joins)) {
              previous_joins[joinTableName] = [];
            }
    
            let newJoin = false;
            let index = previous_joins[joinTableName].indexOf(field);
    
            //if index not exists, join the table and get the index.
            if(index === -1) {
              previous_joins[joinTableName].push(field);
    
              index = previous_joins[joinTableName].indexOf(field);
              newJoin = true;
            }
    
            //always set the alias.
            joinTableAlias = joinTableName + index;
    
            if(newJoin) {
              //assemble join statement, if required
              join_statement += " LEFT JOIN " + joinTableName + " " + joinTableAlias + " ON " + currentTable + "." + field + " = " + joinTableAlias + "." + (currentTypeDef[field]?.mysqlOptions?.joinInfo?.foreignKey ?? "id");
            }
          }

          //shift the typeDef
          currentTypeDef = typeDefs[joinTableName];
          currentTable = joinTableAlias;
        } else {
          //no more fields, set the finalFieldname
          finalFieldname = field;
        }
      });

      const tableName = joinTableAlias || table;
      sort_statements.push(tableName + "." + finalFieldname + " " + (sortObject.desc ? "DESC" : "ASC"));
    });

    return {
      order_statement: sort_statements.join(", "),
      join_statement
    };
  }

  static processJqlGroupArray(table, groupArray, previous_joins) {
    const statements = <Array<string>> [];
    let join_statement = "";

    groupArray.forEach((groupObject) => {
      const fieldPath = groupObject.field.split(".");
      let currentTypeDef = typeDefs[table];
      let currentTable = table;

      let joinTableAlias, finalFieldname;

      fieldPath.forEach((field, fieldIndex) => {
        //if there's no next field, no more joins
        if(fieldPath[fieldIndex+1]) {
          //join with this type
          const joinTableName = currentTypeDef[field]?.mysqlOptions?.joinInfo.type;

          //if it requires a join, check if it was joined previously
          if(joinTableName) {
            if(!(joinTableName in previous_joins)) {
              previous_joins[joinTableName] = [];
            }
    
            let newJoin = false;
            let index = previous_joins[joinTableName].indexOf(field);
    
            //if index not exists, join the table and get the index.
            if(index === -1) {
              previous_joins[joinTableName].push(field);
    
              index = previous_joins[joinTableName].indexOf(field);
              newJoin = true;
            }
    
            //always set the alias.
            joinTableAlias = joinTableName + index;
    
            if(newJoin) {
              //assemble join statement, if required
              join_statement += " LEFT JOIN " + joinTableName + " " + joinTableAlias + " ON " + currentTable + "." + field + " = " + joinTableAlias + "." + (currentTypeDef[field]?.mysqlOptions?.joinInfo?.foreignKey ?? "id");
            }
          }

          //shift the typeDef
          currentTypeDef = typeDefs[joinTableName];
          currentTable = joinTableAlias;
        } else {
          //no more fields, set the finalFieldname
          finalFieldname = field;
        }
      });

      const tableName = joinTableAlias || table;
      statements.push(tableName + "." + finalFieldname);
    });

    return {
      group_statement: statements.join(", "),
      join_statement
    };
  }

  static executeDBQuery = mysql.executeDBQuery;

  static getMysqlRaw = mysql.getMysqlRaw;
};