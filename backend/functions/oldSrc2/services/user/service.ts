import { PaginatedService } from "../core/services";

import { generatePaginatorService } from "../core/generators";

import { Auth } from "../services";

import {
  handleJqlSubscriptionTriggerIterative,
  handleJqlSubscriptionTrigger,
} from "../../helpers/tier2/subscription";

import { mysqlHelper, resolverHelper } from "jomql";

import * as errorHelper from "../../helpers/tier0/error";

import { userRoleEnum } from "../enums";

import { generateItemCreatedByUserGuard } from "../../helpers/tier2/permissions";

export class UserService extends PaginatedService {
  __typename = "user";

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
    created_by: {},
    "created_by.name": {},
  };

  sortFieldsMap = {
    id: {},
    created_at: {},
  };

  isFilterRequired = false;

  accessControl = {
    get: () => true,

    getMultiple: () => true,

    create: () => false,

    update: generateItemCreatedByUserGuard(this),

    delete: generateItemCreatedByUserGuard(this),
  };

  async registerUser(req, args = <any>{}, query?: object, admin = false) {
    //if it does not pass the access control, throw an error
    if (!admin && !(await this.testPermissions("create", req, args, query))) {
      throw errorHelper.badPermissionsError();
    }

    const addResults = await resolverHelper.addTableRow(
      this.__typename,
      {
        ...args,
      },
      { created_by: 0 }
    );

    //set created_by to id
    await mysqlHelper.executeDBQuery(
      "UPDATE user SET created_by = id WHERE id = :id",
      {
        id: addResults.id,
      }
    );

    const validatedArgs = {
      created_by: addResults.id,
    };

    handleJqlSubscriptionTriggerIterative(
      req,
      this,
      this.__typename + "Created",
      validatedArgs,
      { id: addResults.id }
    );

    //always allowed to return the user you just created
    //return this.getRecord(req, { id: addResults.id }, query, true);

    //return auth payload
    return Auth.getRecord(
      req,
      {
        id: addResults.id,
        email: args.email,
      },
      query
    );
  }

  async updateRecord(req, args = <any>{}, query?: object) {
    if (!req.user) throw errorHelper.loginRequiredError();

    //if it does not pass the access control, throw an error
    if (!(await this.testPermissions("update", req, args, query))) {
      throw errorHelper.badPermissionsError();
    }

    //check if record exists
    const results = await mysqlHelper.executeDBQuery(
      "SELECT id, role FROM user WHERE id = :id",
      {
        id: args.id,
      }
    );

    if (results.length < 1) {
      throw errorHelper.generateError("Item not found", 404);
    }

    //check if target user is more senior admin
    if (
      userRoleEnum[results[0].role] === userRoleEnum[userRoleEnum.ADMIN] &&
      results[0].id < req.user.id
    ) {
      throw errorHelper.generateError(
        "Cannot update more senior admin user",
        401
      );
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

    //check subscriptions table where companyUpdated and id = 1.
    const validatedArgs = {
      id: args.id,
    };

    handleJqlSubscriptionTrigger(
      req,
      this,
      this.__typename + "Updated",
      validatedArgs
    );

    return returnData;
  }
}
