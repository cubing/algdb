import { PaginatedService } from "../core/services";
import { generatePaginatorService } from "../core/generators";

import { generateUserRoleGuard } from "../../helpers/tier2/permissions";
import { userRoleEnum } from "../enums";

export class AlgcaseService extends PaginatedService {
  __typename = "algcase";

  paginator = generatePaginatorService(this);

  presets = {
    default: {
      id: null,
      uid: null,
      email: null,
      display_name: null,
      display_image: null,
      date_created: null,
      date_modified: null,
    },
  };

  filterFieldsMap = {
    id: {},
    created_by: {},
    "created_by.name": {},
    algset: {},
    subset: {},
  };

  filterFieldsKeyMap = {
    id: {},
    code: {},
    puzzle_code: {
      field: "puzzle.code",
    },
  };

  sortFieldsMap = {
    id: {},
    created_at: {},
  };

  searchFieldsMap = {
    name: {},
  };

  isFilterRequired = false;

  accessControl = {
    get: () => true,

    getMultiple: () => true,

    update: generateUserRoleGuard([userRoleEnum.ADMIN]),
    create: generateUserRoleGuard([userRoleEnum.ADMIN]),
    delete: generateUserRoleGuard([userRoleEnum.ADMIN]),
  };
}
