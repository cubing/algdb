import errorHelper from '../../../helpers/tier0/error';
import resolverHelper from '../../../helpers/tier2/resolver';
import Service from '../service';

export default function(service: any) {
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

    static getTypeDef = Service.getTypeDef;

    static async getRecord(req, args, query?: object, admin = false) {
      const selectQuery = query || Object.assign({}, this.presets.default);
  
      //if it does not pass the access control, throw an error
      if(!admin && !await this.testPermissions('get', req, args, query)) {
        throw errorHelper.badPermissionsError();
      }
  
      const results = await resolverHelper.resolveTableRows(this.__typename, this, req, {
        select: selectQuery,
        where: []
      }, args);
  
      if(results.length < 1) {
        throw errorHelper.itemNotFoundError();
      }
  
      return results[0];
    }
  }
}