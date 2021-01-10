import { NormalService, SimpleService } from ".";
import * as Resolver from "../../helpers/resolver";
import { itemNotFoundError } from "../../helpers/error";
import { generatePaginatorInfoTypeDef } from "../generators";
import { typeDefs } from "../../typeDefs";

export class PaginatorInfoService extends SimpleService {
  constructor(service: NormalService) {
    super("paginatorInfo");
    this.typeDef = generatePaginatorInfoTypeDef(service);
    this.presets = {
      default: {
        "*": true,
      },
    };

    // register the typeDef if not exists
    if (!typeDefs.has(this.typename)) typeDefs.set(this.typename, this.typeDef);

    this.getRecord = async (req, args, query) => {
      const selectQuery = query || Object.assign({}, this.presets.default);

      const results = await Resolver.resolveTableRows(
        this.typename,
        req,
        selectQuery,
        {},
        args,
        this.typeDef // must pass the specific typeDef for this Paginator
      );

      if (results.length < 1) {
        throw itemNotFoundError();
      }

      return results[0];
    };
  }
}
