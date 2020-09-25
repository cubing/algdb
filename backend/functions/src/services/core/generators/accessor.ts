import { Service } from '../service';
import { generateAccessorInfoService } from './accessorInfo'
import errorHelper from '../../../helpers/tier0/error';

export function generateAccessorService(service: any) {
  return class extends Service {
    static __typename = service.__typename + 'Accessor';
    static presets = {
      default: {
        accessorInfo: {
          sufficientPermissions: null,
        },
        data: null
      }
    };

    static hasKeys = false;

    static getTypeDef = Service.getTypeDef;

    static getRecord = Service.getRecord;
  }
}

export function generateAccessorTypeDef(service: any) {
  const AccessorInfo = generateAccessorInfoService(service);

  return {
    accessorInfo: {
      type: AccessorInfo.__typename,
      resolver: async (typename, req, currentObject, query, args) => {
        return AccessorInfo.getRecord(req, {
          ...args
        }, query);
      },
    },
    data: {
      type: [service.__typename],
      resolver: async (typename, req, currentObject, query, args) => {
        try {
          //if it does not pass the access control, throw an error
          if(!await service.testPermissions('get', req)) {
            throw errorHelper.badPermissionsError();
          }

          const results = await service.getRecord(req, {
            ...args
          }, query);
          return results;
        } catch(err) {
          return null;
        }
      }
    },
  }
};