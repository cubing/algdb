import { Service, AccessorInfoService } from "../services";

import { dataTypes } from "jomql";

export function generateAccessorInfoService(service: Service) {
  return new AccessorInfoService(service);
}

export function generateAccessorInfoTypeDef(service: Service) {
  return {
    permissions: {
      type: dataTypes.STRING,
      resolver: async (req, args, query, typename, currentObject) => {
        return service.getRecords(req, args, undefined, false, true);
      },
    },
    sufficientPermissions: {
      type: dataTypes.BOOLEAN,
      resolver: async (req, args, query, typename, currentObject) => {
        return service.testPermissions("get", req);
      },
    },
  };
}
