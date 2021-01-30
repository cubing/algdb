import { NormalService, SimpleService, PaginatedService } from ".";

import * as Resolver from "../../helpers/resolver";
import { itemNotFoundError, badPermissionsError } from "../../helpers/error";
import { generatePaginatorTypeDef } from "../generators";
import { ServiceFunctionInputs } from "../../../types";

import { lookupSymbol, JomqlObjectType } from "jomql";

export class PaginatorService extends SimpleService {
  constructor(service: PaginatedService) {
    super(service.typename + "Paginator");
    this.typeDef = new JomqlObjectType(generatePaginatorTypeDef(service, this));
    this.presets = {
      default: {
        paginatorInfo: {
          total: lookupSymbol,
          count: lookupSymbol,
        },
        edges: {
          node: service.presets?.default,
        },
      },
    };

    this.setTypeDef(this.typeDef);

    this.getRecord = async ({
      req,
      fieldPath,
      args,
      query,
      data = {},
      isAdmin = false,
    }: ServiceFunctionInputs) => {
      const selectQuery = query || Object.assign({}, this.presets.default);

      data.rootArgs = args;

      // check if properly formed query and store the results in data
      data.records = !selectQuery.edges?.node
        ? []
        : await service.getRecords({
            req,
            args,
            query: selectQuery.edges.node,
            fieldPath: fieldPath.concat(["edges", "node"]), // need to add these since the query field is from edges.node
            isAdmin,
            data,
          });

      const results = await Resolver.resolveTableRows(
        this.typename,
        req,
        fieldPath,
        selectQuery,
        {},
        data
      );

      if (results.length < 1) {
        throw itemNotFoundError(fieldPath);
      }

      return results[0];
    };
  }
}
