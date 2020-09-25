import { Service } from '../service';
import { generatePaginatorInfoService } from './paginatorInfo'

export function generatePaginatorService(service: any) {
  return class extends Service {
    static __typename = service.__typename + 'Paginator';
    static presets = {
      default: {
        paginatorInfo: {
          total: null,
          count: null,
        },
        data: service.presets?.default
      }
    };

    static hasKeys = false;

    static getTypeDef = Service.getTypeDef;

    static getRecord = Service.getRecord;
  }
}

export function generatePaginatorTypeDef(service: any) {
  const PaginatorInfo = generatePaginatorInfoService(service);

  return {
    paginatorInfo: {
      type: PaginatorInfo.__typename,
      resolver: async (typename, req, currentObject, query, args) => {
        return PaginatorInfo.getRecord(req, {
          ...args
        }, query);
      },
    },
    data: {
      type: [service.__typename],
      resolver: async (typename, req, currentObject, query, args) => {
        return service.getRecords(req, {
          ...args
        }, query);
      }
    },
  }
};