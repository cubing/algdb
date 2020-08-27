import { dataTypes } from '../../../jql/helpers/dataType';

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