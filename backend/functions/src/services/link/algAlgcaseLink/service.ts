import { generateUserAdminGuard } from '../../../helpers/tier2/permissions'

import errorHelper from '../../../helpers/tier0/error';
import { serviceHelper, mysqlHelper, resolverHelper, subscriptionHelper } from 'jomql';

export class AlgAlgcaseLink extends serviceHelper.Service {
  static __typename = 'algAlgcaseLink';

  static paginator = serviceHelper.Service.generatePaginatorService(AlgAlgcaseLink);

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
    "alg": {},
    "algcase": {},
    "algcase_name": {
      field: "algcase.name"
    },
    "algcase_subset": {
      field: "algcase.subset"
    },
    "algcase_subset_name": {
      field: "algcase.subset.name"
    },
    "algcase_algset": {
      field: "algcase.algset"
    },
    "algcase_algset_name": {
      field: "algcase.algset.name"
    },
    "algcase_puzzle": {
      field: "algcase.puzzle"
    },
    "algcase_puzzle_name": {
      field: "algcase.puzzle.name"
    },
    "tag_name": {
      field: "tag.name",
      joinFields: [
        { field: "alg", table: "algTagLink", foreignField: "alg" },
      ]
    }
  };

  static sortFieldsMap = {
    id: {},
    created_at: {},
    "algcase.subset.name": {}
  };

  static groupByFieldsMap = {
    "alg": {},
  };

  static searchFieldsMap = {
    "algcase.subset.name": {}
  };

  static isFilterRequired = false;

  static accessControl = {
    update: generateUserAdminGuard(),
    create: generateUserAdminGuard(),
    delete: generateUserAdminGuard()
  };

  static async createRecord(req, args = <any> {}, query?: object) {
    if(!req.user) throw errorHelper.loginRequiredError();

    if(!args.alg && !args.algcase) throw errorHelper.missingParamsError();

    //if it does not pass the access control, throw an error
    if(!await this.testPermissions('create', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }

    //verify alg exists
    const algResults = await mysqlHelper.executeDBQuery("SELECT id FROM alg WHERE id = :id", { id: args.alg });

    if(algResults.length < 1) throw errorHelper.generateError("Invalid alg");

    //verify algcase exists
    const algcaseResults = await mysqlHelper.executeDBQuery("SELECT id FROM algcase WHERE id = :id", { id: args.algcase });

    if(algcaseResults.length < 1) throw errorHelper.generateError("Invalid algcase");

    const addResults = await resolverHelper.addTableRow(this.__typename, {
      ...args,
    }, { created_by: req.user.id }, true);

    const validatedArgs = {
      created_by: req.user.id
    };

    subscriptionHelper.handleJqlSubscriptionTriggerIterative(req, this, this.__typename + 'Created', validatedArgs, { id: addResults.id });

    return this.getRecord(req, { id: addResults.id }, query);
  }
};