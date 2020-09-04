import Service from '../core/service'
import generatePaginatorService from '../core/generator/paginator.service'
import { generateUserAdminGuard } from '../../helpers/tier2/permissions'

import errorHelper from '../../helpers/tier0/error';
import resolverHelper from '../../helpers/tier2/resolver';
import mysqlHelper from '../../helpers/tier1/mysql';
import { handleJqlSubscriptionTriggerIterative } from '../../helpers/tier3/subscription'

export class Algset extends Service {
  static __typename = 'algset';

  static paginator = generatePaginatorService(Algset);

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
    puzzle: {
      field: "puzzle",
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
    update: generateUserAdminGuard(),
    create: generateUserAdminGuard(),
    delete: generateUserAdminGuard()
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

    handleJqlSubscriptionTriggerIterative(req, this, this.__typename + 'Created', validatedArgs, { id: addResults.id });

    return this.getRecord(req, { id: addResults.id }, query);
  }
};