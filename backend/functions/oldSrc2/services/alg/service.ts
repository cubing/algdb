import { PaginatedService } from "../core/services";
import { generatePaginatorService } from "../core/generators";

import { generateUserRoleGuard } from "../../helpers/tier2/permissions";
import { userRoleEnum } from "../enums";

import * as errorHelper from "../../helpers/tier0/error";

import { handleJqlSubscriptionTriggerIterative } from "../../helpers/tier2/subscription";

import { resolverHelper, mysqlHelper } from "jomql";

import { AlgAlgcaseLink } from "../services";

export class AlgService extends PaginatedService {
  __typename = "alg";

  paginator = generatePaginatorService(this);

  presets = {
    default: {
      id: null,
      uid: null,
      email: null,
      display_name: null,
      display_image: null,
      date_created: null,
      date_modified: null,
    },
  };

  filterFieldsMap = {
    id: {},
    algcase_name: {
      field: "algcase.name",
      joinFields: [
        { field: "id", table: "algAlgcaseLink", foreignField: "alg" },
      ],
    },
    algcase: {
      field: "algcase",
      joinFields: [
        { field: "id", table: "algAlgcaseLink", foreignField: "alg" },
      ],
    },
    subset_name: {
      field: "algcase.subset.name",
      joinFields: [
        { field: "id", table: "algAlgcaseLink", foreignField: "alg" },
      ],
    },
    algset_name: {
      field: "algcase.algset.name",
      joinFields: [
        { field: "id", table: "algAlgcaseLink", foreignField: "alg" },
      ],
    },
    puzzle: {
      field: "algcase.algset.puzzle",
      joinFields: [
        { field: "id", table: "algAlgcaseLink", foreignField: "alg" },
      ],
    },
    puzzle_name: {
      field: "algcase.puzzle.name",
      joinFields: [
        { field: "id", table: "algAlgcaseLink", foreignField: "alg" },
      ],
    },
    tag_name: {
      field: "tag.name",
      joinFields: [{ field: "id", table: "algTagLink", foreignField: "alg" }],
    },
  };

  filterFieldsKeyMap = {
    id: {},
    code: {},
    puzzle_code: {
      field: "puzzle.code",
    },
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

    update: generateUserRoleGuard([userRoleEnum.ADMIN]),
    create: generateUserRoleGuard([userRoleEnum.ADMIN]),
    delete: generateUserRoleGuard([userRoleEnum.ADMIN]),
  };

  async createRecord(req, args: any, query?: object, admin = false) {
    //if it does not pass the access control, throw an error
    if (!admin && !(await this.testPermissions("create", req, args, query))) {
      throw errorHelper.badPermissionsError();
    }

    //algcase required
    if (!args.algcase) throw errorHelper.missingParamsError();

    //verify algcase exists
    const algcaseResults = await mysqlHelper.executeDBQuery(
      "SELECT id FROM algcase WHERE id = :id",
      { id: args.algcase }
    );

    if (algcaseResults.length < 1)
      throw errorHelper.generateError("Invalid algcase");

    const addResults = await resolverHelper.addTableRow(
      this.__typename,
      {
        ...args,
      },
      {
        created_by: req.user.id,
      }
    );

    //create algAlgcaseLink
    await resolverHelper.addTableRow(
      AlgAlgcaseLink.__typename,
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
}
