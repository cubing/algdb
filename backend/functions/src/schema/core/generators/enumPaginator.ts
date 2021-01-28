import { BaseService, EnumService } from "../services";
import * as Scalars from "../../scalars";
import type { TypeDefinitionField, TypeDefinition } from "jomql";
import { generateTypenameField } from "../../helpers/typeDef";

export function generateEnumPaginatorTypeDef(
  service: EnumService,
  currentService: BaseService
) {
  return <TypeDefinition>{
    name: currentService.typename,
    description: "EnumPaginator",
    fields: {
      ...generateTypenameField(currentService),
      values: <TypeDefinitionField>{
        type: Scalars[service.typename],
        isArray: true,
        allowNull: false,
        resolver: ({ req, fieldPath, args, query, data }) => {
          return service.getAllRecords({
            req,
            fieldPath,
            args,
            query,
            data,
          });
        },
      },
    },
  };
}
