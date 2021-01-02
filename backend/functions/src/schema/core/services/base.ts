import { ExternalQuery } from "../../../types";

export abstract class BaseService {
  typename: string;

  readonly defaultTypename!: string;

  presets: ExternalQuery = {
    default: {
      "*": true,
    },
  };

  permissionsLink?: any;

  // standard ones are 'get', 'getMultiple', 'update', 'create', 'delete'
  accessControl?: {
    [x: string]: Function;
  };

  constructor(typename?: string) {
    const camelCaseTypename =
      this.constructor.name.charAt(0).toLowerCase() +
      this.constructor.name.slice(1);
    this.typename = typename ?? camelCaseTypename.replace(/Service$/, "");
  }

  async testPermissions(operation: string, req, args, query) {
    let allowed: boolean;

    if (this.accessControl) {
      const validatedOperation =
        operation in this.accessControl ? operation : "*";
      // if operation not in the accessControl object, deny
      allowed = this.accessControl[validatedOperation]
        ? await this.accessControl[validatedOperation](req, args, query)
        : false;
    } else {
      // allow by default if no accessControl object
      allowed = true;
    }

    return allowed;
  }
}
