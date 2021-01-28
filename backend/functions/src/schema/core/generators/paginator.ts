import {
  PaginatorInfoService,
  EdgeService,
  PaginatedService,
  BaseService,
} from "../services";

import { generateTypenameField } from "../../helpers/typeDef";
import type { TypeDefinitionField, TypeDefinition } from "jomql";

export function generatePaginatorTypeDef(
  service: PaginatedService,
  currentService: BaseService
) {
  const PaginatorInfo = new PaginatorInfoService(service);

  const Edge = new EdgeService(service);

  return <TypeDefinition>{
    name: currentService.typename,
    description: "Paginator",
    fields: {
      ...generateTypenameField(currentService),
      paginatorInfo: <TypeDefinitionField>{
        type: PaginatorInfo.typename,
        isArray: false,
        allowNull: false,
        resolver: ({ req, fieldPath, args, query, data }) => {
          return PaginatorInfo.getRecord({
            req,
            fieldPath,
            args,
            query,
            data,
          });
        },
      },
      edges: <TypeDefinitionField>{
        type: Edge.typename,
        isArray: true,
        allowNull: false,
        resolver: async ({ req, fieldPath, args, query, data }) => {
          // data.records should contain the results
          return Promise.all(
            data.records.map((item, index) => {
              // separate the last_id and last_value keys, if any
              const { last_id, last_value, ...remainingItem } = item;
              return Edge.getRecord({
                req,
                fieldPath,
                args,
                query,
                data: { item: remainingItem, index, last_id, last_value },
              });
            })
          );
        },
      },
    },
  };
}
