import {
  PaginatorInfoService,
  EdgeService,
  PaginatedService,
  BaseService,
} from "../services";

import { generateTypenameField } from "../../helpers/typeDef";
import type { ObjectTypeDefinition } from "jomql";

export function generatePaginatorTypeDef(
  service: PaginatedService,
  currentService: BaseService
) {
  const PaginatorInfo = new PaginatorInfoService(service);

  const Edge = new EdgeService(service);

  return <ObjectTypeDefinition>{
    name: currentService.typename,
    description: "Paginator",
    fields: {
      ...generateTypenameField(currentService),
      paginatorInfo: {
        type: PaginatorInfo.typeDef,
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
      edges: {
        type: Edge.typeDef,
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
