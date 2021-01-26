import * as mysqlHelper from "./mysql";
import { User } from "../services";
import { userRoleKenum, userPermissionEnum } from "../enums";
import { BaseService, NormalService } from "../core/services";
import * as errorHelper from "./error";
import { ServiceFunctionInputs, AccessControlFunction } from "../../types";

export const userRoleToPermissionsMap = {
  // [userRoleKenum.ADMIN]: [userPermissionEnum.A_A],
  [userRoleKenum.ADMIN]: [userPermissionEnum.A_A],
  [userRoleKenum.NORMAL]: [],
};

export function generateItemCreatedByUserGuard(
  service: BaseService
): AccessControlFunction {
  return async function ({ req, fieldPath, args, query }) {
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
): AccessControlFunction {
  return async function ({ req, fieldPath, args, query }) {
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

export function generateUserAdminGuard(): AccessControlFunction {
  return generateUserRoleGuard([userRoleKenum.ADMIN]);
}

export function generateUserRoleGuard(
  allowedRoles: userRoleKenum[]
): AccessControlFunction {
  return async function ({ req, fieldPath, args, query }) {
    //check if logged in
    if (!req.user) return false;

    try {
      // role is loaded in helpers/auth on token decode
      /*
      const userRecords = await mysqlHelper.fetchTableRows({
        select: [{ field: "role" }],
        from: User.typename,
        where: {
          fields: [{ field: "id", value: req.user.id }],
        },
      });
      */

      if (!req.user.role) return false;
      return allowedRoles.includes(userRoleKenum[req.user.role]);
    } catch (err) {
      return false;
    }
  };
}

/*
export function userRoleGuard(allowedRoles: userRoleKenum[]) {
  return function (
    target: BaseService,
    propertyName: string,
    propertyDescriptor: PropertyDescriptor
  ): PropertyDescriptor {
    // target === Employee.prototype
    // propertyName === "greet"
    // propertyDesciptor === Object.getOwnPropertyDescriptor(Employee.prototype, "greet")
    const method = propertyDescriptor.value;

    propertyDescriptor.value = async function (req, args, query) {
      // convert list of greet arguments to string
      //const params = args.map((a) => JSON.stringify(a)).join();
      const params = "bar";
      //if it does not pass the access control, throw an error
      if (!(await target.testPermissions("get", req, args, query))) {
        throw errorHelper.badPermissionsError();
      }

      // invoke greet() and get its return value
      const result = await method.apply(this, [req, args, query]);

      // convert result to string
      const r = JSON.stringify(result);

      // display in console the function call details
      console.log(`Call: ${propertyName}(${params}) => ${r}`);

      // return the result of invoking the method
      return result;
    };
    return propertyDescriptor;
  };
}
*/

export function permissionsCheck(methodKey: string) {
  return function (
    target: BaseService,
    propertyName: string,
    propertyDescriptor: PropertyDescriptor
  ): PropertyDescriptor {
    // target === Employee.prototype
    // propertyName === "greet"
    // propertyDesciptor === Object.getOwnPropertyDescriptor(Employee.prototype, "greet")
    const method = propertyDescriptor.value;

    propertyDescriptor.value = async function ({
      req,
      fieldPath,
      args,
      query,
      data,
      isAdmin = false,
    }: ServiceFunctionInputs) {
      //if it does not pass the access control, throw an error
      if (
        !(await target.testPermissions.apply(this, [
          methodKey,
          {
            req,
            fieldPath,
            args,
            query,
            data,
            isAdmin,
          },
        ]))
      ) {
        throw errorHelper.badPermissionsError(fieldPath);
      }
      // invoke greet() and get its return value
      const result = await method.apply(this, [
        {
          req,
          fieldPath,
          args,
          query,
          data,
          isAdmin,
        },
      ]);

      // return the result of invoking the method
      return result;
    };
    return propertyDescriptor;
  };
}
