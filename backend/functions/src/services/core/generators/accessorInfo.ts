import { Service } from '../service';

import * as resolverHelper from '../../resolvers/virtualResolver';
import errorHelper from '../../helpers/tier0/error';

import { dataTypes } from '../../helpers/tier0/dataType';

export function generateAccessorInfoService(service: any) {
  return class extends Service {
    static __typename = 'accessorInfo';
    static presets = {
      default: {
        total: null
      }
    };

    static hasKeys = false;

    static async getRecord(req, args, query?: object) {
      const results = await resolverHelper.resolveTableRows(this, req, { select: query }, args, generateAccessorInfoTypeDef(service));
    
      if(results.length < 1) {
        throw errorHelper.itemNotFoundError();
      }
  
      return results[0];
    }
  }
}

export function generateAccessorInfoTypeDef(service: any = {}) {
  return {
    permissions: {
      type: dataTypes.STRING,
      resolver: async (context, req, currentObject, query, args) => {
        return service.getRecords(req, {
          ...args
        }, null, true);
      }
    },
    sufficientPermissions: {
      type: dataTypes.BOOLEAN,
      resolver: async (context, req, currentObject, query, args) => {
        return service.testPermissions('get', req);
      }
    }
  }
};