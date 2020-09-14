import { generateUserRoleGuard } from '../../helpers/tier2/permissions'

import { AlgAlgcaseLink } from '../services';

import errorHelper from '../../helpers/tier0/error';
import { serviceHelper, mysqlHelper, resolverHelper, subscriptionHelper } from 'jamesql';

import { userRole } from '../enums';

export class Alg extends serviceHelper.Service {
  static __typename = 'alg';

  static paginator = serviceHelper.Service.generatePaginatorService(Alg);

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
    "algcase_name": {
      field: "algcase.name",
      joinFields: [
        { field: "id", table: "algAlgcaseLink", foreignField: "alg" },
      ]
    },
    "algcase": {
      field: "algcase",
      joinFields: [
        { field: "id", table: "algAlgcaseLink", foreignField: "alg" },
      ]
    },
    "subset_name": {
      field: "algcase.subset.name",
      joinFields: [
        { field: "id", table: "algAlgcaseLink", foreignField: "alg" },
      ]
    },
    "algset_name": {
      field: "algcase.algset.name",
      joinFields: [
        { field: "id", table: "algAlgcaseLink", foreignField: "alg" },
      ]
    },
    "puzzle_name": {
      field: "algcase.puzzle.name",
      joinFields: [
        { field: "id", table: "algAlgcaseLink", foreignField: "alg" },
      ]
    },
    "tag_name": {
      field: "tag.name",
      joinFields: [
        { field: "id", table: "algTagLink", foreignField: "alg" },
      ]
    }
  };

  static sortFieldsMap = {
    id: {},
    created_at: {},
  };

  static searchFieldsMap = {
    sequence: {}
  };

  static groupByFieldsMap = {
    "id": {},
  };

  static isFilterRequired = false;

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

    subscriptionHelper.handleJqlSubscriptionTriggerIterative(req, this, this.__typename + 'Created', validatedArgs, { id: addResults.id });

    return this.getRecord(req, { id: addResults.id }, query);
  }
};