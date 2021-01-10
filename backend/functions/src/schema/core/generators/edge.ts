import { BaseService } from "../services";

import * as Scalars from "../../scalars";

import { atob } from "../../helpers/shared";

export function generateEdgeTypeDef(service: BaseService) {
  return {
    node: {
      type: service.typename,
      isArray: false,
      allowNull: false,
      resolver: (req, args, query, typename, currentObject) => {
        return args.item;
      },
    },
    cursor: {
      type: Scalars.string,
      isArray: false,
      allowNull: false,
      resolver: (req, args, query, typename, currentObject) => {
        return atob(
          JSON.stringify({ last_id: args.last_id, last_value: args.last_value })
        );
      },
    },
  };
}
