import { LinkService } from "../../core/services";
import { generateUserRoleGuard } from "../../helpers/permissions";
import { userRoleKenum } from "../../enums";

export class AlgTagLinkService extends LinkService {
  defaultTypename = "algTagLink";

  filterFieldsMap = {
    "alg.id": {},
    "tag.id": {},
  };

  uniqueKeyMap = {
    primary: ["id"],
  };

  sortFieldsMap = {
    created_at: {},
  };

  searchFieldsMap = {};

  groupByFieldsMap = {};

  accessControl = {
    create: generateUserRoleGuard([userRoleKenum.ADMIN]),
    delete: generateUserRoleGuard([userRoleKenum.ADMIN]),
  };
}
