import { env } from "../config";
import * as jwt from "jsonwebtoken";
import { User } from "../schema/services";
import { userRoleKenum, userPermissionEnum } from "../schema/enums";
import { userRoleToPermissionsMap } from "../schema/helpers/permissions";
import type { ContextUser } from "../types";
import * as mysqlHelper from "../schema/helpers/mysql";

export async function validateToken(auth: string) {
  if (auth.split(" ")[0] !== "Bearer") {
    throw new Error("Invalid Token");
  }

  const token = auth.split(" ")[1];

  try {
    const decodedToken: any = await jwt.verify(token, env.general.jwt_secret);

    const contextUser: ContextUser = {
      id: parseInt(decodedToken.uid),
      role: null,
      permissions: [],
    };

    // fetch role from database
    const userResults = await mysqlHelper.fetchTableRows({
      select: [{ field: "role" }, { field: "permissions" }],
      from: User.typename,
      where: {
        fields: [{ field: "id", value: contextUser.id }],
      },
    });

    if (userResults.length > 0) {
      contextUser.role = userResults[0].role;
      if (userRoleToPermissionsMap[userResults[0].role]) {
        contextUser.permissions.push(
          ...userRoleToPermissionsMap[userResults[0].role]
        );
      }

      // if any extra permissions, also add those
      let parsedPermissions = userResults[0].permissions
        ? JSON.parse(userResults[0].permissions)
        : [];

      // convert permissions to enums
      parsedPermissions = parsedPermissions.map(
        (ele) => userPermissionEnum[ele]
      );
      contextUser.permissions.push(...parsedPermissions);
    }

    return contextUser;
  } catch (err) {
    const message = "Token error: " + (err.message || err.name);
    throw new Error(message);
  }
}
