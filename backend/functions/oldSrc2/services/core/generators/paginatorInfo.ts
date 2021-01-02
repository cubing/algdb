import { Service, PaginatorInfoService } from "../services";

import { dataTypes } from "jomql";

export function generatePaginatorInfoService(service: Service) {
  return new PaginatorInfoService(service);
}

export function generatePaginatorInfoTypeDef(service: Service) {
  return {
    total: {
      type: dataTypes.INTEGER,
      resolver: (req, args, query, typename, currentObject) => {
        return service.getRecords(
          req,
          {
            ...args,
            after: null,
          },
          undefined,
          true
        );
      },
    },
    count: {
      type: dataTypes.INTEGER,
      resolver: async (req, args, query, typename, currentObject) => {
        return Math.min(
          args.first || Infinity,
          await service.getRecords(req, args, undefined, true)
        );
      },
    },
  };
}
