import { BaseService, NormalService } from "../services";

import * as Scalars from "../../scalars";
import { atob } from "../../helpers/shared";
import type { TypeDefinitionField, TypeDefinition } from "jomql";
import { generateTypenameField } from "../../helpers/typeDef";

export function generatePaginatorInfoTypeDef(
  service: NormalService,
  currentService: BaseService
) {
  return <TypeDefinition>{
    name: currentService.typename,
    description: "PaginatorInfo Type",
    fields: {
      ...generateTypenameField(currentService),
      total: <TypeDefinitionField>{
        type: Scalars.number,
        isArray: false,
        allowNull: false,
        resolver: ({ req, fieldPath, args, data }) => {
          // remove any pagination params in order to fetch the total count
          const { first, after, before, last, ...validArgs } = data.rootArgs;
          return service.countRecords({
            req,
            fieldPath,
            args: validArgs,
            data,
          });
        },
      },
      count: <TypeDefinitionField>{
        type: Scalars.number,
        isArray: false,
        allowNull: false,
        resolver: async ({ req, args, query, data }) => {
          // data.records should be passed down as array from the paginator
          return data.records.length;
        },
      },
      startCursor: <TypeDefinitionField>{
        type: Scalars.string,
        isArray: false,
        allowNull: true,
        resolver: async ({ data }) => {
          // data.records should be passed down as array from the paginator
          if (data.records.length < 1) return null;

          return atob(
            JSON.stringify({
              last_id: data.records[0].last_id,
              last_value: data.records[0].last_value,
            })
          );
        },
      },
      endCursor: <TypeDefinitionField>{
        type: Scalars.string,
        isArray: false,
        allowNull: true,
        resolver: async ({ data }) => {
          // data.records should be passed down as array from the paginator
          if (data.records.length < 1) return null;

          return atob(
            JSON.stringify({
              last_id: data.records[data.records.length - 1].last_id,
              last_value: data.records[data.records.length - 1].last_value,
            })
          );
        },
      },
    },
  };
}
