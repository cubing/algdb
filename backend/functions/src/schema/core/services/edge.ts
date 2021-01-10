import { NormalService, SimpleService } from ".";
import * as Resolver from "../../helpers/resolver";
import { itemNotFoundError } from "../../helpers/error";
import { generateEdgeTypeDef } from "../generators";
import { typeDefs } from "../../typeDefs";

export class EdgeService extends SimpleService {
  constructor(service: NormalService) {
    super(service.typename + "Edge");
    this.typeDef = generateEdgeTypeDef(service);
    this.presets = {
      default: {
        "*": true,
      },
    };

    // register the typeDef
    typeDefs.set(this.typename, this.typeDef);

    this.getRecord = async (req, args, query) => {
      const selectQuery = query || Object.assign({}, this.presets.default);

      const results = await Resolver.resolveTableRows(
        this.typename,
        req,
        selectQuery,
        {},
        args
      );

      if (results.length < 1) {
        throw itemNotFoundError();
      }

      return results[0];
    };
  }
}
