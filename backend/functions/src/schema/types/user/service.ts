import { PaginatedService } from "../../core/services";

import { generateUserRoleGuard } from "../../helpers/permissions";
import { userRoleKenum } from "../../enums";

export class UserService extends PaginatedService {
  defaultTypename = "user";

  filterFieldsMap = {
    id: {},
    created_by: {},
    "created_by.name": {},
    role: {},
  };

  sortFieldsMap = {
    id: {},
    created_at: {},
    updated_at: {},
  };

  searchFieldsMap = {
    name: {},
  };

  isFilterRequired = false;

  accessControl = {
    getMultiple: () => true,
    get: () => true,
    "*": generateUserRoleGuard([userRoleKenum.ADMIN]),
  };
}
