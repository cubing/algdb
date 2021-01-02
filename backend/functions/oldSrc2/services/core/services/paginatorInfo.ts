import { Service } from ".";
import { resolverHelper } from "jomql";
import { itemNotFoundError } from "../../../helpers/tier0/error";
import { generatePaginatorInfoTypeDef } from "../generators";

export class PaginatorInfoService extends Service {
  constructor(service: Service) {
    super();
    this.__typename = "paginatorInfo";
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
        generatePaginatorInfoTypeDef(service)
      );

      if (results.length < 1) {
        throw itemNotFoundError();
      }

      return results[0];
    };
  }
}
