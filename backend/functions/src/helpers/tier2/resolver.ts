import { typeDefs } from '../../schema';

import jqlHelper from '../../jql/helpers/jsonql';
import sharedHelper from '../tier0/shared';

import mysqlHelper from '../tier1/mysql';

export default class {
  //validates the add fields, and then does the add operation
  static async addTableRow(classname, args) {
    //resolve the setters
    const validQuery = typeDefs[classname];

    //assemble the mysql fields
    const mysqlFields = {};

    //handle the custom setters
    const customResolvers = {};
    
    for(const field in args) {
      if(field in validQuery) {
        if(validQuery[field].addable) {
          //if there's a setter to transform the input, use that
          mysqlFields[field] = validQuery[field].transform?.setter ? await validQuery[field].transform?.setter(args[field]) : args[field];
        } else if(validQuery[field].setter) {
          customResolvers[field] = validQuery[field].setter;
        }
      }
    }

    //do the mysql first
    const addResults = await mysqlHelper.insertTableRow(classname, mysqlFields);

    const resultObject = {
      id: addResults.insertId
    };

    //handle the custom setter functions, which might rely on primary keys
    for(const field in customResolvers) {
      await customResolvers[field](classname, args[field], resultObject);
    }

    return resultObject;
  }

  //validates the add fields, and then does the add operation
  static async updateTableRow(classname, args, whereArray) {
    //resolve the setters
    const validQuery = typeDefs[classname];

    //assemble the mysql fields
    const mysqlFields = {};

    //handle the custom setters
    const customResolvers = {};
    
    for(const field in args) {
      if(field in validQuery) {
        if(validQuery[field].updateable) {
          //if there's a setter to transform the input, use that
          mysqlFields[field] = validQuery[field].mysqlOptions.validator ? validQuery[field].mysqlOptions.validator(args[field]) : args[field];
        } else if(validQuery[field].updater) {
          customResolvers[field] = validQuery[field].updater;
        }
      }
    }

    //do the mysql first
    await mysqlHelper.updateTableRow(classname, mysqlFields, {}, whereArray);

    const resultObject = {
      id: args.id
    };

    //handle the custom setter functions, which might rely on primary keys
    for(const field in customResolvers) {
      await customResolvers[field](classname, args[field], resultObject);
    }

    return resultObject;
  }

  //performs the delete operation
  static async deleteTableRow(classname, args, whereArray) {
    //resolve the deleters
    const validQuery = typeDefs[classname];

    //handle the custom deleters
    const customResolvers = {};
    
    for(const field in validQuery) {
      if(validQuery[field].deleter) {
        customResolvers[field] = validQuery[field].deleter;
      }
    }

    //do the mysql first
    await mysqlHelper.removeTableRow(classname, whereArray);

    const resultObject = {
      id: args.id
    };

    //handle the custom deleter functions, which might rely on primary keys
    for(const field in customResolvers) {
      await customResolvers[field](classname, null, resultObject);
    }

    return resultObject;
  }

  static async resolveTableRows(classname, context, req, jqlQuery, args = {}) {
    const validQuery = typeDefs[classname];

    //validate graphql
    const validatedGraphql = jqlHelper.validateJsonqlQuery(jqlQuery.select, classname);

    jqlQuery.select = validatedGraphql.validatedQuery;

    let hasMysqlFields = false;
    //handle mysql fields - if any
    for(const prop in jqlQuery.select) {
      if(!jqlQuery.select[prop].resolver) {
        hasMysqlFields = true;
        break;
      }
    }

    //validate where fields and remove any that are not filterable
    if(Array.isArray(jqlQuery.where)) {
      jqlQuery.where.forEach(ele => {
        for(const field in ele) {
          if(field in validQuery) {
            if(!validQuery[field].filterable) {
              delete ele[field];
            }
          }
        }
      });
    }

    const returnArray = hasMysqlFields ? sharedHelper.collapseObjectArray(await mysqlHelper.fetchTableRows(classname, jqlQuery)) : [{ __typename: context.__typename }];

    //handle resolved fields
    for(const returnObject of returnArray) {
      await jqlHelper.handleResolvedQueries(returnObject, validatedGraphql.validatedResolvedQuery, context, req, args);
    }

    //handle aggregated fields
    await jqlHelper.handleAggregatedQueries(returnArray, validatedGraphql.validatedAggregatedQuery, context, req, args);

    return returnArray;
  }

  static async countTableRows(classname, filterArray) {
    const validQuery = typeDefs[classname];

    //validate where fields and remove any that are not filterable
    if(Array.isArray(filterArray)) {
      filterArray.forEach(ele => {
        for(const field in ele) {
          if(field in validQuery) {
            if(!validQuery[field].filterable) {
              delete ele[field];
            }
          }
        }
      });
    }
    return mysqlHelper.countTableRows(classname, filterArray);
  }
};