import { LinkService } from "../../core/services";
import { generateUserRoleGuard } from "../../helpers/permissions";
import { userRoleKenum } from "../../enums";

export class AlgUsertagLinkService extends LinkService {
  defaultTypename = "algUsertagLink";

  filterFieldsMap = {
    "alg.id": {},
    "usertag.id": {},
    "created_by.id": {},
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
