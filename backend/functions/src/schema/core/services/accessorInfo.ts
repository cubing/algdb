import { NormalService, SimpleService } from ".";
import * as Resolver from "../../helpers/resolver";
import { itemNotFoundError } from "../../helpers/error";
import { generateAccessorInfoTypeDef } from "../generators";

export class AccessorInfoService extends SimpleService {
  constructor(service: NormalService) {
    super("accessorInfo");
    this.typeDef = generateAccessorInfoTypeDef(service);
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
