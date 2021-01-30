import {
  ServiceFunctionInputs,
  AccessControlMap,
  ExternalQuery,
} from "../../../types";
import { userPermissionEnum } from "../../enums";
import { lookupSymbol, JomqlRootResolverType } from "jomql";

export abstract class BaseService {
  typename: string;

  readonly defaultTypename!: string;

  rootResolvers?: { [x: string]: JomqlRootResolverType };

  presets: ExternalQuery = {
    default: {
      "*": lookupSymbol,
    },
  };

  setRootResolvers(rootResolvers: { [x: string]: JomqlRootResolverType }) {
    this.rootResolvers = rootResolvers;
  }

  permissionsLink?: any;

  // standard ones are 'get', 'getMultiple', 'update', 'create', 'delete'
  accessControl?: AccessControlMap;

  constructor(typename?: string) {
    const camelCaseTypename =
      this.constructor.name.charAt(0).toLowerCase() +
      this.constructor.name.slice(1);
    this.typename = typename ?? camelCaseTypename.replace(/Service$/, "");
  }

  async testPermissions(
    operation: string,
    {
      req,
      fieldPath,
      args,
      query,
      data,
      isAdmin = false,
    }: ServiceFunctionInputs
  ) {
    if (isAdmin) return true;

    if (!req.user) return false;

    // check against permissions array first. allow if found.
    const passablePermissionsArray = [
      userPermissionEnum.A_A,
      userPermissionEnum[this.typename + "_x"],
      userPermissionEnum[this.typename + "_" + operation],
    ];

    if (
      req.user.permissions.some((ele) => passablePermissionsArray.includes(ele))
    )
      return true;

    // if that failed, fall back to accessControl
    let allowed: boolean;
    if (this.accessControl) {
      const validatedOperation =
        operation in this.accessControl ? operation : "*";
      // if operation not in the accessControl object, deny
      allowed = this.accessControl[validatedOperation]
        ? await this.accessControl[validatedOperation]({
            req,
            fieldPath,
            args,
            query,
            data,
            isAdmin,
          })
        : false;
    } else {
      // deny by default if no accessControl object
      allowed = true;
    }

    return allowed;
  }
}
