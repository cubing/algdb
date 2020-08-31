import Service from '../../core/service'
import generatePaginatorService from '../../core/generator/paginator.service'
import { generateUserAdminGuard } from '../../../helpers/tier2/permissions'

import errorHelper from '../../../helpers/tier0/error';
import resolverHelper from '../../../helpers/tier2/resolver';
import mysqlHelper from '../../../helpers/tier1/mysql';
import { handleJqlSubscriptionTriggerIterative, handleJqlSubscriptionTrigger } from '../../../helpers/tier3/subscription'

export class UserAlgTagLink extends Service {
  static __typename = 'userAlgTagLink';

  static paginator = generatePaginatorService(UserAlgTagLink);

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
    },
    alg: {
      field: "alg"
    },
    user: {
      field: "user"
    },
    tag: {
      field: "tag",
    },
  };

  static isFilterRequired = false;

  static searchableFields = ["name"];

  static sortFields = ["id", "created_by"];

  static accessControl = {
    update: generateUserAdminGuard(),
    create: generateUserAdminGuard(),
    delete: generateUserAdminGuard()
  };

  static async createRecord(req, args = <any> {}, query?: object) {
    if(!req.user) throw errorHelper.loginRequiredError();

    if(!args.alg && !args.tag) throw errorHelper.missingParamsError();

    //if it does not pass the access control, throw an error
    if(!await this.testPermissions('create', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }

    //verify alg exists
    const algResults = await mysqlHelper.executeDBQuery("SELECT id FROM alg WHERE id = :id", { id: args.alg });

    if(algResults.length < 1) throw errorHelper.generateError("Invalid alg");

    //verify tag exists
    const tagResults = await mysqlHelper.executeDBQuery("SELECT id FROM tag WHERE id = :id", { id: args.tag });

    if(tagResults.length < 1) throw errorHelper.generateError("Invalid tag");

    const addResults = await resolverHelper.addTableRow(this.__typename, {
      ...args,
      user: req.user.id,
      created_by: req.user.id
    }, true);

    const validatedArgs = {
      created_by: req.user.id
    };

    handleJqlSubscriptionTriggerIterative(req, this, this.__typename + 'Created', validatedArgs, { id: addResults.id });

    return this.getRecord(req, { id: addResults.id }, query);
  }
};