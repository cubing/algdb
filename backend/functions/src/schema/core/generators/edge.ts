import { BaseService } from "../services";

import * as Scalars from "../../scalars";
import { generateTypenameField } from "../../helpers/typeDef";
import { atob } from "../../helpers/shared";
import type { TypeDefinitionField, TypeDefinition } from "jomql";

export function generateEdgeTypeDef(
  service: BaseService,
  currentService: BaseService
) {
  return <TypeDefinition>{
    name: currentService.typename,
    fields: {
      ...generateTypenameField(currentService),
      node: <TypeDefinitionField>{
        type: service.typename,
        isArray: false,
        allowNull: false,
        resolver: ({ data }) => {
          return data.item;
        },
      },
      cursor: <TypeDefinitionField>{
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
