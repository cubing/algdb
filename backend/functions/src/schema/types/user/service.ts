import { PaginatedService } from "../../core/services";

import { User } from "../../services";

import {
  handleJqlSubscriptionTrigger,
  handleJqlSubscriptionTriggerIterative,
  deleteJqlSubscription,
} from "../../helpers/subscription";
import * as Resolver from "../../resolvers/resolver";
import * as mysqlHelper from "../../helpers/mysql";

import * as errorHelper from "../../helpers/error";
import * as admin from "firebase-admin";

import {
  generateUserRoleGuard,
  generateItemCreatedByUserGuard,
} from "../../helpers/permissions";
import { userRoleKenum } from "../../kenums";

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
