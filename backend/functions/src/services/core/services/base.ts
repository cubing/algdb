import * as errorHelper from "../../../helpers/tier0/error";

import {
  handleJqlSubscription,
  handleJqlSubscriptionTriggerIterative,
  handleJqlSubscriptionTrigger,
  deleteJqlSubscription,
} from "../../../helpers/tier2/subscription";

import {
  resolverHelper,
  jomqlHelper,
  getTypeDefs,
  mysqlHelper,
  TypeDef,
} from "jomql";

export abstract class Service {
  __typename!: string;

  presets;

  filterFieldsMap: Object = {};

  filterFieldsKeyMap: Object = { id: {} };

  hasKeys: Boolean = true;

  sortFieldsMap: Object = {};

  groupByFieldsMap: Object = {};

  searchFieldsMap: Object = {};

  isFilterRequired: Boolean = false;

  permissionsLink?: any;

  // standard ones are 'get', 'getMultiple', 'update', 'create', 'delete'
  accessControl?: {
    [x: string]: Function;
  };

  getTypeDef(): TypeDef {
    return getTypeDefs()[this.__typename];
  }

  async testPermissions(operation: string, req, args?, query?) {
    if (!req.cache) {
      req.cache = {};
    }

    //check if this operation was already done. if so, return that result
    if (operation + "-" + this.__typename in req.cache) {
      return req.cache[operation + "-" + this.__typename];
    }

    let allowed: Boolean;

    if (this.accessControl && operation in this.accessControl) {
      allowed = await this.accessControl[operation](req, args, query);
    } else {
      allowed = true;
    }

    //cache the permissions check in req if not already there
    return (req.cache[operation + "-" + this.__typename] = allowed);
  }

  async subscribeToSingleItem(
    operationName: string,
    req,
    args,
    query?: object,
    admin = false
  ) {
    const selectQuery = query || Object.assign({}, this.presets.default);

    //if it does not pass the access control, throw an error
    if (!admin && !(await this.testPermissions("get", req, args, query))) {
      throw errorHelper.badPermissionsError();
    }

    //check if the record and query is fetchable
    const results = await resolverHelper.resolveTableRows(
      this.__typename,
      this,
      req,
      {
        select: selectQuery,
        where: [
          {
            fields: [{ field: "id", value: args.id }],
          },
        ],
      },
      args
    );

    if (results.length < 1) {
      throw errorHelper.itemNotFoundError();
    }

    const subscriptionFilterableArgs = {
      id: args.id,
    };

    const channel = await handleJqlSubscription(
      req,
      operationName,
      subscriptionFilterableArgs,
      query || Object.assign({}, this.presets.default)
    );

    return {
      channel_name: channel,
    };
  }

  async subscribeToMultipleItem(
    operationName: string,
    req,
    args,
    query?: object,
    admin = false
  ) {
    const selectQuery = query || Object.assign({}, this.presets.default);

    //if it does not pass the access control, throw an error
    if (
      !admin &&
      !(await this.testPermissions("getMultiple", req, args, query))
    ) {
      throw errorHelper.badPermissionsError();
    }

    //check if the query is valid (no need to actually run it)
    jomqlHelper.validateJsonqlQuery(selectQuery, this.__typename);

    // only allowed to filter subscriptions based on these limited args
    const subscriptionFilterableArgs = {
      created_by: args.created_by,
    };

    const channel = await handleJqlSubscription(
      req,
      operationName,
      subscriptionFilterableArgs,
      selectQuery
    );

    return {
      channel_name: channel,
    };
  }

  async getRecord(req, args: any, query?: object, admin = false) {
    const selectQuery = query || Object.assign({}, this.presets.default);

    //if it does not pass the access control, throw an error
    if (!admin && !(await this.testPermissions("get", req, args, query))) {
      throw errorHelper.badPermissionsError();
    }

    const filterArray: Array<any> = [];
    if (this.hasKeys) {
      //handle filter fields
      for (const arg in args) {
        if (arg in this.filterFieldsKeyMap) {
          const filterObject = {
            connective: "AND",
            fields: <any>[],
          };
          filterObject.fields.push({
            field: this.filterFieldsKeyMap[arg].field ?? arg,
            joinFields: this.filterFieldsKeyMap[arg].joinFields,
            value: args[arg],
          });
          filterArray.push(filterObject);
        }
      }

      if (filterArray.length < 1) {
        throw errorHelper.generateError(
          "Must supply at least 1 filter parameter"
        );
      }
    }

    const results = await resolverHelper.resolveTableRows(
      this.__typename,
      this,
      req,
      {
        select: selectQuery,
        where: filterArray,
        limit: 1,
      },
      args
    );

    if (results.length < 1) {
      throw errorHelper.itemNotFoundError();
    }

    return results[0];
  }

  async getRecords(
    req,
    args: any,
    query?: object,
    count = false,
    admin = false
  ) {
    const selectQuery = query || Object.assign({}, this.presets.default);

    //if it does not pass the access control, throw an error
    if (
      !admin &&
      !(await this.testPermissions("getMultiple", req, args, query))
    ) {
      throw errorHelper.badPermissionsError();
    }

    const filterArray: Array<any> = [];

    //handle filter fields
    if (args.filterBy && typeof args.filterBy === "object") {
      for (const arg in args.filterBy) {
        if (arg in this.filterFieldsMap) {
          const filterObject = {
            connective: "AND",
            fields: <any>[],
          };
          filterObject.fields.push({
            field: this.filterFieldsMap[arg].field ?? arg,
            joinFields: this.filterFieldsMap[arg].joinFields,
            value: args.filterBy[arg],
          });
          filterArray.push(filterObject);
        }
      }
    }

    //handle search fields
    if (args.filterBy?.search) {
      const filterObject = {
        connective: "OR",
        fields: <any>[],
      };

      for (const prop in this.searchFieldsMap) {
        filterObject.fields.push({
          field: this.searchFieldsMap[prop].field ?? prop,
          joinFields: this.searchFieldsMap[prop].joinFields,
          value: "%" + args.filterBy.search + "%",
          operator: "LIKE",
        });
      }

      filterArray.push(filterObject);
    }

    if (filterArray.length < 1 && this.isFilterRequired) {
      throw errorHelper.generateError(
        "Must supply at least 1 filter parameter"
      );
    }

    //add the "after" constraint, if provided
    if (args.after) {
      const operator =
        Array.isArray(args.sortDesc) && args.sortDesc[0] === true ? "<" : ">";

      filterArray.push({
        fields: [{ field: "id", value: args.after, operator }],
      });
    }

    if (count) {
      const resultsCount = await resolverHelper.countTableRows(
        this.__typename,
        filterArray
      );

      return resultsCount;
    } else {
      //parse args.first and ensure it is less than 100
      const limit =
        parseInt(args.first) > 100 ? 100 : parseInt(args.first) || 100;

      const results = await resolverHelper.resolveTableRows(
        this.__typename,
        this,
        req,
        {
          select: selectQuery,
          where: filterArray,
          orderBy: Array.isArray(args.sortBy)
            ? args.sortBy.reduce((total, item, index) => {
                if (item in this.sortFieldsMap) {
                  total.push({
                    field: this.sortFieldsMap[item].field ?? item,
                    desc: Array.isArray(args.sortDesc)
                      ? args.sortDesc[index] === "true" ||
                        args.sortDesc[index] === true
                      : true,
                  });
                }
                return total;
              }, [])
            : null,
          limit: limit,
          groupBy: Array.isArray(args.groupBy)
            ? args.groupBy.reduce((total, item, index) => {
                if (item in this.groupByFieldsMap) {
                  total.push({
                    field: this.groupByFieldsMap[item].field ?? item,
                  });
                }
                return total;
              }, [])
            : null,
          //offset: args.first*args.page || 0
        },
        args
      );

      return args.reverse ? results.reverse() : results;
    }
  }

  async createRecord(req, args: any, query?: object, admin = false) {
    //if it does not pass the access control, throw an error
    if (!admin && !(await this.testPermissions("create", req, args, query))) {
      throw errorHelper.badPermissionsError();
    }

    const addResults = await resolverHelper.addTableRow(
      this.__typename,
      {
        ...args,
      },
      {
        created_by: req.user.id,
      }
    );

    // args that will be compared with subscription args
    const subscriptionFilterableArgs = {
      created_by: req.user.id,
    };

    handleJqlSubscriptionTriggerIterative(
      req,
      this,
      this.__typename + "Created",
      subscriptionFilterableArgs,
      { id: addResults.id }
    );

    handleJqlSubscriptionTriggerIterative(
      req,
      this,
      this.__typename + "ListUpdated",
      subscriptionFilterableArgs,
      { id: addResults.id }
    );

    return this.getRecord(req, { id: addResults.id }, query);
  }

  async updateRecord(req, args: any, query?: object) {
    //if it does not pass the access control, throw an error
    if (!(await this.testPermissions("update", req, args, query))) {
      throw errorHelper.badPermissionsError();
    }

    //check if record exists
    const recordExistCount = await resolverHelper.countTableRows(
      this.__typename,
      [
        {
          fields: [{ field: "id", value: args.id }],
        },
      ]
    );

    if (recordExistCount < 1) {
      throw errorHelper.generateError("Item not found", 404);
    }

    await resolverHelper.updateTableRow(
      this.__typename,
      {
        ...args,
        updated_at: null,
      },
      [{ fields: [{ field: "id", value: args.id }] }]
    );

    const returnData = this.getRecord(req, { id: args.id }, query);

    handleJqlSubscriptionTrigger(req, this, this.__typename + "Updated", {
      id: args.id,
    });

    // subscriptions will be checked against these args
    const subscriptionFilterableArgs = {
      created_by: null, //no way to access this at the moment
    };

    handleJqlSubscriptionTriggerIterative(
      req,
      this,
      this.__typename + "ListUpdated",
      subscriptionFilterableArgs,
      { id: args.id }
    );

    return returnData;
  }

  async deleteRecord(req, args: any, query?: object) {
    //if it does not pass the access control, throw an error
    if (!(await this.testPermissions("delete", req, args, query))) {
      throw errorHelper.badPermissionsError();
    }

    //first, fetch the requested query
    const requestedResults = await this.getRecord(req, { id: args.id }, query);

    await handleJqlSubscriptionTrigger(req, this, this.__typename + "Deleted", {
      id: args.id,
    });

    // subscriptions will be checked against these args
    const subscriptionFilterableArgs = {
      created_by: null, //no way to access this at the moment
    };

    await handleJqlSubscriptionTriggerIterative(
      req,
      this,
      this.__typename + "ListUpdated",
      subscriptionFilterableArgs,
      { id: args.id }
    );

    await resolverHelper.deleteTableRow(this.__typename, args, [
      {
        fields: [{ field: "id", value: args.id }],
      },
    ]);

    //cleanup

    //also need to delete all subscriptions for this item
    await deleteJqlSubscription(req, this.__typename + "Deleted", {
      id: args.id,
    });

    //also need to delete all permissions attached to this item
    if (this.permissionsLink) {
      await resolverHelper.deleteTableRow(
        this.permissionsLink.__typename,
        args,
        [
          {
            fields: [{ field: this.__typename, value: args.id }],
          },
        ]
      );
    }

    return requestedResults;
  }
}
