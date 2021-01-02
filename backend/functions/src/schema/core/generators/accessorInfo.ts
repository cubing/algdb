import { NormalService } from "../services";

import { BaseScalars } from "jomql";

export function generateAccessorInfoTypeDef(service: NormalService) {
  return {
    permissions: {
      type: BaseScalars.string,
      isArray: false,
      allowNull: false,
      resolver: async (req, args, query, typename, currentObject) => {
        return service.getRecords(req, args, undefined, false, true);
      },
    },
    sufficientPermissions: {
      type: BaseScalars.boolean,
      isArray: false,
      allowNull: false,
      resolver: async (req, args, query, typename, currentObject) => {
        return service.testPermissions("get", req, args, query);
      },
    },
  };
}
