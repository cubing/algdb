import { PaginatedService } from "../../core/services";
import {
  generateUserRoleGuard,
  permissionsCheck,
} from "../../helpers/permissions";
import { userRoleKenum } from "../../enums";
import { AlgAlgcaseLink, Algcase } from "../../services";
import * as errorHelper from "../../helpers/error";
import * as Resolver from "../../helpers/resolver";
import * as mysqlHelper from "../../helpers/mysql";
import { handleJqlSubscriptionTriggerIterative } from "../../helpers/subscription";
import { ServiceFunctionInputs } from "../../../types";
import { isObject } from "../../helpers/shared";

export class AlgService extends PaginatedService {
  defaultTypename = "alg";

  filterFieldsMap = {
    id: {},
    "algcase.name": {},
    algcase: {
      field: "algcase.id",
    },
    tag: { field: "tag.id" },
    "tag.name": {},
  };

  uniqueKeyMap = {
    primary: ["id"],
  };

  sortFieldsMap = {
    id: {},
    created_at: {},
  };

  searchFieldsMap = {
    sequence: {},
  };

  groupByFieldsMap = {
    id: {},
  };

  accessControl = {
    get: () => true,

    getMultiple: () => true,

    update: generateUserRoleGuard([userRoleKenum.ADMIN]),
    create: generateUserRoleGuard([userRoleKenum.ADMIN]),
    delete: generateUserRoleGuard([userRoleKenum.ADMIN]),
  };

  @permissionsCheck("create")
  async createRecord({
    req,
    fieldPath,
    args,
    query,
    data = {},
    isAdmin = false,
  }: ServiceFunctionInputs) {
    // convert any lookup/joined fields into IDs
    for (const key in args) {
      const type = this.typeDef.fields[key].type;
      if (typeof type === "string" && isObject(args[key])) {
        // get record ID of type, replace object with the ID
        const results = await mysqlHelper.fetchTableRows({
          select: [{ field: "id" }],
          from: type,
          where: {
            connective: "AND",
            fields: Object.entries(args[key]).map(([field, value]) => ({
              field,
              value,
            })),
          },
        });

        if (results.length < 1) {
          throw new Error(`${type} not found`);
        }

        // replace args[key] with the item ID
        args[key] = results[0].id;
      }
    }

    const addResults = await Resolver.addTableRow(
      this.typename,
      req,
      fieldPath,
      args,
      {
        created_by: req.user?.id,
      }
    );

    // create algAlgcaseLink
    await Resolver.addTableRow(
      AlgAlgcaseLink.typename,
      req,
      fieldPath,
      {
        alg: addResults.id,
        algcase: args.algcase,
      },
      { created_by: req.user?.id }
    );

    // args that will be compared with subscription args
    const subscriptionFilterableArgs = {
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
    );

    return this.getRecord({
      req,
      args: { id: addResults.id },
      query,
      fieldPath,
      isAdmin,
      data,
    });
  }
}
