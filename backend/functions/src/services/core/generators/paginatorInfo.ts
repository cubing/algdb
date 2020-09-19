import { Service } from '../service';

import * as resolverHelper from '../../resolvers/virtualResolver';
import errorHelper from '../../helpers/tier0/error';
import { dataTypes } from '../../helpers/tier0/dataType';

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
      const results = await resolverHelper.resolveTableRows(this, req, { select: query }, args, generatePaginatorInfoTypeDef(service));
    
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
      resolver: async (context, req, currentObject, query, args) => {
        return service.getRecords(req, {
          ...args,
          after: null
        }, null, true);
      }
    },
    count: {
      type: dataTypes.INTEGER,
      resolver: async (context, req, currentObject, query, args) => {
        return Math.min(args.first || Infinity, await service.getRecords(req, {
          ...args
        }, null, true));
      }
    },
  }
};