import { PaginatedService } from "../../core/services";
import { generateUserRoleGuard } from "../../helpers/permissions";
import { userRoleKenum } from "../../kenums";
import { AlgAlgcaseLink, Algcase } from "../../services";
import * as errorHelper from "../../helpers/error";
import * as Resolver from "../../resolvers/resolver";
import * as mysqlHelper from "../../helpers/mysql";

import { handleJqlSubscriptionTriggerIterative } from "../../helpers/subscription";

export class AlgService extends PaginatedService {
  defaultTypename = "alg";

  filterFieldsMap = {
    id: {},
    "algcase.name": {
      joinFields: [
        { field: "id", table: AlgAlgcaseLink.typename, foreignField: "alg" },
      ],
    },
    algcase: {
      field: "algcase",
      joinFields: [
        { field: "id", table: AlgAlgcaseLink.typename, foreignField: "alg" },
      ],
    },
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

  isFilterRequired = false;

  accessControl = {
    get: () => true,

    getMultiple: () => true,

    update: generateUserRoleGuard([userRoleKenum.ADMIN]),
    create: generateUserRoleGuard([userRoleKenum.ADMIN]),
    delete: generateUserRoleGuard([userRoleKenum.ADMIN]),
  };

  async createRecord(req, args: any, query?: object, admin = false) {
    //if it does not pass the access control, throw an error
    if (!admin && !(await this.testPermissions("create", req, args, query))) {
      throw errorHelper.badPermissionsError();
    }

    //algcase required
    if (!args.algcase) throw errorHelper.missingParamsError();

    //verify algcase exists
    const algcaseCount = await mysqlHelper.countTableRows(Algcase.typename, {
      fields: [
        {
          field: "id",
          value: args.algcase,
        },
      ],
    });

    if (algcaseCount < 1) throw new Error("Invalid algcase");

    const addResults = await Resolver.addTableRow(this.typename, req, args, {
      created_by: req.user.id,
    });

    // create algAlgcaseLink
    await Resolver.addTableRow(
      AlgAlgcaseLink.typename,
      req,
      {
        alg: addResults.id,
        algcase: args.algcase,
      },
      { created_by: req.user.id }
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
}
