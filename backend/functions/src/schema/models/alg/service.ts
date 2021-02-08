import { PaginatedService } from "../../core/services";
import { generateUserRoleGuard } from "../../helpers/permissions";
import { userRoleKenum } from "../../enums";

export class AlgService extends PaginatedService {
  defaultTypename = "alg";

  filterFieldsMap = {
    id: {},
    "algcase.name": {},
    algcase: {
      field: "algcase.id",
    },
    puzzle: {
      field: "algcase.algset.puzzle.id",
    },
    tag: { field: "tag.id" },
    "tag.name": {},
  };

  uniqueKeyMap = {
    primary: ["id"],
  };

  sortFieldsMap = {
    id: {},
    created_at: {},
  };

  searchFieldsMap = {
    sequence: {},
  };

  groupByFieldsMap = {
    id: {},
  };

  accessControl = {
    get: () => true,

    getMultiple: () => true,

    update: generateUserRoleGuard([userRoleKenum.ADMIN]),
    create: generateUserRoleGuard([userRoleKenum.ADMIN]),
    delete: generateUserRoleGuard([userRoleKenum.ADMIN]),
  };
}
