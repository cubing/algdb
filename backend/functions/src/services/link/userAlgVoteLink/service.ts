import { Service } from '../../core/service';

import { generateItemCreatedByUserGuard } from '../../../helpers/tier2/permissions'
import { generatePaginatorService } from '../../core/generators'

import errorHelper from '../../../helpers/tier0/error';
import { mysqlHelper, resolverHelper, subscriptionHelper } from 'jomql';

export class UserAlgVoteLink extends Service {
  static __typename = 'userAlgVoteLink';

  static paginator = generatePaginatorService(UserAlgVoteLink);

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

  static filterFieldsKeyMap = {
    id: {},
    alg: {},
    user: {}
  };

  static sortFieldsMap = {
    id: {},
    created_at: {},
  };

  static isFilterRequired = false;

  static accessControl = {
    update: generateItemCreatedByUserGuard(UserAlgVoteLink),
  };

  static async upsertRecord(req, args = <any> {}, query?: object) {
    //login required
    if(!req.user) throw errorHelper.loginRequiredError();

    //alg required
    if(!args.alg) throw errorHelper.missingParamsError();

    //vote value of 1, -1, or 0 required
    args.vote_value = parseInt(args.vote_value);
    if(args.vote_value !== -1 && args.vote_value !== 1 && args.vote_value !== 0) {
      throw errorHelper.generateError("Invalid vote value");
    }
    
    //check if record exists
    const records = await mysqlHelper.executeDBQuery("SELECT id FROM userAlgVoteLink WHERE user = :user AND alg = :alg", {
      user: req.user.id,
      alg: args.alg
    });

    let returnResults;

    //not exists, insert
    if(records.length < 1) {


      returnResults = await this.createRecord(req, { ...args, user: req.user.id }, query);
    } else {
      //exists, update
      returnResults = await this.updateRecord(req, { ...args, id: records[0].id }, query);
    }

    //always re-calculate the alg's score
    await mysqlHelper.executeDBQuery("UPDATE alg SET score = (SELECT sum(vote_value) FROM userAlgVoteLink WHERE alg = :alg) WHERE id = :alg", {
      alg: args.alg
    });

    return returnResults;
  }

  static async createRecord(req, args = <any> {}, query?: object, admin = false) {
    //if it does not pass the access control, throw an error
    if(!admin && !await this.testPermissions('create', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }

    if(!args.alg) throw errorHelper.missingParamsError();

    //check if alg exists
    const algResults = await mysqlHelper.executeDBQuery("SELECT id FROM alg WHERE id = :id", {
      id: args.alg
    });

    if(algResults.length < 1) throw errorHelper.generateError("Invalid alg");

    const addResults = await resolverHelper.addTableRow(this.__typename, {
      ...args,
    }, {
      created_by: req.user.id
    });

    const validatedArgs = {
      created_by: req.user.id
    };

    subscriptionHelper.handleJqlSubscriptionTriggerIterative(req, this, this.__typename + 'Created', validatedArgs, { id: addResults.id });

    return this.getRecord(req, { id: addResults.id }, query);
  }
};