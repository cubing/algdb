import { generateUserAdminGuard } from '../../helpers/tier2/permissions'

import errorHelper from '../../helpers/tier0/error';
import { serviceHelper, mysqlHelper, resolverHelper, subscriptionHelper } from 'jomql';

export class Algcase extends serviceHelper.Service {
  static __typename = 'algcase';

  static paginator = serviceHelper.Service.generatePaginatorService(Algcase);

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
    "algset": {},
    "subset": {},
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

    //algset OR subset required
    if(!args.algset && !args.subset) throw errorHelper.missingParamsError();

    //if it does not pass the access control, throw an error
    if(!await this.testPermissions('create', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }
    
    let addResults;

    //if subset provided, process that
    if(args.subset) {
      //verify subset exists, and get the puzzle_id and algset_id
      const subsetResults = await mysqlHelper.executeDBQuery("SELECT puzzle, algset FROM subset WHERE id = :id", { id: args.subset });

      if(subsetResults.length < 1) throw errorHelper.generateError("Invalid subset");

      addResults = await resolverHelper.addTableRow(this.__typename, {
        ...args,
        puzzle: subsetResults[0].puzzle,
        algset: subsetResults[0].algset,
      }, { created_by: req.user.id });
      //else process the algset
    } else {
      //verify algset exists, and get the puzzle_id
      const algsetResults = await mysqlHelper.executeDBQuery("SELECT puzzle FROM algset WHERE id = :id", { id: args.algset });

      if(algsetResults.length < 1) throw errorHelper.generateError("Invalid algset");

      addResults = await resolverHelper.addTableRow(this.__typename, {
        ...args,
        puzzle: algsetResults[0].puzzle,
        created_by: req.user.id
      });
    }

    const validatedArgs = {
      created_by: req.user.id
    };

    subscriptionHelper.handleJqlSubscriptionTriggerIterative(req, this, this.__typename + 'Created', validatedArgs, { id: addResults.id });

    return this.getRecord(req, { id: addResults.id }, query);
  }
};