import { NormalService } from "../../core/services";
import { generateUserRoleGuard } from "../../helpers/permissions";
import { userRoleKenum } from "../../kenums";

export class AlgAlgcaseLinkService extends NormalService {
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

  isFilterRequired = false;

  accessControl = {
    create: generateUserRoleGuard([userRoleKenum.ADMIN]),
    delete: generateUserRoleGuard([userRoleKenum.ADMIN]),
  };
}
