import { BaseService } from ".";
import { JomqlObjectType } from "jomql";
import * as Resolver from "../../helpers/resolver";
import * as errorHelper from "../../helpers/error";
import { ServiceFunctionInputs } from "../../../types";

export class SimpleService extends BaseService {
  typeDef!: JomqlObjectType;

  // set typeDef
  setTypeDef(typeDef: JomqlObjectType) {
    this.typeDef = typeDef;
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

    const results = await Resolver.getObjectType({
      typename: this.typename,
      req,
      fieldPath,
      externalQuery: selectQuery,
      sqlParams: {},
      data,
    });

    if (results.length < 1) {
      throw errorHelper.itemNotFoundError(fieldPath);
    }

    return results[0];
  }
}
