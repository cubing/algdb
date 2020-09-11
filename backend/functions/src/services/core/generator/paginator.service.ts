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

    static hasKeys = false;

    static getTypeDef = Service.getTypeDef;

    static getRecord = Service.getRecord;
  }
}