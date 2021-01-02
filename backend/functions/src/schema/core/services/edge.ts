import { NormalService, SimpleService } from ".";
import * as Resolver from "../../resolvers/resolver";
import { itemNotFoundError } from "../../helpers/error";
import { generateEdgeTypeDef } from "../generators";

export class EdgeService extends SimpleService {
  constructor(service: NormalService) {
    super(service.typename + "Edge");
    this.typeDef = generateEdgeTypeDef(service);
    this.presets = {
      default: {
        "*": true,
      },
    };

    this.getRecord = async (req, args, query) => {
      const selectQuery = query || Object.assign({}, this.presets.default);

      const results = await Resolver.resolveTableRows(
        this.typename,
        req,
        selectQuery,
        {},
        args,
        this.typeDef
      );

      if (results.length < 1) {
        throw itemNotFoundError();
      }

      return results[0];
    };
  }
}
