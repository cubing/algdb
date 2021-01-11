import { NormalService, PaginatorInfoService, EdgeService } from "../services";

export function generatePaginatorTypeDef(service: NormalService) {
  const PaginatorInfo = new PaginatorInfoService(service);

  const Edge = new EdgeService(service);

  return {
    description: "Paginator",
    fields: {
      paginatorInfo: {
        type: PaginatorInfo.typename,
        isArray: false,
        allowNull: false,
        resolver: (req, args, query, typename, currentObject) => {
          return PaginatorInfo.getRecord(req, args, query);
        },
      },
      edges: {
        type: Edge.typename,
        isArray: true,
        allowNull: false,
        resolver: async (req, args, query, typename, currentObject) => {
          // args.data should contain the data
          return Promise.all(
            args.data.map((item, index) => {
              // separate the last_id and last_value keys, if any
              const { last_id, last_value, ...remainingItem } = item;
              return Edge.getRecord(
                req,
                { item: remainingItem, index, last_id, last_value },
                query
              );
            })
          );
        },
      },
    },
  };
}
