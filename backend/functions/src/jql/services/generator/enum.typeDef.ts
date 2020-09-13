import { dataTypes } from '../../helpers/tier0/dataType';

export default function(currentEnum: object) {
  return {
    id: {
      type: dataTypes.ID,
      resolver: async (context, req, currentObject, query, args) => {
        return args.id;
      }
    },
    name: {
      type: dataTypes.STRING,
      resolver: async (context, req, currentObject, query, args) => {
        return currentEnum[args.id];
      }
    }
  }
};