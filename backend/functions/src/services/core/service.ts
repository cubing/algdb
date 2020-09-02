import errorHelper from '../../helpers/tier0/error';

import mysqlHelper from '../../helpers/tier1/mysql';

import resolverHelper from '../../helpers/tier2/resolver';

import jqlHelper from '../../jql/helpers/jsonql';

import { handleJqlSubscription, handleJqlSubscriptionTrigger, handleJqlSubscriptionTriggerIterative, deleteJqlSubscription } from '../../helpers/tier3/subscription'

import { typeDefs } from '../../schema';

export default abstract class Service {
  static __typename: string;

  static paginator?: Service;

  static presets: {
    default: Object
  };

  static filterFieldsMap: Object = {};

  static isFilterRequired: Boolean = false;

  static searchableFields: Array<string> = [];

  static sortFields: Array<string> = [];
  
  static permissionsLink?: any;

  static accessControl?: {
    get?: Function,
    getMultiple?: Function,
    create?: Function,
    update?: Function,
    delete?: Function,
  };

  static getTypeDef() {
    return typeDefs[this.__typename];
  }

  static async testPermissions(operation: string, req, args, query) {
    if(!req.cache) {
      req.cache = {};
    }

    //check if this operation was already done. if so, return that result
    if((operation + '-' + this.__typename) in req.cache) {
      return req.cache[operation + '-' + this.__typename]
    }
    
    let allowed: Boolean;

    if(this.accessControl && (operation in this.accessControl)) {
      allowed = await this.accessControl[operation](req, args, query);
    } else {
      allowed = true;
    }

    //cache the permissions check in req if not already there
    return (req.cache[operation + '-' + this.__typename] = allowed);
  }
  
  static async subscribeToSingleItem(operationName: string, req, args, query?: object, admin = false) {
    const selectQuery = query || Object.assign({}, this.presets.default);

    //if it does not pass the access control, throw an error
    if(!admin && !await this.testPermissions('get', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }

    //check if the record and query is fetchable
    const results = await resolverHelper.resolveTableRows(this.__typename, this, req, {
      select: selectQuery,
      where: [
        {
          fields: {
            id: { value: args.id }
          }
        }
      ]

    }, args);

    if(results.length < 1) {
      throw errorHelper.itemNotFoundError();
    }

    const validatedArgs = {
      id: args.id
    };

    const channel = await handleJqlSubscription(req, operationName, validatedArgs, query || Object.assign({}, this.presets.default))

    return {
      channel_name: channel
    };
  }

  static async subscribeToMultipleItem(operationName: string, req, args, query?: object, admin = false) {
    const selectQuery = query || Object.assign({}, this.presets.default);

    //if it does not pass the access control, throw an error
    if(!admin && !await this.testPermissions('getMultiple', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }
    
    //check if the query is valid (no need to actually run it)
    jqlHelper.validateJsonqlQuery(selectQuery, this.__typename);

    const validatedArgs = {
      created_by: args.created_by
    };

    const channel = await handleJqlSubscription(req, operationName, validatedArgs, query || Object.assign({}, this.presets.default))

    return {
      channel_name: channel
    };
  }

  static async getRecord(req, args, query?: object, admin = false) {
    const selectQuery = query || Object.assign({}, this.presets.default);

    //if it does not pass the access control, throw an error
    if(!admin && !await this.testPermissions('get', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }

    const results = await resolverHelper.resolveTableRows(this.__typename, this, req, {
      select: selectQuery,
      where: [
        {
          fields: {
            id: { value: args.id }
          }
        }
      ]
    }, args);

    if(results.length < 1) {
      throw errorHelper.itemNotFoundError();
    }

    return results[0];
  }

  /*
  ** Expected args: first, page, created_by
  */

  static async getRecords(req, args = <any> {}, query?: object, count = false, admin = false) {
    const selectQuery = query || Object.assign({}, this.presets.default);

    //if it does not pass the access control, throw an error
    if(!admin && !await this.testPermissions('getMultiple', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }

    const filterArray: Array<any> = [];
    
    for(const externalField in args) {
      const filterObject = {
        connective: "AND",
        fields: {}
      };

      let value;
      if(externalField in this.filterFieldsMap) {
        const { field, foreignField, operator } = this.filterFieldsMap[externalField];
        if(this.filterFieldsMap[externalField].fn) {
          value = this.filterFieldsMap[externalField].fn(args[externalField], req);
        } else if(this.filterFieldsMap[externalField].onlyMeAllowed) {
          if(!req.user) throw errorHelper.loginRequiredError();

          //only allowed to lookup by "me"
          if(args[externalField] !== "me") throw errorHelper.badPermissionsError();

          value = req.user.id;
        } else if(args[externalField] === "me" && this.filterFieldsMap[externalField].replaceMeWithId) {
          //if query field is "me" and is allowed to use me, replace with user id if available
          if(!req.user) throw errorHelper.loginRequiredError(); 

          value = req.user.id;
        } else {
          value = args[externalField];
        }

        filterObject.fields[field] = { value, foreignField, operator };

        filterArray.push(filterObject);
      }      
    }

    //searching
    if(args.search) {
      const filterObject = {
        connective: "OR",
        fields: {}
      };
      this.searchableFields.forEach((field) => {
        filterObject.fields[field] = {
          value: '%' + args.search + '%', 
          operator: 'LIKE'
        }
      });
      filterArray.push(filterObject);
    }

    if(filterArray.length < 1 && this.isFilterRequired) {
      throw errorHelper.generateError("Must supply at least 1 filter parameter");
    }

    if(count) {
      //add the "after" constraint, if provided
      if(args.after) {
        filterArray.push({
          fields: {
            id: { value: args.after, operator: '>' }
          }
        });
      }
      
      const resultsCount = await resolverHelper.countTableRows(this.__typename, filterArray);
  
      return resultsCount;
    } else {
      const results = await resolverHelper.resolveTableRows(this.__typename, this, req, {
        select: selectQuery,
        where: filterArray,
        orderBy: Array.isArray(args.sortBy) ? args.sortBy.reduce((total, item, index) => {
          if(this.sortFields.includes(item)) {
            total.push({
              field: item,
              desc: Array.isArray(args.sortDesc) ? (args.sortDesc[index] === "true" || args.sortDesc[index] === true) : true
            });
          }
          return total;
        }, []) : null,
        limit: args.first,
        after: args.after,
        //offset: args.first*args.page || 0
      });
  
      return results;
    }
  }

  static async createRecord(req, args = <any> {}, query?: object) {
    if(!req.user) throw errorHelper.loginRequiredError();

    //if it does not pass the access control, throw an error
    if(!await this.testPermissions('create', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }

    const addResults = await resolverHelper.addTableRow(this.__typename, {
      ...args,
      created_by: req.user.id
    });

    const validatedArgs = {
      created_by: req.user.id
    };

    handleJqlSubscriptionTriggerIterative(req, this, this.__typename + 'Created', validatedArgs, { id: addResults.id });

    return this.getRecord(req, { id: addResults.id }, query);
  }

  static async updateRecord(req, args = <any> {}, query?: object) {
    if(!req.user) throw errorHelper.loginRequiredError();

    //if it does not pass the access control, throw an error
    if(!await this.testPermissions('update', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }

    //check if record exists
    const recordExistCount = await resolverHelper.countTableRows(this.__typename, [
      {
        fields: {
          id: { value: args.id }
        }
      }
    ]);

    if(recordExistCount < 1) {
      throw errorHelper.generateError('Item not found', 404);
    }
    
    await resolverHelper.updateTableRow(this.__typename, {
      ...args,
      date_modified: null,
    }, [{ fields: { id: { value: args.id } } }]);
    

    const returnData = this.getRecord(req, { id: args.id }, query);

    //check subscriptions table where companyUpdated and id = 1.
    const validatedArgs = {
      id: args.id
    };

    handleJqlSubscriptionTrigger(req, this, this.__typename + 'Updated', validatedArgs);

    return returnData;
  }

  static async deleteRecord(req, args = <any> {}, query?: object) {
    if(!req.user) throw errorHelper.loginRequiredError();

    //if it does not pass the access control, throw an error
    if(!await this.testPermissions('delete', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }

    //first, fetch the requested query
    const requestedResults = await this.getRecord(req, { id: args.id }, query);

    //check subscriptions table where companyDeleted and id = 1.
    const validatedArgs = {
      id: args.id
    };

    await handleJqlSubscriptionTrigger(req, this, this.__typename + 'Deleted', validatedArgs);

    await resolverHelper.deleteTableRow(this.__typename, args, [
      {
        fields: {
          id: { value: args.id }
        }
      }
    ]);

    //cleanup

    //also need to delete all subscriptions for this item
    await deleteJqlSubscription(req, this.__typename + 'Deleted', validatedArgs);

    //also need to delete all permissions attached to this item
    if(this.permissionsLink) {
      await resolverHelper.deleteTableRow(this.permissionsLink.__typename, args, [
        {
          fields: {
            [this.__typename]: { value: args.id }
          }
        }
      ]);
    }

    return requestedResults;
  }
};