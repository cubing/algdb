import { Service } from '../service';

import { resolverHelper, dataTypes } from 'jomql';
import errorHelper from '../../../helpers/tier0/error';

export function generatePaginatorInfoService(service: any) {
  return class extends Service {
    static __typename = 'paginatorInfo';
    static presets = {
      default: {
        total: null
      }
    };

    static hasKeys = false;

    static async getRecord(req, args, query?: object) {
      const selectQuery = query || Object.assign({}, this.presets.default);
      
      const results = await resolverHelper.resolveTableRows(this.__typename, this, req, { select: selectQuery }, args, generatePaginatorInfoTypeDef(service));
    
      if(results.length < 1) {
        throw errorHelper.itemNotFoundError();
      }
  
      return results[0];
    }
  }
}

export function generatePaginatorInfoTypeDef(service: any = {}) {
  return {
    total: {
      type: dataTypes.INTEGER,
      resolver: async (typename, req, currentObject, query, args) => {
        return service.getRecords(req, {
          ...args,
          after: null
        }, null, true);
      }
    },
    count: {
      type: dataTypes.INTEGER,
      resolver: async (typename, req, currentObject, query, args) => {
        return Math.min(args.first || Infinity, await service.getRecords(req, {
          ...args
        }, null, true));
      }
    },
  }
};