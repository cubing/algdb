import Service from '../core/service'
import generatePaginatorService from '../core/generator/paginator.service'
import { generateUserRoleGuard } from '../../helpers/tier2/permissions'

import { AlgAlgcaseLink } from '../services';

import errorHelper from '../../helpers/tier0/error';
import resolverHelper from '../../helpers/tier2/resolver';
import mysqlHelper from '../../helpers/tier1/mysql';
import { handleJqlSubscriptionTriggerIterative, handleJqlSubscriptionTrigger } from '../../helpers/tier3/subscription'

import { userRole } from '../enums';

export class Alg extends Service {
  static __typename = 'alg';

  static paginator = generatePaginatorService(Alg);

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

  static searchableFields = ["name"];

  static accessControl = {
    update: async function(req, args, query) {
      //if args.is_approved is provided, check permissions
      if("is_approved" in args) {
        return generateUserRoleGuard([userRole.ADMIN, userRole.MODERATOR])(req, args, query);
      }

      //else pass
      return true;
    },
    create: generateUserRoleGuard([userRole.ADMIN]),
    delete: generateUserRoleGuard([userRole.ADMIN]),
  };

  static async createRecord(req, args = <any> {}, query?: object) {
    if(!req.user) throw errorHelper.loginRequiredError();

    //algcase required
    if(!args.algcase) throw errorHelper.missingParamsError();

    //if it does not pass the access control, throw an error
    if(!await this.testPermissions('create', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }
    
    //verify algcase exists
    const algcaseResults = await mysqlHelper.executeDBQuery("SELECT id FROM algcase WHERE id = :id", { id: args.algcase });

    if(algcaseResults.length < 1) throw errorHelper.generateError("Invalid algcase");

    const addResults = await resolverHelper.addTableRow(this.__typename, {
      ...args,
      created_by: req.user.id
    });

    //create algAlgcaseLink
    await resolverHelper.addTableRow(AlgAlgcaseLink.__typename, {
      alg: addResults.id,
      algcase: args.algcase
    }, { created_by: req.user.id });

    const validatedArgs = {
      created_by: req.user.id
    };

    handleJqlSubscriptionTriggerIterative(req, this, this.__typename + 'Created', validatedArgs, { id: addResults.id });

    return this.getRecord(req, { id: addResults.id }, query);
  }
};