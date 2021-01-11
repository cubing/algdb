import { NormalService } from "../services";

import * as Scalars from "../../scalars";

export function generateAccessorInfoTypeDef(service: NormalService) {
  return {
    description: "",
    fields: {
      permissions: {
        type: Scalars.string,
        isArray: false,
        allowNull: false,
        resolver: async (req, args, query, typename, currentObject) => {
          return service.getRecords(req, args, undefined, false, true);
        },
      },
      sufficientPermissions: {
        type: Scalars.boolean,
        isArray: false,
        allowNull: false,
        resolver: async (req, args, query, typename, currentObject) => {
          return service.testPermissions("get", req, args, query);
        },
      },
    },
  };
}
