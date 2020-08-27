import { typeDefs } from '../../schema';

import mysql from '../../utils/mysql2';

import errorHelper from '../tier0/error';

export default class Mysql {
  static fetchTableRows(table, jqlQuery) {
    let where_statement = '';
    let order_statement = '';
    let limit_statement = '';

    const tableObject = {
      name: table,
      alias: null
    };

    const params = {};

    let { select_statement, join_statement, previous_joins } = this.buildSqlQuery(jqlQuery.select, tableObject, [], { [table]: [null] });

    //handle where statements
    if(jqlQuery.where) {
      const where_results = this.processGraphqlWhereArray(table, jqlQuery.where, previous_joins, params);

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
      jqlQuery.orderBy.forEach((ele) => {
        order_statement += ele.field + " " + (ele.desc ? "DESC" : "ASC") + ", ";
      });
    }

    if(order_statement) {
      //remove trailing AND
      order_statement = order_statement.slice(0, -2);
    }

    //handle limit/offset statements
    if(jqlQuery.limit) {
      limit_statement += " LIMIT " + parseInt(jqlQuery.limit) || 0;
    }

    /*
    if(jqlQuery.offset) {
      limit_statement += " OFFSET " + parseInt(jqlQuery.offset) || 0;
    }
    */


    const sqlQuery = "SELECT " + select_statement + " FROM " + table + join_statement + " WHERE " + where_statement + (order_statement ? " ORDER BY " + order_statement : "") + limit_statement;

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
      const where_results = this.processGraphqlWhereArray(table, whereArray, previous_joins, params);

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
      const where_results = this.processGraphqlWhereArray(table, whereArray, previous_joins, params);

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
      const where_results = this.processGraphqlWhereArray(table, whereArray, previous_joins, params);

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
      } else if(query[entry]?.type && query[entry]?.mysqlOptions?.joinInfo) {
        //process type fields
        //check if it is a joinable field and assemble the join statement
        const joinTableObject = {
          name: query[entry].type,
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

  static processGraphqlWhereArray(table, whereArray, previous_joins, params) {
    const where_statements = <Array<string>> [];
    let join_statement = "";

    whereArray.forEach((whereObject, whereIndex) => {
      const where_substatements = <Array<string>> [];
      const connective = whereObject.connective || 'AND';

      for(const fieldname in whereObject.fields) {
        const fieldvalue = whereObject.fields[fieldname];
        const typeDef = typeDefs[table];
  
        //check if this requires a join
        const joinTableName = (typeDef[fieldname]?.mysqlOptions?.joinInfo && fieldvalue.foreignField) ? typeDef[fieldname]?.mysqlOptions.joinInfo.type : null;
        let joinTableAlias = null;
  
        //if it requires a join, check if it was joined previously
        if(joinTableName) {
          if(!(joinTableName in previous_joins)) {
            previous_joins[joinTableName] = [];
          }
  
          let newJoin = false;
          let index = previous_joins[joinTableName].indexOf(fieldname);
  
          //if index not exists, join the table and get the index.
          if(index === -1) {
            previous_joins[joinTableName].push(fieldname);
  
            index = previous_joins[joinTableName].indexOf(fieldname);
            newJoin = true;
          }
  
          //always set the alias.
          joinTableAlias = joinTableName + index;
  
          if(newJoin) {
            //assemble join statement, if required
            join_statement += " LEFT JOIN " + joinTableName + (joinTableAlias ? " " + joinTableAlias : "") + " ON " + table + "." + fieldname + " = " + (joinTableAlias ?? joinTableName) + "." + (typeDef[fieldname].mysqlOptions.joinInfo.foreignKey ?? "id");
          }
        }
  
        const operator = fieldvalue.operator || '=';
  
        //value must be array with at least 2 elements
        if(operator === "BETWEEN") {
          where_substatements.push((joinTableAlias || joinTableName || table) + "." + (fieldvalue.foreignField || fieldname) + " BETWEEN :" + fieldname + "0 AND :" + fieldname + "1");
          
          params[fieldname + "0"] = fieldvalue.value[0];
          params[fieldname + "1"] = fieldvalue.value[1];
        } else {
          const placeholder = (fieldname in params) ? fieldname + whereIndex : fieldname;

          if(Array.isArray(fieldvalue.value)) {
            where_substatements.push((joinTableAlias || joinTableName || table) + "." + (fieldvalue.foreignField || fieldname) + " IN (:" + placeholder + ")");
          } else {
            where_substatements.push((joinTableAlias || joinTableName || table) + "." + (fieldvalue.foreignField ?? fieldname) + " " + operator + " :" + placeholder);
          }
          params[placeholder] = fieldvalue.value;
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

  static executeDBQuery = mysql.executeDBQuery;

  static getMysqlRaw = mysql.getMysqlRaw;
};