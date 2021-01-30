import { BaseService, NormalService } from "../services";

import * as Scalars from "../../scalars";
import { generateTypenameField } from "../../helpers/typeDef";
import { atob } from "../../helpers/shared";
import type { ObjectTypeDefinition } from "jomql";

export function generateEdgeTypeDef(
  service: NormalService,
  currentService: BaseService
) {
  return <ObjectTypeDefinition>{
    name: currentService.typename,
    fields: {
      ...generateTypenameField(currentService),
      node: {
        type: service.typeDefLookup,
        isArray: false,
        allowNull: false,
        resolver: ({ data }) => {
          return data.item;
        },
      },
      cursor: {
        type: Scalars.string,
        isArray: false,
        allowNull: false,
        resolver: ({ data }) => {
          return atob(
            JSON.stringify({
              last_id: data.last_id,
              last_value: data.last_value,
            })
          );
        },
      },
    },
  };
}
