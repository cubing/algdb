import { PaginatedService } from "../../core/services";
import { generateUserRoleGuard } from "../../helpers/permissions";
import { userRoleKenum } from "../../enums";

export class AlgsetService extends PaginatedService {
  defaultTypename = "algset";

  filterFieldsMap = {
    id: {},
    created_by: {
      field: "created_by.id",
    },
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

  accessControl = {
    get: () => true,

    getMultiple: () => true,

    update: generateUserRoleGuard([userRoleKenum.ADMIN]),
    create: generateUserRoleGuard([userRoleKenum.ADMIN]),
    delete: generateUserRoleGuard([userRoleKenum.ADMIN]),
  };
}
