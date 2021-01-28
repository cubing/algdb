import { LinkService } from "../../core/services";
import { generateUserRoleGuard } from "../../helpers/permissions";
import { userRoleKenum } from "../../enums";

export class AlgAlgcaseLinkService extends LinkService {
  defaultTypename = "algAlgcaseLink";

  filterFieldsMap = {
    id: {},
  };

  uniqueKeyMap = {
    primary: ["id"],
  };

  sortFieldsMap = {};

  searchFieldsMap = {};

  groupByFieldsMap = {};

  accessControl = {
    create: generateUserRoleGuard([userRoleKenum.ADMIN]),
    delete: generateUserRoleGuard([userRoleKenum.ADMIN]),
  };
}
