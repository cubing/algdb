import { Service, PaginatorService } from "../services";
import { generatePaginatorInfoService } from "./paginatorInfo";

export function generatePaginatorService(service: Service): Service {
  return new PaginatorService(service);
}

export function generatePaginatorTypeDef(service: Service) {
  const PaginatorInfo = generatePaginatorInfoService(service);

  return {
    paginatorInfo: {
      type: PaginatorInfo.__typename,
      resolver: (req, args, query, typename, currentObject) => {
        return PaginatorInfo.getRecord(req, args, query);
      },
    },
    data: {
      type: [service.__typename],
      resolver: (req, args, query, typename, currentObject) => {
        return service.getRecords(req, args, query);
      },
    },
  };
}
