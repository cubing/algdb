import { Service } from ".";
import { resolverHelper } from "jomql";
import { itemNotFoundError } from "../../../helpers/tier0/error";
import { generateAccessorInfoTypeDef } from "../generators";

export class AccessorInfoService extends Service {
  constructor(service: Service) {
    super();
    this.__typename = "accessorInfo";
    this.presets = {
      default: {
        total: null,
      },
    };

    this.hasKeys = false;

    this.getRecord = async (req, args, query) => {
      const selectQuery = query || Object.assign({}, this.presets.default);

      const results = await resolverHelper.resolveTableRows(
        this.__typename,
        this,
        req,
        { select: selectQuery },
        args,
        generateAccessorInfoTypeDef(service)
      );

      if (results.length < 1) {
        throw itemNotFoundError();
      }

      return results[0];
    };
  }
}
