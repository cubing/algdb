import { NormalService, SimpleService } from ".";

import * as Resolver from "../../helpers/resolver";
import { itemNotFoundError, badPermissionsError } from "../../helpers/error";
import { generatePaginatorTypeDef } from "../generators";

export class PaginatorService extends SimpleService {
  constructor(service: NormalService) {
    super(service.typename + "Paginator");
    this.typeDef = generatePaginatorTypeDef(service);
    this.presets = {
      default: {
        paginatorInfo: {
          total: true,
          count: true,
        },
        edges: {
          node: service.presets?.default,
        },
      },
    };

    this.initialize(this.typeDef);

    this.getRecord = async (req, args, query, admin = false) => {
      const selectQuery = query || Object.assign({}, this.presets.default);

      //if it does not pass the access control, throw an error
      if (!admin && !(await this.testPermissions("get", req, args, query))) {
        throw badPermissionsError();
      }

      // check if properly formed query
      const data = !selectQuery.edges?.node
        ? []
        : await service.getRecords(req, args, selectQuery.edges.node);

      const results = await Resolver.resolveTableRows(
        this.typename,
        req,
        selectQuery,
        {},
        {
          ...args,
          data,
        }
      );

      if (results.length < 1) {
        throw itemNotFoundError();
      }

      return results[0];
    };
  }
}
