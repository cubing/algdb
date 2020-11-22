import { Service } from '../core/service';

import { generateUserRoleGuard } from '../../helpers/tier2/permissions'

import errorHelper from '../../helpers/tier0/error';

import { resolverHelper } from 'jomql';

import { userRole } from '../enums';
import { generatePaginatorService } from '../core/generators'

export class Puzzle extends Service {
  static __typename = 'puzzle';

  static paginator = generatePaginatorService(Puzzle);

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
    "code": {},
    "is_public": {},
  };

  static filterFieldsKeyMap = {
    id: {},
    code: {},
  };

  static sortFieldsMap = {
    id: {},
    created_at: {},
  };

  static isFilterRequired = false;

  static accessControl = {
    getMultiple: async function(req, args, query) {
      //if args.is_public !== true or Array containing !== true, check permissions
      const isPublic = args?.filterBy?.is_public;
      if(Array.isArray(isPublic) ? isPublic.includes(false) : isPublic !== true) {
        return generateUserRoleGuard([userRole.ADMIN, userRole.MODERATOR])(req, args, query);
      }

      //else pass
      return true;
    },
    update: generateUserRoleGuard([userRole.ADMIN]),
    create: generateUserRoleGuard([userRole.ADMIN]),
    delete: generateUserRoleGuard([userRole.ADMIN]),
  };

  static async getRecordByCode(req, args, query?: object, admin = false) {
    const selectQuery = query || Object.assign({}, this.presets.default);

    //if it does not pass the access control, throw an error
    if(!admin && !await this.testPermissions('get', req, args, query)) {
      throw errorHelper.badPermissionsError();
    }

    const results = await resolverHelper.resolveTableRows(this.__typename, this, req, {
      select: selectQuery,
      where: [
        {
          fields: [
            { field: "code", value: args.code }
          ]
        }
      ]
    }, args);

    if(results.length < 1) {
      throw errorHelper.itemNotFoundError();
    }

    return results[0];
  }
};
