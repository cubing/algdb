import { Service, mysqlHelper, resolverHelper, subscriptionHelper } from '../../jql';

import errorHelper from '../../helpers/tier0/error';

import { userRole } from '../enums';

import { generateItemCreatedByUserGuard, generateUserAdminGuard } from '../../helpers/tier2/permissions'

export class User extends Service {
  static __typename = 'user';

  static paginator = Service.generatePaginatorService(User);

  static presets = {
    default: {
      id: null,
      uid: null,
      email: null,
      display_name: null,
      display_image: null,
      date_created: null,
      date_modified: null
    }
  };
  
  static filterFieldsMap = {
    id: {},
    "created_by": {},
    "created_by.name": {},
  };

  static sortFieldsMap = {
    id: {},
    created_at: {},
  };

  static isFilterRequired = false;

  static accessControl = {
    get: () => true,

    getMultiple: () => true,

    create: () => true,

    update: generateUserAdminGuard(),

    delete: generateItemCreatedByUserGuard(User),
  }

  static async createRecord(req, args = <any> {}, query?: object, admin = false) {
    //if it does not pass the access control, throw an error
    if(!admin && !await this.testPermissions('create', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }

    const addResults = await resolverHelper.addTableRow(this.__typename, {
      ...args,
    }, { created_by: 0 });

    //set created_by to id
    await mysqlHelper.executeDBQuery("UPDATE user SET created_by = id WHERE id = :id", {
      id: addResults.id
    });

    const validatedArgs = {
      created_by: addResults.id
    };

    subscriptionHelper.handleJqlSubscriptionTriggerIterative(req, this, this.__typename + 'Created', validatedArgs, { id: addResults.id });

    //always allowed to return the user you just created
    return this.getRecord(req, { id: addResults.id }, query, true);
  }

  static async updateRecord(req, args = <any> {}, query?: object) {
    if(!req.user) throw errorHelper.loginRequiredError();

    //if it does not pass the access control, throw an error
    if(!await this.testPermissions('update', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }

    //check if record exists
    const results = await mysqlHelper.executeDBQuery("SELECT id, role FROM user WHERE id = :id", {
      id: args.id
    });

    if(results.length < 1) {
      throw errorHelper.generateError('Item not found', 404);
    }

    //check if target user is more senior admin
    if(userRole[results[0].role] === "ADMIN" && (results[0].id < req.user.id)) {
      throw errorHelper.generateError('Cannot update more senior admin user', 401); 
    }
    
    await resolverHelper.updateTableRow(this.__typename, {
      ...args,
    }, {
      date_modified: null
    }, [{ fields: [ { field: "id", value: args.id } ] }]);
    

    const returnData = this.getRecord(req, { id: args.id }, query);

    //check subscriptions table where companyUpdated and id = 1.
    const validatedArgs = {
      id: args.id
    };

    subscriptionHelper.handleJqlSubscriptionTrigger(req, this, this.__typename + 'Updated', validatedArgs);

    return returnData;
  }
};