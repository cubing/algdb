import { PaginatedService } from "../../core/services";
import {
  generateUserRoleGuard,
  permissionsCheck,
} from "../../helpers/permissions";
import { userRoleKenum } from "../../enums";
import * as Resolver from "../../helpers/resolver";
import { AlgAlgcaseLink } from "../../services";
import { ServiceFunctionInputs } from "../../../types";

export class AlgService extends PaginatedService {
  defaultTypename = "alg";

  filterFieldsMap = {
    id: {},
    "algcase.name": {
      field: "algAlgcaseLink/algcase.name",
    },
    "algcase.id": {
      field: "algAlgcaseLink/algcase.id",
    },
    "puzzle.id": {
      field: "algAlgcaseLink/algcase.algset.puzzle.id",
    },
    "tag.id": {
      field: "algTagLink/tag.id",
    },
    "tag.name": {
      field: "algTagLink/tag.name",
    },
  };

  uniqueKeyMap = {
    primary: ["id"],
  };

  sortFieldsMap = {
    id: {},
    created_at: {},
  };

  searchFieldsMap = {
    sequence: {},
  };

  groupByFieldsMap = {
    id: {},
    current_vote_value: {
      field: "userAlgVoteLink/vote_value",
    },
  };

  accessControl = {
    get: () => true,

    getMultiple: () => true,

    update: generateUserRoleGuard([userRoleKenum.ADMIN]),
    create: generateUserRoleGuard([userRoleKenum.ADMIN]),
    delete: generateUserRoleGuard([userRoleKenum.ADMIN]),
  };

  @permissionsCheck("create")
  async createAndLinkRecord({
    req,
    fieldPath,
    args,
    query,
    data = {},
    isAdmin = false,
  }: ServiceFunctionInputs) {
    // args should be validated already
    const validatedArgs = <any>args;

    // separate algcase from other args
    const { algcase, ...algArgs } = validatedArgs;

    const algcaseArgs = { algcase };

    // convert any lookup/joined fields into IDs
    await this.handleLookupArgs(algArgs, fieldPath);

    await AlgAlgcaseLink.handleLookupArgs(algcaseArgs, fieldPath);

    const addResults = await Resolver.createObjectType({
      typename: this.typename,
      addFields: {
        ...algArgs,
        created_by: req.user?.id,
      },
      req,
      fieldPath,
    });

    // create algAlgcaseLink
    await Resolver.createObjectType({
      typename: AlgAlgcaseLink.typename,
      req,
      fieldPath,
      addFields: {
        alg: addResults.id,
        algcase: algcaseArgs.algcase,
        created_by: req.user?.id,
      },
    });

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
