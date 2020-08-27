import Service from '../core/service'
import generatePaginatorService from '../core/generator/paginator.service'
import generateAccessorService from '../core/generator/accessor.service'

import mysqlHelper from '../../helpers/tier1/mysql';
import errorHelper from '../../helpers/tier0/error';
import resolverHelper from '../../helpers/tier2/resolver';
import { handleJqlSubscriptionTriggerIterative } from '../../helpers/tier3/subscription'

import * as permissionsHelper from '../../helpers/tier2/permissions'

export class User extends Service {
  static __typename = 'user';

  static paginator = generatePaginatorService(User);

  static accessor = generateAccessorService(User)

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
    id: {
      field: "id",
    },
    created_by: {
      field: "created_by",
    },
    "created_by.name": {
      field: "created_by",
      foreignField: "name"
    }
  };

  static isFilterRequired = false;

  static searchableFields = ["name"];

  static sortFields = ["id", "created_by"];

  static accessControl = {
    get: permissionsHelper.generateCreatedByUser(User),

    getMultiple: (req, args, query) => {
      //check if logged in
      if(!req.user) return false;

      //anyone can, but they have to use certain filters, like created_by = current user
      if(args.created_by !== req.user.id) return false;

      return true;
    },

    create: (req, args, query) => {
      return true;
  
      //allow if permissionsLink (between user and this item) exists (can also check if some fields on there > some number)
    },

    update: permissionsHelper.generateCreatedByUser(User),

    delete: permissionsHelper.generateCreatedByUser(User),
  }

  static async createRecord(req, args = <any> {}, query?: object) {
    //if it does not pass the access control, throw an error
    if(!await this.testPermissions('create', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }

    const addResults = await resolverHelper.addTableRow(this.__typename, {
      ...args,
      created_by: 0
    });

    //set created_by to id
    await mysqlHelper.executeDBQuery("UPDATE user SET created_by = id WHERE id = :id", {
      id: addResults.id
    });

    const validatedArgs = {
      created_by: addResults.id
    };

    handleJqlSubscriptionTriggerIterative(req, this, this.__typename + 'Created', validatedArgs, { id: addResults.id });

    //always allowed to return the user you just created
    return this.getRecord(req, { id: addResults.id }, query, true);
  }
};