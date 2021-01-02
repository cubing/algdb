import { PaginatedService } from "../../core/services";

import { User } from "../../services";

import {
  handleJqlSubscriptionTrigger,
  handleJqlSubscriptionTriggerIterative,
  deleteJqlSubscription,
} from "../../helpers/subscription";
import * as Resolver from "../../resolvers/resolver";
import * as mysqlHelper from "../../helpers/mysql";

import * as errorHelper from "../../helpers/error";
import * as admin from "firebase-admin";

import {
  generateUserRoleGuard,
  generateItemCreatedByUserGuard,
} from "../../helpers/permissions";
import { userRoleKenum } from "../../kenums";

export class UserService extends PaginatedService {
  defaultTypename = "user";

  filterFieldsMap = {
    id: {},
    created_by: {},
    "created_by.name": {},
    role: {},
  };

  sortFieldsMap = {
    id: {},
    created_at: {},
    updated_at: {},
  };

  searchFieldsMap = {
    name: {},
  };

  isFilterRequired = false;

  accessControl = {
    get: async (req, args, query) =>
      (await generateUserRoleGuard([userRoleKenum.ADMIN])(req, args, query)) ||
      (await generateItemCreatedByUserGuard(this)(req, args, query)),
    update: async (req, args, query) => {
      // if updating password, email, or role field directly, must be admin
      if ("email" in args || "password" in args || "role" in args) {
        return generateUserRoleGuard([userRoleKenum.ADMIN])(req, args, query);
      }

      return (
        (await generateUserRoleGuard([userRoleKenum.ADMIN])(
          req,
          args,
          query
        )) || (await generateItemCreatedByUserGuard(this)(req, args, query))
      );
    },
    "*": generateUserRoleGuard([userRoleKenum.ADMIN]),
  };

  async createRecord(req, args: any, query?: object, isAdmin = false) {
    //if it does not pass the access control, throw an error
    if (!isAdmin && !(await this.testPermissions("create", req, args, query))) {
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

    // create firebase user
    await admin
      .auth()
      .createUser({
        uid: String(addResults.id),
        email: args.email,
        emailVerified: false,
        password: args.password,
        displayName: args.name,
        disabled: false,
        photoURL: args.avatar,
      })
      .catch((err) => {
        // if this failed, roll back the operation
        mysqlHelper.removeTableRow(User.typename, {
          fields: [{ field: "id", value: addResults.id }],
        });

        throw err;
      });

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

  // syncs the user record with the firebase auth record
  async syncRecord(req, args: any, query?: object) {
    //check if record exists
    const results = await mysqlHelper.fetchTableRows({
      select: [{ field: "id" }, { field: "role" }],
      from: User.typename,
      where: {
        fields: [{ field: "id", value: args.id }],
      },
    });

    if (results.length < 1) {
      throw errorHelper.generateError("Item not found", 404);
    }

    // make sure email field, if provided, matches the firebase user email
    if ("email" in args) {
      const userRecord = await admin.auth().getUser(String(args.id));
      args.email = userRecord.email;
    }

    await Resolver.updateTableRow(
      this.typename,
      req,
      {
        ...args,
      },
      {
        updated_at: "now()",
      },
      { fields: [{ field: "id", value: args.id }] }
    );

    return this.getRecord(req, { id: args.id }, query);
  }

  async updateRecord(req, args = <any>{}, query?: object) {
    if (!req.user) throw errorHelper.loginRequiredError();

    //if it does not pass the access control, throw an error
    if (!(await this.testPermissions("update", req, args, query))) {
      throw errorHelper.badPermissionsError();
    }

    //check if record exists
    const results = await mysqlHelper.fetchTableRows({
      select: [{ field: "id" }, { field: "role" }],
      from: User.typename,
      where: {
        fields: [{ field: "id", value: args.id }],
      },
    });

    if (results.length < 1) {
      throw errorHelper.generateError("Item not found", 404);
    }

    // separate id from updateArgs
    const { id, ...updateArgs } = args;

    //check if target user is more senior admin
    if (
      userRoleKenum[results[0].role] === "ADMIN" &&
      results[0].id < req.user.id
    ) {
      throw errorHelper.generateError(
        "Cannot update more senior admin user",
        401
      );
    }

    await Resolver.updateTableRow(
      this.typename,
      req,
      updateArgs,
      {
        updated_at: "now()",
      },
      { fields: [{ field: "id", value: args.id }] }
    );

    // update firebase user fields
    const firebaseUserFields = {
      ...("name" in args && { displayName: args.name }),
      ...("avatar" in args && { photoURL: args.avatar }),
      ...("email" in args && { email: args.email }),
      ...("password" in args && { password: args.password }),
    };

    if (Object.keys(firebaseUserFields).length > 0) {
      await admin.auth().updateUser(String(args.id), firebaseUserFields);
    }

    const returnData = this.getRecord(req, { id: args.id }, query);

    //check subscriptions table where companyUpdated and id = 1.
    const validatedArgs = {
      id: args.id,
    };

    handleJqlSubscriptionTrigger(
      req,
      this,
      this.typename + "Updated",
      validatedArgs
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

    // remove firebase auth user
    await admin.auth().deleteUser(String(args.id));

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
