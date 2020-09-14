import { generateUserRoleGuard } from '../../helpers/tier2/permissions'

import { userRole } from '../enums';

import errorHelper from '../../helpers/tier0/error';
import { serviceHelper, mysqlHelper, resolverHelper, subscriptionHelper } from 'jamesql';

export class Algset extends serviceHelper.Service {
  static __typename = 'algset';

  static paginator = serviceHelper.Service.generatePaginatorService(Algset);

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
    "puzzle": {},
    "puzzle_code": {
      field: "puzzle.code"
    }
  };

  static filterFieldsKeyMap = {
    id: {},
    code: {},
    "puzzle_code": {
      field: "puzzle.code"
    }
  };

  static sortFieldsMap = {
    id: {},
    created_at: {},
  };

  static isFilterRequired = false;

  static accessControl = {
    getMultiple: async function(req, args, query) {
      //if args.is_public !== true or Array containing !== true, check permissions
      if(Array.isArray(args.is_public) ? args.is_public.includes(false) : args.is_public !== true) {
        return generateUserRoleGuard([userRole.ADMIN, userRole.MODERATOR])(req, args, query);
      }

      //else pass
      return true;
    },
    update: generateUserRoleGuard([userRole.ADMIN]),
    create: generateUserRoleGuard([userRole.ADMIN]),
    delete: generateUserRoleGuard([userRole.ADMIN]),
  };

  static async createRecord(req, args = <any> {}, query?: object) {
    if(!req.user) throw errorHelper.loginRequiredError();

    //puzzle required
    if(!args.puzzle) throw errorHelper.missingParamsError();

    //if it does not pass the access control, throw an error
    if(!await this.testPermissions('create', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }

    //verify puzzle exists
    const puzzleResults = await mysqlHelper.executeDBQuery("SELECT id FROM puzzle WHERE id = :id", { id: args.puzzle });

    if(puzzleResults.length < 1) throw errorHelper.generateError("Invalid puzzle");

    const addResults = await resolverHelper.addTableRow(this.__typename, {
      ...args,
    }, { created_by: req.user.id });

    const validatedArgs = {
      created_by: req.user.id
    };

    subscriptionHelper.handleJqlSubscriptionTriggerIterative(req, this, this.__typename + 'Created', validatedArgs, { id: addResults.id });

    return this.getRecord(req, { id: addResults.id }, query);
  }
};