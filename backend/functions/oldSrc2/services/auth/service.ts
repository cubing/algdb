import { User } from "../services";
import { Service } from "../core/services";
import { env } from "../../config";
import * as bcrypt from "bcryptjs";
import axios from "axios";
import * as errorHelper from "../../helpers/tier0/error";
import { mysqlHelper } from "jomql";

export class AuthService extends Service {
  __typename = "auth";

  presets = {
    default: {
      id: null,
      name: null,
      created_by: {
        id: null,
        name: null,
      },
    },
  };

  filterFieldsMap = {};

  hasKeys = false;

  sortFieldsMap = {};

  isFilterRequired = false;

  accessControl = {};

  async loginUser(req, args, query) {
    if (!args.email || !args.password) {
      throw errorHelper.missingParamsError();
    }

    //lookup hashed password by email
    const userResults = await mysqlHelper.executeDBQuery(
      "SELECT id, email, password FROM user WHERE email = :email",
      {
        email: args.email,
      }
    );

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
      return User.registerUser(
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