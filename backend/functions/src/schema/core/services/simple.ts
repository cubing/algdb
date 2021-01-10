import { BaseService } from ".";
import { TypeDefinition } from "jomql";
import * as Resolver from "../../helpers/resolver";
import * as errorHelper from "../../helpers/error";
import { typeDefs } from "../../typeDefs";

export class SimpleService extends BaseService {
  typeDef!: TypeDefinition;

  // set typeDef
  initialize(typeDef: TypeDefinition) {
    this.typeDef = typeDef;

    // register the typeDef
    typeDefs.set(this.typename, this.typeDef);
  }

  async getRecord(req, args: any, query?: object, admin = false) {
    const selectQuery = query ?? Object.assign({}, this.presets.default);

    // if no fields requested, can skip the permissions check
    if (Object.keys(selectQuery).length < 1) return { typename: this.typename };

    //if it does not pass the access control, throw an error
    if (!admin && !(await this.testPermissions("get", req, args, query))) {
      throw errorHelper.badPermissionsError();
    }

    const results = await Resolver.resolveTableRows(
      this.typename,
      req,
      selectQuery,
      {},
      args
    );

    if (results.length < 1) {
      throw errorHelper.itemNotFoundError();
    }

    return results[0];
  }
}
