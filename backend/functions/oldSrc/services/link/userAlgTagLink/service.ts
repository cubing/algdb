import { Service } from '../../core/service';

import { generateUserAdminGuard } from '../../../helpers/tier2/permissions'
import { generatePaginatorService } from '../../core/generators'

import errorHelper from '../../../helpers/tier0/error';
import { mysqlHelper, resolverHelper, subscriptionHelper } from 'jomql';

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
    id: {},
    "created_by": {},
    "created_by.name": {},
    "alg": {},
    "user": {},
    "tag": {},
  };

  static sortFieldsMap = {
    id: {},
    created_at: {},
  };

  static isFilterRequired = false;

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
    /*
    const tagResults = await mysqlHelper.executeDBQuery("SELECT id FROM tag WHERE id = :id", { id: args.tag });

    if(tagResults.length < 1) throw errorHelper.generateError("Invalid tag");
    */
   
    const addResults = await resolverHelper.addTableRow(this.__typename, {
      ...args,
      user: req.user.id,
    }, { created_by: req.user.id }, true);

    const validatedArgs = {
      created_by: req.user.id
    };

    subscriptionHelper.handleJqlSubscriptionTriggerIterative(req, this, this.__typename + 'Created', validatedArgs, { id: addResults.id });

    return this.getRecord(req, { id: addResults.id }, query);
  }
};