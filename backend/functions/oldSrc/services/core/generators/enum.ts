import { Service } from '../service';
import { dataTypes } from 'jomql';

export function generateEnumService(enumName: string, currentEnum: object) {
  return class extends Service {
    static __typename = enumName + 'Enum';
    static presets = {
      default: {
        id: null,
        name: null,
      }
    };

    static enum = currentEnum;

    static getTypeDef = Service.getTypeDef;

    static getRecord = Service.getRecord;
  }
}

export function generateEnumTypeDef(currentEnum: object) {
  return {
    id: {
      type: dataTypes.ID,
      resolver: async (typename, req, currentObject, query, args) => {
        return args.id;
      }
    },
    name: {
      type: dataTypes.STRING,
      resolver: async (typename, req, currentObject, query, args) => {
        return currentEnum[args.id];
      }
    }
  }
};