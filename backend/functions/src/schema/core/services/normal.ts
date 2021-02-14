import * as errorHelper from "../../helpers/error";
import { BaseService } from ".";
import * as sqlHelper from "../../helpers/sql";
import { permissionsCheck } from "../../helpers/permissions";
import {
  handleJqlSubscription,
  handleJqlSubscriptionTriggerIterative,
  handleJqlSubscriptionTrigger,
  deleteJqlSubscription,
} from "../../helpers/subscription";

import * as Resolver from "../../helpers/resolver";

import {
  JomqlObjectType,
  JomqlRootResolverType,
  JomqlObjectTypeLookup,
  objectTypeDefs,
  JomqlInputType,
  JomqlArgsError,
  JomqlInputTypeLookup,
  JomqlInputFieldType,
  JomqlInitializationError,
  JomqlScalarType,
  StringKeyObject,
} from "jomql";

import {
  SqlWhereObject,
  SqlQuerySelectObject,
  SqlSortFieldObject,
  ServiceFunctionInputs,
} from "../../../types";

import { btoa, isObject, capitalizeString } from "../../helpers/shared";
export type JoinFieldObject = {
  field?: string;
  // joinFields?: SqlJoinFieldObject[];
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
  typeDef!: JomqlObjectType;

  typeDefLookup: JomqlObjectTypeLookup;

  inputTypeDef!: JomqlInputType;

  inputTypeDefLookup: JomqlInputTypeLookup;

  rootResolvers!: { [x: string]: JomqlRootResolverType };

  filterFieldsMap: FieldMap = {};

  // some combination of these fields need to be able to identify a unique record
  uniqueKeyMap: KeyMap = {
    primary: ["id"],
  };

  sortFieldsMap: FieldMap = {};

  groupByFieldsMap: FieldMap = {};

  searchFieldsMap: FieldMap = {};

  constructor(typename?: string) {
    super(typename);

    this.typeDefLookup = new JomqlObjectTypeLookup(this.typename);

    this.inputTypeDefLookup = new JomqlInputTypeLookup(
      "get" + capitalizeString(this.typename)
    );

    process.nextTick(() => {
      const uniqueKeyMap = {};
      Object.entries(this.uniqueKeyMap).forEach(([uniqueKeyName, entry]) => {
        entry.forEach((key) => {
          const fieldType = this.getTypeDef().definition.fields[key].type;
          if (!(fieldType instanceof JomqlScalarType)) {
            throw new JomqlInitializationError({
              message: `Unique key map must lead to scalar value`,
            });
          }
          uniqueKeyMap[key] = new JomqlInputFieldType({
            type: fieldType,
          });
        });
      });

      this.inputTypeDef = new JomqlInputType({
        name: "get" + capitalizeString(this.typename),

        fields: uniqueKeyMap,
        inputsValidator: (args, fieldPath) => {
          // check if a valid combination of key args exist
          let validKeyCombination = false;
          if (isObject(args)) {
            const argsArray = Object.keys(args);
            for (const keyName in this.uniqueKeyMap) {
              if (
                this.uniqueKeyMap[keyName].every((ele) =>
                  argsArray.includes(ele)
                ) &&
                argsArray.every((ele) =>
                  this.uniqueKeyMap[keyName].includes(ele)
                )
              ) {
                validKeyCombination = true;
                break;
              }
            }
          }

          if (!validKeyCombination) {
            throw new JomqlArgsError({
              message: `Invalid combination of args`,
              fieldPath,
            });
          }
        },
      });
    });
  }

  // set typeDef
  setTypeDef(typeDef: JomqlObjectType) {
    this.typeDef = typeDef;
  }

  getTypeDef() {
    if (this.typeDef) return this.typeDef;

    const typeDefLookup = objectTypeDefs.get(this.typeDefLookup.name);

    if (!typeDefLookup)
      throw new Error(`TypeDef not found '${this.typeDefLookup.name}'`);

    return typeDefLookup;
  }

  @permissionsCheck("get")
  async subscribeToSingleItem(
    operationName: string,
    {
      req,
      fieldPath,
      args,
      query,
      data = {},
      isAdmin = false,
    }: ServiceFunctionInputs
  ) {
    // args should be validated already
    const validatedArgs = <any>args;
    const selectQuery = query || Object.assign({}, this.presets.default);

    //check if the record and query is fetchable
    const results = await Resolver.getObjectType(
      this.typename,
      req,
      fieldPath,
      selectQuery,
      {
        where: {
          fields: [{ field: "id", value: validatedArgs.id }],
        },
      },
      data
    );

    if (results.length < 1) {
      throw errorHelper.itemNotFoundError(fieldPath);
    }

    const subscriptionFilterableArgs = {
      id: validatedArgs.id,
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

  @permissionsCheck("getMultiple")
  async subscribeToMultipleItem(
    operationName: string,
    {
      req,
      fieldPath,
      args,
      query,
      data = {},
      isAdmin = false,
    }: ServiceFunctionInputs
  ) {
    // args should be validated already
    const validatedArgs = <any>args;

    const selectQuery = query || Object.assign({}, this.presets.default);

    //check if the query is valid (no need to actually run it)
    /*     if (this.typeDef)
      generateJomqlResolverTreeFromTypeDefinition(
        selectQuery,
        this.typeDef,
        this.typename,
        fieldPath,
        true
      ); */

    // only allowed to filter subscriptions based on these limited args
    const subscriptionFilterableArgs = {
      created_by: validatedArgs.created_by,
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

  @permissionsCheck("get")
  async getRecord({
    req,
    fieldPath,
    args,
    query,
    data = {},
    isAdmin = false,
  }: ServiceFunctionInputs) {
    // args should be validated already
    const validatedArgs = <any>args;

    const selectQuery = query ?? Object.assign({}, this.presets.default);

    const whereObject: SqlWhereObject = {
      connective: "AND",
      fields: [],
    };

    data.rootArgs = args;

    whereObject.fields.push(
      ...Object.entries(validatedArgs).map(([field, value]) => ({
        field,
        value,
      }))
    );

    const results = await Resolver.getObjectType(
      this.typename,
      req,
      fieldPath,
      selectQuery,
      {
        where: whereObject,
        limit: 1,
      },
      data
    );

    if (results.length < 1) {
      throw errorHelper.itemNotFoundError(fieldPath);
    }

    return results[0];
  }

  @permissionsCheck("getMultiple")
  async countRecords({
    req,
    fieldPath,
    args,
    query,
    data = {},
    isAdmin = false,
  }: ServiceFunctionInputs) {
    // args should be validated already
    const validatedArgs = <any>args;
    const whereObject: SqlWhereObject = {
      connective: "AND",
      fields: [],
    };

    if (isObject(validatedArgs.filterBy)) {
      Object.entries(validatedArgs.filterBy).forEach(([key, value]) => {
        // all keys must be pre-validated via args checking
        if (Array.isArray(value)) {
          value.forEach((ele) => {
            whereObject.fields.push({
              field: this.filterFieldsMap[key].field ?? key,
              operator: ele.operator,
              value: ele.value,
            });
          });
        }
      });
    }

    //handle search fields
    if (validatedArgs.search) {
      const whereSubObject: SqlWhereObject = {
        connective: "OR",
        fields: [],
      };

      for (const prop in this.searchFieldsMap) {
        whereSubObject.fields.push({
          field: this.searchFieldsMap[prop].field ?? prop,
          value: "%" + validatedArgs.search + "%",
          operator: "like",
        });
      }

      whereObject.fields.push(whereSubObject);
    }

    const resultsCount = await Resolver.countObjectType(
      this.typename,
      fieldPath,
      whereObject
    );

    return resultsCount;
  }

  @permissionsCheck("getMultiple")
  async getRecords({
    req,
    fieldPath,
    args,
    query,
    data = {},
    isAdmin = false,
  }: ServiceFunctionInputs) {
    // args should be validated already
    const validatedArgs = <any>args;
    const selectQuery = query || Object.assign({}, this.presets.default);

    const whereObject: SqlWhereObject = {
      connective: "AND",
      fields: [],
    };

    if (isObject(validatedArgs.filterBy)) {
      Object.entries(validatedArgs.filterBy).forEach(([key, value]) => {
        // all keys must be pre-validated via args checking
        if (Array.isArray(value)) {
          value.forEach((ele) => {
            whereObject.fields.push({
              field: this.filterFieldsMap[key].field ?? key,
              operator: ele.operator,
              value: ele.value,
            });
          });
        }
      });
    }

    //handle search fields
    if (validatedArgs.search) {
      const whereSubObject: SqlWhereObject = {
        connective: "OR",
        fields: [],
      };

      for (const prop in this.searchFieldsMap) {
        whereSubObject.fields.push({
          field: this.searchFieldsMap[prop].field ?? prop,
          value: "%" + validatedArgs.search + "%",
          operator: "like",
        });
      }

      whereObject.fields.push(whereSubObject);
    }

    let isBeforeQuery = false;

    // only the first sortKey works at the moment. falls back to "id" if not provided
    const sortByField =
      (Array.isArray(validatedArgs.sortBy) ? validatedArgs.sortBy[0] : "id") ??
      "id";
    if (!(sortByField in this.sortFieldsMap))
      throw errorHelper.generateError("Invalid sortBy field", fieldPath);
    const sortByDesc = Array.isArray(validatedArgs.sortDesc)
      ? validatedArgs.sortDesc[0] === true
      : false;

    // process the "after" constraint, if provided
    if (validatedArgs.after) {
      // parse cursor
      const parsedCursor = JSON.parse(btoa(validatedArgs.after));

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
          operator: "gt",
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

    // handle the before constraints, basically the reverse of the args.after case
    if (validatedArgs.before) {
      isBeforeQuery = true;
      // parse cursor
      const parsedCursor = JSON.parse(btoa(validatedArgs.before));

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

    // set limit to args.first or args.last
    //parse args.first and ensure it is less than 100
    const requestedLimit = Number(validatedArgs.first ?? validatedArgs.last);
    const limit = Math.min(requestedLimit, 100) || 100;

    // process sort fields
    const orderBy: SqlSortFieldObject[] = [];
    const rawSelect: SqlQuerySelectObject[] = [{ field: "id", as: "last_id" }];

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

    const results = await Resolver.getObjectType(
      this.typename,
      req,
      fieldPath,
      selectQuery,
      {
        rawSelect,
        where: whereObject,
        orderBy,
        limit: limit,
        groupBy: Array.isArray(validatedArgs.groupBy)
          ? validatedArgs.groupBy.reduce((total, item, index) => {
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
      data
    );

    return validatedArgs.reverse
      ? isBeforeQuery
        ? results
        : results.reverse()
      : isBeforeQuery
      ? results.reverse()
      : results;
  }

  // convert any lookup/joined fields into IDs, in place.
  async handleLookupArgs(args) {
    for (const key in args) {
      const typeField = this.getTypeDef().definition.fields[key].type;
      if (typeField instanceof JomqlObjectTypeLookup && isObject(args[key])) {
        // get record ID of type, replace object with the ID
        const results = await sqlHelper.fetchTableRows({
          select: [{ field: "id" }],
          from: typeField.name,
          where: {
            connective: "AND",
            fields: Object.entries(args[key]).map(([field, value]) => ({
              field,
              value,
            })),
          },
        });

        if (results.length < 1) {
          throw new Error(`${typeField.name} not found`);
        }

        // replace args[key] with the item ID
        args[key] = results[0].id;
      }
    }
  }

  @permissionsCheck("create")
  async createRecord({
    req,
    fieldPath,
    args,
    query,
    data = {},
    isAdmin = false,
  }: ServiceFunctionInputs) {
    // args should be validated already
    const validatedArgs = <any>args;
    await this.handleLookupArgs(args);

    const addResults = await Resolver.createObjectType({
      typename: this.typename,
      addFields: {
        ...validatedArgs,
        created_by: req.user!.id,
      },
      req,
      fieldPath,
    });

    // args that will be compared with subscription args
    /*     const subscriptionFilterableArgs = {
      created_by: req.user?.id,
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
    ); */

    return this.getRecord({
      req,
      args: { id: addResults.id },
      query,
      fieldPath,
      isAdmin,
      data,
    });
  }

  @permissionsCheck("update")
  async updateRecord({
    req,
    fieldPath,
    args,
    query,
    data = {},
    isAdmin = false,
  }: ServiceFunctionInputs) {
    // args should be validated already
    const validatedArgs = <any>args;
    // check if record exists, get ID
    const records = await sqlHelper.fetchTableRows({
      select: [{ field: "id" }],
      from: this.typename,
      where: {
        connective: "AND",
        fields: Object.entries(validatedArgs.item).map(([field, value]) => ({
          field,
          value,
        })),
      },
    });

    if (records.length < 1) {
      throw errorHelper.itemNotFoundError(fieldPath);
    }

    const itemId = records[0].id;

    // convert any lookup/joined fields into IDs
    await this.handleLookupArgs(validatedArgs.fields);

    await Resolver.updateObjectType({
      typename: this.typename,
      id: itemId,
      updateFields: {
        ...validatedArgs.fields,
        updated_at: 1,
      },
      req,
      fieldPath,
    });

    const returnData = await this.getRecord({
      req,
      args: { id: itemId },
      query,
      fieldPath,
      isAdmin,
      data,
    });

    /*     handleJqlSubscriptionTrigger(req, this, this.typename + "Updated", {
      id: itemId,
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
      { id: itemId }
    ); */

    return returnData;
  }

  @permissionsCheck("delete")
  async deleteRecord({
    req,
    fieldPath,
    args,
    query,
    data = {},
    isAdmin = false,
  }: ServiceFunctionInputs) {
    // args should be validated already
    const validatedArgs = <any>args;
    // confirm existence of item and get ID
    const results = await sqlHelper.fetchTableRows({
      select: [{ field: "id" }],
      from: this.typename,
      where: {
        connective: "AND",
        fields: Object.entries(validatedArgs).map(([field, value]) => ({
          field,
          value,
        })),
      },
    });

    if (results.length < 1) {
      throw new Error(`${this.typename} not found`);
    }

    const itemId = results[0].id;

    // first, fetch the requested query, if any
    const requestedResults = await this.getRecord({
      req,
      args,
      query,
      fieldPath,
      isAdmin,
      data,
    });

    /*     await handleJqlSubscriptionTrigger(req, this, this.typename + "Deleted", {
      id: itemId,
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
      { id: itemId }
    ); */

    await Resolver.deleteObjectType({
      typename: this.typename,
      id: itemId,
      req,
      fieldPath,
    });

    //cleanup

    //also need to delete all subscriptions for this item
    /*     await deleteJqlSubscription(req, this.typename + "Deleted", {
      id: itemId,
    }); */

    return requestedResults;
  }
}
