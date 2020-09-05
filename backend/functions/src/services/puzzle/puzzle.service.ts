import Service from '../core/service'
import generatePaginatorService from '../core/generator/paginator.service'
import { generateUserAdminGuard } from '../../helpers/tier2/permissions'

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
  };

  static sortFieldsMap = {
    id: {},
    created_at: {},
  };

  static isFilterRequired = false;

  static searchableFields = ["name"];

  static accessControl = {
    update: generateUserAdminGuard(),
    create: generateUserAdminGuard(),
    delete: generateUserAdminGuard()
  };
};