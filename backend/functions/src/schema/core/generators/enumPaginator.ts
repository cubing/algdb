import { BaseService, EnumService } from "../services";
import * as Scalars from "../../scalars";
import type { ObjectTypeDefinition } from "jomql";
import { generateTypenameField } from "../../helpers/typeDef";

export function generateEnumPaginatorTypeDef(
  service: EnumService,
  currentService: BaseService
): ObjectTypeDefinition {
  return <ObjectTypeDefinition>{
    name: currentService.typename,
    description: "EnumPaginator",
    fields: {
      ...generateTypenameField(currentService),
      values: {
        type: Scalars[service.typename],
        arrayOptions: {
          allowNullElement: false,
        },
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
