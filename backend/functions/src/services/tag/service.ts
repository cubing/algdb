import { Service } from '../core/service';

import { generateUserRoleGuard } from '../../helpers/tier2/permissions'

import { userRole } from '../enums';

export class Tag extends Service {
  static __typename = 'tag';

  static paginator = Service.generatePaginatorService(Tag);

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
  };

  static sortFieldsMap = {
    id: {},
    created_at: {},
  };

  static isFilterRequired = false;

  static sortFields = ["id", "created_by"];

  static accessControl = {
    create: generateUserRoleGuard([userRole.MODERATOR, userRole.ADMIN]),
    delete: generateUserRoleGuard([userRole.MODERATOR, userRole.ADMIN]),
  };
};