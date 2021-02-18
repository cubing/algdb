import { LinkService } from "../../core/services";
import {
  generateUserRoleGuard,
  permissionsCheck,
} from "../../helpers/permissions";
import { userRoleKenum } from "../../enums";
import { ServiceFunctionInputs } from "../../../types";
import * as Resolver from "../../helpers/resolver";
import * as sqlHelper from "../../helpers/sql";

export class UserAlgVoteLinkService extends LinkService {
  defaultTypename = "userAlgVoteLink";

  filterFieldsMap = {
    "user.id": {},
    "alg.id": {},
  };

  uniqueKeyMap = {
    primary: ["id"],
  };

  sortFieldsMap = {
    created_at: {},
  };

  searchFieldsMap = {};

  groupByFieldsMap = {};

  accessControl = {
    create: generateUserRoleGuard([userRoleKenum.ADMIN]),
    delete: generateUserRoleGuard([userRoleKenum.ADMIN]),
  };

  @permissionsCheck("create")
  async createRecord({
    req,
    fieldPath,
    args,
    query,
    data = {},
    isAdmin = false,
  }: ServiceFunctionInputs) {
    // args should be validated already
    const validatedArgs = <any>args;
    await this.handleLookupArgs(args, fieldPath);

    const addResults = await Resolver.createObjectType({
      typename: this.typename,
      addFields: {
        ...validatedArgs,
        created_by: req.user!.id,
      },
      req,
      fieldPath,
      options: {
        onConflict: {
          columns: ["user", "alg"],
          action: "merge",
        },
      },
    });

    // after creating the link, update the score on the alg
    await sqlHelper.executeDBQuery(
      `UPDATE alg SET score = (SELECT sum(vote_value) FROM "userAlgVoteLink" WHERE alg = :alg) WHERE id = :alg`,
      {
        alg: validatedArgs.alg,
      }
    );

    return this.getRecord({
      req,
      args: { id: addResults.id },
      query,
      fieldPath,
      isAdmin,
      data,
    });
  }
}
