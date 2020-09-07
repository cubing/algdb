import Service from '../core/service'
import generatePaginatorService from '../core/generator/paginator.service'
import { generateUserRoleGuard } from '../../helpers/tier2/permissions'

import { userRole } from '../enums';

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
    "is_public": {},
  };

  static sortFieldsMap = {
    id: {},
    created_at: {},
  };

  static isFilterRequired = false;

  static searchableFields = ["name"];

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
};