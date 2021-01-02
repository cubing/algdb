import { SimpleService } from "../../core/services";

import { handleJqlSubscriptionTriggerIterative } from "../../helpers/subscription";
import * as Resolver from "../../resolvers/resolver";
import * as bcrypt from "bcryptjs";
import * as errorHelper from "../../helpers/error";
import { User } from "../../services";
import { userRoleKenum } from "../../kenums";
import * as admin from "firebase-admin";
import * as mysqlHelper from "../../helpers/mysql";
import { env } from "../../../config";
import axios from "axios";

export class AuthService extends SimpleService {
  defaultTypename = "auth";

  accessControl = {
    "*": () => true,
  };

  async loginUser(req, args, query) {
    if (!args.email || !args.password) {
      throw errorHelper.missingParamsError();
    }

    // lookup hashed password by email
    const userResults = await mysqlHelper.fetchTableRows({
      select: [{ field: "id" }, { field: "email" }, { field: "password" }],
      from: User.typename,
      where: {
        fields: [{ field: "email", value: args.email }],
      },
    });

    if (userResults.length < 1) {
      throw errorHelper.itemNotFoundError();
    }

    //if saved password is null, cannot login normally, must be socialLogin
    if (!userResults[0].password) {
      throw errorHelper.generateError("Cannot login with password");
    }

    //bcrypt compare to args.password
    const passed = await bcrypt.compare(args.password, userResults[0].password);

    if (!passed) {
      throw errorHelper.generateError("Invalid email/password combo");
    }

    //if OK, return auth payload
    return this.getRecord(
      req,
      {
        id: userResults[0].id,
        email: userResults[0].email,
      },
      query
    );
  }

  async registerUser(req, args = <any>{}, query?: object, isAdmin = false) {
    //if it does not pass the access control, throw an error
    if (!isAdmin && !(await this.testPermissions("create", req, args, query))) {
      throw errorHelper.badPermissionsError();
    }

    // not allowed to specify role when registering
    if ("role" in args)
      throw errorHelper.generateError("Cannot specify role when registering");

    const addResults = await Resolver.addTableRow(
      User.typename,
      req,
      {
        ...args,
      },
      { created_by: 0 }
    );

    const updateFields = {};
    // if id === 1, is first user. give admin role
    if (addResults.id === 1) updateFields["role"] = userRoleKenum.ADMIN;

    //set created_by to id
    await mysqlHelper.updateTableRow(
      User.typename,
      updateFields,
      {
        created_by: "id",
      },
      {
        fields: [{ field: "id", value: addResults.id }],
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

    const validatedArgs = {
      created_by: addResults.id,
    };

    handleJqlSubscriptionTriggerIterative(
      req,
      User,
      User.typename + "Created",
      validatedArgs,
      { id: addResults.id }
    );

    //always allowed to return the user you just created
    //return this.getRecord(req, { id: addResults.id }, query, true);

    //return auth payload
    return this.getRecord(
      req,
      {
        id: addResults.id,
        email: args.email,
      },
      query
    );
  }

  async socialLogin(req, args, query) {
    if (!args.provider || !args.code || !args.redirect_uri) {
      throw errorHelper.missingParamsError();
    }

    //only wca supported at the moment
    if (args.provider !== "wca") {
      throw errorHelper.generateError("Invalid social login provider");
    }

    const wcaSite = axios.create({
      baseURL: env.wca.base_url,
    });

    //get the access token from the code
    const { data } = await wcaSite.post("oauth/token", {
      grant_type: "authorization_code",
      client_id: env.wca.client_id,
      client_secret: env.wca.client_secret,
      code: args.code,
      redirect_uri: args.redirect_uri,
    });

    //hit the /me route to get the user info
    const { data: wcaData } = await wcaSite.get("api/v0/me", {
      headers: {
        Authorization: "Bearer " + data.access_token,
      },
    });

    //lookup user by provider + provider_id
    const userResults = await mysqlHelper.executeDBQuery(
      "SELECT id, email FROM user WHERE provider = :provider AND provider_id = :provider_id",
      {
        provider: args.provider,
        provider_id: wcaData.me.id,
      }
    );

    //not found, create a new user (copied from user.service)
    if (userResults.length < 1) {
      return User.createRecord(
        req,
        {
          provider: args.provider,
          provider_id: wcaData.me.id,
          wca_id: wcaData.me.wca_id,
          email: wcaData.me.email,
          name: wcaData.me.name,
          avatar: wcaData.me.avatar.url,
          country: wcaData.me.country_iso2,
        },
        query,
        true
      );
    }

    //if OK, return auth payload
    return this.getRecord(
      req,
      {
        id: userResults[0].id,
        email: userResults[0].email,
      },
      query
    );
  }
}
