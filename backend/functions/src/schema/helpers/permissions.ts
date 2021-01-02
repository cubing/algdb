import * as mysqlHelper from "./mysql";
import { User } from "../services";
import { userRoleKenum } from "../kenums";
import { BaseService } from "../core/services";

export function generateItemCreatedByUserGuard(service: BaseService) {
  return async function (req, args, query) {
    //check if logged in
    if (!req.user) return false;

    try {
      const results = await mysqlHelper.fetchTableRows({
        select: [{ field: "created_by" }],
        from: service.typename,
        where: {
          fields: [{ field: "id", value: args.id }],
        },
      });

      return results[0]?.created_by === req.user.id;
    } catch (err) {
      return false;
    }
  };
}

export function generateCheckPermissionsLink(
  method: string,
  service: BaseService
) {
  return async function (req, args, query) {
    //check if logged in
    if (!req.user) return false;
    if (!service.permissionsLink) return false;
    try {
      //check the permissionsLink entry
      const records = await mysqlHelper.executeDBQuery(
        "SELECT permissions, admin FROM " +
          service.permissionsLink.typename +
          " WHERE user = :user AND " +
          service.typename +
          " = :" +
          service.typename,
        {
          user: req.user.id,
          [service.typename]: args.id,
        }
      );

      if (records.length < 1) return false;

      //if admin==1, allow
      if (records[0].admin > 0) return true;

      //decode
      const permissions = JSON.parse(records[0].permissions);

      if (!permissions) return false;

      return permissions[method] > 0;
    } catch (err) {
      return false;
    }
  };
}

export function generateUserAdminGuard() {
  return generateUserRoleGuard([userRoleKenum.ADMIN]);
}

export function generateUserRoleGuard(allowedRoles: userRoleKenum[]) {
  return async function (req, args, query) {
    //check if logged in
    if (!req.user) return false;

    try {
      const userRecords = await mysqlHelper.fetchTableRows({
        select: [{ field: "role" }],
        from: User.typename,
        where: {
          fields: [{ field: "id", value: req.user.id }],
        },
      });

      if (!userRecords[0]) return false;
      return allowedRoles.includes(
        userRoleKenum[userRoleKenum[userRecords[0].role]]
      );
    } catch (err) {
      return false;
    }
  };
}
