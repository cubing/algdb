import { NormalService } from "../services";

import * as Scalars from "../../scalars";
import { atob } from "../../helpers/shared";

export function generatePaginatorInfoTypeDef(
  service: NormalService = new NormalService()
) {
  return {
    description: "PaginatorInfo Type",
    fields: {
      total: {
        type: Scalars.number,
        isArray: false,
        allowNull: false,
        resolver: (req, args, query, typename, currentObject) => {
          // remove any pagination params in order to fetch the total count
          const { first, after, before, last, ...validArgs } = args;
          return service.getRecords(req, validArgs, undefined, true);
        },
      },
      count: {
        type: Scalars.number,
        isArray: false,
        allowNull: false,
        resolver: async (req, args, query, typename, currentObject) => {
          // args.data should be passed down as array from the paginator
          return args.data.length;
        },
      },
      startCursor: {
        type: Scalars.string,
        isArray: false,
        allowNull: true,
        resolver: async (req, args, query, typename, currentObject) => {
          // args.data should be passed down as array from the paginator
          if (args.data.length < 1) return null;

          return atob(
            JSON.stringify({
              last_id: args.data[0].last_id,
              last_value: args.data[0].last_value,
            })
          );
        },
      },
      endCursor: {
        type: Scalars.string,
        isArray: false,
        allowNull: true,
        resolver: async (req, args, query, typename, currentObject) => {
          // args.data should be passed down as array from the paginator
          if (args.data.length < 1) return null;

          return atob(
            JSON.stringify({
              last_id: args.data[args.data.length - 1].last_id,
              last_value: args.data[args.data.length - 1].last_value,
            })
          );
        },
      },
    },
  };
}
