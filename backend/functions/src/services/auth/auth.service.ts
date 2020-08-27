import Service from '../core/service';

import * as bcrypt from 'bcryptjs';
import axios from 'axios';
import errorHelper from '../../helpers/tier0/error';
import mysqlHelper from '../../helpers/tier1/mysql';
import resolverHelper from '../../helpers/tier2/resolver';
import { handleJqlSubscriptionTriggerIterative } from '../../helpers/tier3/subscription'

export class Auth extends Service {
  static __typename = 'auth';
  
  static presets = {
    default: {
      id: null,
      name: null,
      created_by: {
        id: null,
        name: null
      }
    }
  };

  static filterFieldsMap = {};

  static isFilterRequired = false;

  static searchableFields = [];

  static sortFields = [];
  
  static accessControl = {};

  static async loginUser(req, args, query) {
    if(!args.email || !args.password) {
      throw errorHelper.missingParamsError();
    }

    //lookup hashed password by email
    const userResults = await mysqlHelper.executeDBQuery("SELECT id, email, password FROM user WHERE email = :email", {
      email: args.email
    });

    if(userResults.length < 1) {
      throw errorHelper.itemNotFoundError();
    }

    //if saved password is null, cannot login normally, must be socialLogin
    if(!userResults[0].password) {
      throw errorHelper.generateError("Cannot login with password");
    }

    //bcrypt compare to args.password
    const passed = await bcrypt.compare(args.password, userResults[0].password);

    if(!passed) {
      throw errorHelper.generateError("Invalid email/password combo");
    }

    //if OK, return auth payload
    return this.getRecord(req, {
      id: userResults[0].id,
      email: userResults[0].email
    }, query);
  }

  static async socialLogin(req, args, query) {
    if(!args.provider || !args.code) {
      throw errorHelper.missingParamsError();
    }

    //only wca supported at the moment
    if(args.provider !== "wca") {
      throw errorHelper.generateError("Invalid social login provider");
    }

    //get the access token from the code
    const { data } = await axios.post("https://www.worldcubeassociation.org/oauth/token", {
      grant_type: "authorization_code",
      client_id: "application_id",
      client_secret: "secret",
      code: args.code,
      redirect_uri: "123"
    });

    //hit the /me route to get the user info
    const { data: wcaData } = await axios.get("https://www.worldcubeassociation.org/api/v0/me", {
      headers: {
        Authorization: "Bearer " + data.access_token
      }
    });

    //lookup user by email
    const userResults = await mysqlHelper.executeDBQuery("SELECT id, email FROM user where email = :email", {
      email: wcaData.me.email
    });

    //not found, create a new user (copied from user.service)
    if(userResults.length < 1) {
      const addResults = await resolverHelper.addTableRow(this.__typename, {
        email: wcaData.me.email,
        created_by: 0
      });
  
      //set created_by to id
      await mysqlHelper.executeDBQuery("UPDATE user SET created_by = id WHERE id = :id", {
        id: addResults.id
      });

      userResults.push({ id: addResults.id, email: wcaData.me.email })

      const validatedArgs = {
        created_by: addResults.id
      };

      handleJqlSubscriptionTriggerIterative(req, this, this.__typename + 'Created', validatedArgs, { id: addResults.id });
    }

    //if OK, return auth payload
    return this.getRecord(req, {
      id: userResults[0].id,
      email: userResults[0].email
    }, query);
  }

};