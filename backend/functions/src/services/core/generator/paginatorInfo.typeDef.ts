import { dataTypes } from '../../../jql/helpers/dataType';

export default function(service: any = {}) {
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