import generateAccessorInfoService from './accessorInfo.service'
import errorHelper from '../../../helpers/tier0/error';

export default function(service: any) {
  const AccessorInfo = generateAccessorInfoService(service);

  return {
    accessorInfo: {
      type: AccessorInfo.__typename,
      resolver: async (context, req, currentObject, query, args) => {
        return AccessorInfo.getRecord(req, {
          ...args
        }, query);
      },
    },
    data: {
      type: [service.__typename],
      resolver: async (context, req, currentObject, query, args) => {
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