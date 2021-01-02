import { PaginatedService } from "../../core/services";
import { generateUserRoleGuard } from "../../helpers/permissions";
import { userRoleKenum } from "../../kenums";

export class PuzzleService extends PaginatedService {
  defaultTypename = "puzzle";

  filterFieldsMap = {
    id: {},
    created_by: {},
    code: {},
    is_public: {},
  };

  uniqueKeyMap = {
    primary: ["id"],
    secondary: ["code"],
  };

  sortFieldsMap = {
    id: {},
    created_at: {},
  };

  searchFieldsMap = {
    name: {},
  };

  groupByFieldsMap = {};

  isFilterRequired = false;

  accessControl = {
    get: () => true,

    getMultiple: () => true,

    update: generateUserRoleGuard([userRoleKenum.ADMIN]),
    create: generateUserRoleGuard([userRoleKenum.ADMIN]),
    delete: generateUserRoleGuard([userRoleKenum.ADMIN]),
  };
}
