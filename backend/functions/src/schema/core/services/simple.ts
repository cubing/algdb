import { BaseService } from ".";
import { TypeDefinition } from "jomql";
import * as Resolver from "../../helpers/resolver";
import * as errorHelper from "../../helpers/error";
import { typeDefs } from "../../typeDefs";
import { ServiceFunctionInputs } from "../../../types";

export class SimpleService extends BaseService {
  typeDef!: TypeDefinition;

  // set typeDef
  initialize(typeDef: TypeDefinition) {
    this.typeDef = typeDef;

    // register the typeDef
    typeDefs.set(this.typename, this.typeDef);
  }

  async getRecord({
    req,
    fieldPath,
    args,
    query,
    data = {},
    isAdmin = false,
  }: ServiceFunctionInputs) {
    const selectQuery = query ?? Object.assign({}, this.presets.default);

    // if no fields requested, can skip the permissions check
    if (Object.keys(selectQuery).length < 1) return { typename: this.typename };

    const results = await Resolver.resolveTableRows(
      this.typename,
      req,
      fieldPath,
      selectQuery,
      {},
      data
    );

    if (results.length < 1) {
      throw errorHelper.itemNotFoundError(fieldPath);
    }

    return results[0];
  }
}
