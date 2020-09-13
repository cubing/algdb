import { dataTypes } from '../../helpers/tier0/dataType';

export default function(service: any = {}) {
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