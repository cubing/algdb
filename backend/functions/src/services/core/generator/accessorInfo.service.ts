import Service from '../service';

import resolverHelper from '../../../helpers/tier2/virtualResolver';
import errorHelper from '../../../helpers/tier0/error';

import generateAccessorInfoTypeDef from './accessorInfo.typeDef'

export default function(service: any) {
  return class extends Service {
    static __typename = 'accessorInfo';
    static presets = {
      default: {
        total: null
      }
    };

    static async getRecord(req, args, query?: object) {
      const results = await resolverHelper.resolveTableRows(this, req, { select: query }, args, generateAccessorInfoTypeDef(service));
    
      if(results.length < 1) {
        throw errorHelper.itemNotFoundError();
      }
  
      return results[0];
    }
  }
}