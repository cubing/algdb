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
    id: {
      field: "id",
    },
    created_by: {
      field: "created_by",
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
};