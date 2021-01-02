import * as errorHelper from "../../helpers/error";
import { BaseService } from ".";

import {
  handleJqlSubscription,
  handleJqlSubscriptionTriggerIterative,
  handleJqlSubscriptionTrigger,
  deleteJqlSubscription,
} from "../../helpers/subscription";

import * as Resolver from "../../resolvers/resolver";

import { generateJomqlResolverTree, TypeDefinition } from "jomql";

import {
  SqlJoinFieldObject,
  SqlWhereObject,
  SqlQuerySelectObject,
  SqlSortFieldObject,
} from "../../../types";

import { btoa } from "../../helpers/shared";

export type JoinFieldObject = {
  field?: string;
  joinFields?: SqlJoinFieldObject[];
};

export type FieldMap = {
  [x: string]: JoinFieldObject;
};

export type ExternalQuery = {
  [x: string]: any;
};

export type KeyMap = {
  [x: string]: string[];
};

export class NormalService extends BaseService {
  typeDef!: TypeDefinition;

  filterFieldsMap: FieldMap = {};

  // some combination of these fields need to be able to identify a unique record
  uniqueKeyMap: KeyMap = {
    primary: ["id"],
  };

  sortFieldsMap: FieldMap = {};

  groupByFieldsMap: FieldMap = {};

  searchFieldsMap: FieldMap = {};

  isFilterRequired: boolean = false;

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
    const results = await Resolver.resolveTableRows(
      this.typename,
      req,
      selectQuery,
      {
        where: {
          fields: [{ field: "id", value: args.id }],
        },
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
    if (this.typeDef) generateJomqlResolverTree(selectQuery, this.typeDef);

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
    const selectQuery = query ?? Object.assign({}, this.presets.default);

    // if no fields requested, can skip the permissions check
    if (Object.keys(selectQuery).length < 1) return { typename: this.typename };

    //if it does not pass the access control, throw an error
    if (!admin && !(await this.testPermissions("get", req, args, query))) {
      throw errorHelper.badPermissionsError();
    }

    const whereObject: SqlWhereObject = {
      connective: "AND",
      fields: [],
    };

    whereObject.fields.push(
      ...Object.entries(args).map((tuple) => ({
        field: tuple[0],
        value: tuple[1],
      }))
    );

    if (whereObject.fields.length < 1) {
      throw errorHelper.generateError(
        "Must supply at least 1 filter parameter"
      );
    }

    const results = await Resolver.resolveTableRows(
      this.typename,
      req,
      selectQuery,
      {
        where: whereObject,
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

    const whereObject: SqlWhereObject = {
      connective: "AND",
      fields: [],
    };

    // handle filter fields
    if (Array.isArray(args.filterBy)) {
      args.filterBy.forEach((ele) => {
        if (!(ele.field in this.filterFieldsMap)) {
          throw new Error(`Invalid filter by field '${ele.field}'`);
        }
        whereObject.fields.push({
          field: this.filterFieldsMap[ele.field].field ?? ele.field,
          joinFields: this.filterFieldsMap[ele.field].joinFields,
          operator: ele.operator,
          value: ele.value,
        });
      });
    }

    //handle search fields
    if (args.search) {
      const whereSubObject: SqlWhereObject = {
        connective: "OR",
        fields: [],
      };

      for (const prop in this.searchFieldsMap) {
        whereSubObject.fields.push({
          field: this.searchFieldsMap[prop].field ?? prop,
          joinFields: this.searchFieldsMap[prop].joinFields,
          value: "%" + args.search + "%",
          operator: "like",
        });
      }

      whereObject.fields.push(whereSubObject);
    }

    if (whereObject.fields.length < 1 && this.isFilterRequired) {
      throw errorHelper.generateError(
        "Must supply at least 1 filter parameter"
      );
    }

    let isBeforeQuery = false;

    // only the first sortKey works at the moment. falls back to "id" if not provided
    const sortByField =
      (Array.isArray(args.sortBy) ? args.sortBy[0] : "id") ?? "id";
    if (!(sortByField in this.sortFieldsMap))
      throw errorHelper.generateError("Invalid sortBy field");
    const sortByDesc = Array.isArray(args.sortDesc)
      ? args.sortDesc[0] === true
      : false;

    // process the "after" constraint, if provided
    if (args.after) {
      // parse cursor
      const parsedCursor = JSON.parse(btoa(args.after));

      const isNullLastValue = parsedCursor.last_value === null;

      const operator = sortByDesc ? "lt" : "gt";

      const whereAndObject: SqlWhereObject = {
        connective: "AND",
        fields: [
          {
            field: sortByField,
            value: parsedCursor.last_value,
            operator: isNullLastValue ? "eq" : operator,
          },
        ],
      };

      const whereOrObject: SqlWhereObject = {
        connective: "OR",
        fields: [whereAndObject],
      };

      if (isNullLastValue) {
        // if last_value is null, also add id
        whereAndObject.fields.push({
          field: "id",
          value: parsedCursor.last_id,
          operator: "lt",
        });

        // if operator is > and is null last value, must allow not null
        if (operator === "lt") {
          whereOrObject.fields.push({
            field: sortByField,
            value: null,
            operator: "neq",
          });
        }
      } else {
        // if operator is < and not null last value, must allow null
        if (operator === "gt") {
          whereOrObject.fields.push({
            field: sortByField,
            value: null,
            operator: "eq",
          });
        }
      }

      whereObject.fields.push(whereOrObject);
    }

    // handle the before constraints, basically the reverse of the args.after case
    if (args.before) {
      isBeforeQuery = true;
      // parse cursor
      const parsedCursor = JSON.parse(btoa(args.before));

      const isNullLastValue = parsedCursor.last_value === null;

      const operator = sortByDesc ? "gt" : "lt";

      const whereAndObject: SqlWhereObject = {
        connective: "AND",
        fields: [
          {
            field: sortByField,
            value: parsedCursor.last_value,
            operator: isNullLastValue ? "eq" : operator,
          },
        ],
      };

      const whereOrObject: SqlWhereObject = {
        connective: "OR",
        fields: [whereAndObject],
      };

      if (isNullLastValue) {
        // if last_value is null, also add id
        whereAndObject.fields.push({
          field: "id",
          value: parsedCursor.last_id,
          operator: "lt",
        });

        // if operator is > and is null last value, must allow not null
        if (operator === "gt") {
          whereOrObject.fields.push({
            field: sortByField,
            value: null,
            operator: "neq",
          });
        }
      } else {
        // if operator is < and not null last value, must allow null
        if (operator === "lt") {
          whereOrObject.fields.push({
            field: sortByField,
            value: null,
            operator: "eq",
          });
        }
      }

      whereObject.fields.push(whereOrObject);
    }

    if (count) {
      const resultsCount = await Resolver.countTableRows(
        this.typename,
        whereObject
      );

      return resultsCount;
    } else {
      // set limit to args.first or args.last
      //parse args.first and ensure it is less than 100
      const requestedLimit = parseInt(args.first ?? args.last);
      const limit = Math.min(requestedLimit, 100) || 100;

      // process sort fields
      const orderBy: SqlSortFieldObject[] = [];
      const rawSelect: SqlQuerySelectObject[] = [
        { field: "id", as: "last_id" },
      ];

      if (sortByField) {
        rawSelect.push({
          field: sortByField,
          as: "last_value",
        });

        // overwrite orderBy statement
        orderBy.push({
          field: sortByField,
          desc: isBeforeQuery ? !sortByDesc : sortByDesc,
        });
      }

      // always add id as the last sort key
      orderBy.push({ field: "id", desc: isBeforeQuery ? true : false });

      const results = await Resolver.resolveTableRows(
        this.typename,
        req,
        selectQuery,
        {
          rawSelect,
          where: whereObject,
          orderBy,
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

      return args.reverse
        ? isBeforeQuery
          ? results
          : results.reverse()
        : isBeforeQuery
        ? results.reverse()
        : results;
    }
  }

  async createRecord(req, args: any, query?: object, admin = false) {
    //if it does not pass the access control, throw an error
    if (!admin && !(await this.testPermissions("create", req, args, query))) {
      throw errorHelper.badPermissionsError();
    }

    const addResults = await Resolver.addTableRow(
      this.typename,
      req,
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
      this.typename + "Created",
      subscriptionFilterableArgs,
      { id: addResults.id }
    );

    handleJqlSubscriptionTriggerIterative(
      req,
      this,
      this.typename + "ListUpdated",
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
    const recordExistCount = await Resolver.countTableRows(this.typename, {
      fields: [{ field: "id", value: args.id }],
    });

    if (recordExistCount < 1) {
      throw errorHelper.generateError("Item not found", 404);
    }

    // separate id from updateArgs
    const { id, ...updateArgs } = args;

    await Resolver.updateTableRow(
      this.typename,
      req,
      updateArgs,
      {
        updated_at: "now()",
      },
      { fields: [{ field: "id", value: args.id }] }
    );

    const returnData = this.getRecord(req, { id: args.id }, query);

    handleJqlSubscriptionTrigger(req, this, this.typename + "Updated", {
      id: args.id,
    });

    // subscriptions will be checked against these args
    const subscriptionFilterableArgs = {
      created_by: null, //no way to access this at the moment
    };

    handleJqlSubscriptionTriggerIterative(
      req,
      this,
      this.typename + "ListUpdated",
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

    await handleJqlSubscriptionTrigger(req, this, this.typename + "Deleted", {
      id: args.id,
    });

    // subscriptions will be checked against these args
    const subscriptionFilterableArgs = {
      created_by: null, //no way to access this at the moment
    };

    await handleJqlSubscriptionTriggerIterative(
      req,
      this,
      this.typename + "ListUpdated",
      subscriptionFilterableArgs,
      { id: args.id }
    );

    await Resolver.deleteTableRow(this.typename, req, args, {
      fields: [{ field: "id", value: args.id }],
    });

    //cleanup

    //also need to delete all subscriptions for this item
    await deleteJqlSubscription(req, this.typename + "Deleted", {
      id: args.id,
    });

    //also need to delete all permissions attached to this item
    if (this.permissionsLink) {
      await Resolver.deleteTableRow(this.permissionsLink.typename, req, args, {
        fields: [{ field: this.typename, value: args.id }],
      });
    }

    return requestedResults;
  }
}
