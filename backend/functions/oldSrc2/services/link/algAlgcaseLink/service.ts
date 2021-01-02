import { Service } from "../../core/services";

import { generateUserRoleGuard } from "../../../helpers/tier2/permissions";
import { userRoleEnum } from "../../enums";

export class AlgAlgcaseLinkService extends Service {
  __typename = "algAlgcaseLink";

  presets = {
    default: {
      id: null,
      uid: null,
      email: null,
      display_name: null,
      display_image: null,
      date_created: null,
      date_modified: null,
    },
  };

  filterFieldsMap = {
    id: {},
    created_by: {},
    "created_by.name": {},
    code: {},
    is_public: {},
  };

  filterFieldsKeyMap = {
    id: {},
    code: {},
  };

  sortFieldsMap = {
    id: {},
    created_at: {},
  };

  searchFieldsMap = {
    name: {},
  };

  isFilterRequired = false;

  accessControl = {
    get: () => false,

    getMultiple: () => false,

    update: () => false,
    create: generateUserRoleGuard([userRoleEnum.ADMIN]),
    delete: generateUserRoleGuard([userRoleEnum.ADMIN]),
  };
}
