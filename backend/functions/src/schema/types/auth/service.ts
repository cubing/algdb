import { SimpleService } from "../../core/services";
import * as bcrypt from "bcryptjs";
import * as errorHelper from "../../helpers/error";
import { User } from "../../services";
import * as mysqlHelper from "../../helpers/mysql";
import { env } from "../../../config";
import axios from "axios";
import { ServiceFunctionInputs } from "../../../types";

export class AuthService extends SimpleService {
  defaultTypename = "auth";

  accessControl = {
    "*": () => true,
  };

  async loginUser({
    req,
    fieldPath,
    args,
    query,
    isAdmin = false,
  }: ServiceFunctionInputs) {
    // lookup hashed password by email
    const userResults = await mysqlHelper.fetchTableRows({
      select: [{ field: "id" }, { field: "email" }, { field: "password" }],
      from: User.typename,
      where: {
        fields: [{ field: "email", value: args.email }],
      },
    });

    if (userResults.length < 1) {
      throw errorHelper.itemNotFoundError(fieldPath);
    }

    //if saved password is null, cannot login normally, must be socialLogin
    if (!userResults[0].password) {
      throw errorHelper.generateError("Cannot login with password", fieldPath);
    }

    //bcrypt compare to args.password
    const passed = await bcrypt.compare(args.password, userResults[0].password);

    if (!passed) {
      throw errorHelper.generateError(
        "Invalid email/password combo",
        fieldPath
      );
    }

    //if OK, return auth payload
    return this.getRecord({
      req,
      args: {
        id: userResults[0].id,
        email: userResults[0].email,
      },
      query,
      fieldPath,
    });
  }

  async socialLogin({
    req,
    fieldPath,
    args,
    query,
    isAdmin = false,
  }: ServiceFunctionInputs) {
    //only wca supported at the moment
    if (args.provider !== "wca") {
      throw errorHelper.generateError(
        "Invalid social login provider",
        fieldPath
      );
    }

    const wcaSite = axios.create({
      baseURL: env.wca.base_url,
    });

    //get the access token from the code
    const {
      data: { access_token },
    } = await wcaSite.post("oauth/token", {
      grant_type: "authorization_code",
      client_id: env.wca.client_id,
      client_secret: env.wca.client_secret,
      code: args.code,
      redirect_uri: args.redirect_uri,
    });

    //hit the /me route to get the user info
    const { data: wcaData } = await wcaSite.get("api/v0/me", {
      headers: {
        Authorization: "Bearer " + access_token,
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
      return User.createRecord({
        req,
        args: {
          provider: args.provider,
          provider_id: wcaData.me.id,
          wca_id: wcaData.me.wca_id,
          email: wcaData.me.email,
          name: wcaData.me.name,
          avatar: wcaData.me.avatar.url,
          country: wcaData.me.country_iso2,
        },
        query,
        fieldPath,
        isAdmin: true,
      });
    }

    //if OK, return auth payload
    return this.getRecord({
      req,
      args: {},
      fieldPath,
      query,
      data: {
        id: userResults[0].id,
        email: userResults[0].email,
      },
    });
  }
}
