import { LinkService } from "../../core/services";
import { generateUserRoleGuard } from "../../helpers/permissions";
import { userRoleKenum } from "../../enums";

export class AlgTagLinkService extends LinkService {
  defaultTypename = "algTagLink";

  filterFieldsMap = {
    id: {},
  };

  uniqueKeyMap = {
    primary: ["id"],
  };

  sortFieldsMap = {};

  searchFieldsMap = {};

  groupByFieldsMap = {};

  isFilterRequired = false;

  accessControl = {
    create: generateUserRoleGuard([userRoleKenum.ADMIN]),
    delete: generateUserRoleGuard([userRoleKenum.ADMIN]),
  };
}
