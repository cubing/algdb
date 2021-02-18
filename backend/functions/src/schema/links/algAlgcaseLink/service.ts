import { LinkService } from "../../core/services";
import { generateUserRoleGuard } from "../../helpers/permissions";
import { userRoleKenum } from "../../enums";

export class AlgAlgcaseLinkService extends LinkService {
  defaultTypename = "algAlgcaseLink";

  filterFieldsMap = {
    id: {},
    "algcase.id": {},
    "alg.id": {},
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
