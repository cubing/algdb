import { Service } from '../service';

import { resolverHelper, dataTypes } from 'jomql';
import errorHelper from '../../../helpers/tier0/error';

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
      const selectQuery = query || Object.assign({}, this.presets.default);

      const results = await resolverHelper.resolveTableRows(this.__typename, this, req, { select: selectQuery }, args, generateAccessorInfoTypeDef(service));
    
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
      resolver: async (typename, req, currentObject, query, args) => {
        return service.getRecords(req, {
          ...args
        }, null, true);
      }
    },
    sufficientPermissions: {
      type: dataTypes.BOOLEAN,
      resolver: async (typename, req, currentObject, query, args) => {
        return service.testPermissions('get', req);
      }
    }
  }
};