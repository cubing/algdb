import { NormalService, SimpleService } from ".";
import * as Resolver from "../../resolvers/resolver";
import { itemNotFoundError } from "../../helpers/error";
import { generatePaginatorInfoTypeDef } from "../generators";

export class PaginatorInfoService extends SimpleService {
  constructor(service: NormalService) {
    super("paginatorInfo");
    this.typeDef = generatePaginatorInfoTypeDef(service);
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
