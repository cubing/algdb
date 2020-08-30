import Service from '../core/service'
import generatePaginatorService from '../core/generator/paginator.service'
import { generateUserAdminGuard } from '../../helpers/tier2/permissions'

import errorHelper from '../../helpers/tier0/error';
import resolverHelper from '../../helpers/tier2/resolver';
import mysqlHelper from '../../helpers/tier1/mysql';
import { handleJqlSubscriptionTriggerIterative, handleJqlSubscriptionTrigger, deleteJqlSubscription } from '../../helpers/tier3/subscription'

export class Subset extends Service {
  static __typename = 'subset';

  static paginator = generatePaginatorService(Subset);

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
    algset: {
      field: "algset"
    },
    parent: {
      field: "parent"
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

    //algset OR parent required
    if(!args.algset && !args.parent) throw errorHelper.missingParamsError();

    //if it does not pass the access control, throw an error
    if(!await this.testPermissions('create', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }
    
    let addResults;

    //if parent provided, process that
    if(args.parent) {
      //verify parent subset exists, and get the puzzle_id and algset_id
      const subsetResults = await mysqlHelper.executeDBQuery("SELECT puzzle, algset FROM subset WHERE id = :id", { id: args.parent });

      if(subsetResults.length < 1) throw errorHelper.generateError("Invalid parent");

      addResults = await resolverHelper.addTableRow(this.__typename, {
        ...args,
        puzzle: subsetResults[0].puzzle,
        algset: subsetResults[0].algset,
        created_by: req.user.id
      });
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

    handleJqlSubscriptionTriggerIterative(req, this, this.__typename + 'Created', validatedArgs, { id: addResults.id });

    return this.getRecord(req, { id: addResults.id }, query);
  }

  static async deleteRecord(req, args = <any> {}, query?: object) {
    if(!req.user) throw errorHelper.loginRequiredError();

    //if it does not pass the access control, throw an error
    if(!await this.testPermissions('delete', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }

    //check if any child subset
    const childSubsetResults = await mysqlHelper.executeDBQuery("SELECT id FROM subset WHERE parent = :parent", {
      parent: args.id
    });

    if(childSubsetResults.length > 0) throw errorHelper.generateError("Must delete all child subsets");

    //check if any child algcase 
    const childAlgcaseResults = await mysqlHelper.executeDBQuery("SELECT id FROM algcase WHERE subset = :subset", {
      subset: args.id
    });

    if(childAlgcaseResults.length > 0) throw errorHelper.generateError("Must remove all child algcase");

    //first, fetch the requested query
    const requestedResults = await this.getRecord(req, { id: args.id }, query);

    //check subscriptions table where companyDeleted and id = 1.
    const validatedArgs = {
      id: args.id
    };

    await handleJqlSubscriptionTrigger(req, this, this.__typename + 'Deleted', validatedArgs);

    await resolverHelper.deleteTableRow(this.__typename, args, [
      {
        fields: {
          id: { value: args.id }
        }
      }
    ]);

    //cleanup

    //also need to delete all subscriptions for this item
    await deleteJqlSubscription(req, this.__typename + 'Deleted', validatedArgs);

    //also need to delete all permissions attached to this item
    if(this.permissionsLink) {
      await resolverHelper.deleteTableRow(this.permissionsLink.__typename, args, [
        {
          fields: {
            [this.__typename]: { value: args.id }
          }
        }
      ]);
    }

    return requestedResults;
  }
};