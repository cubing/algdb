import Service from '../service';

export default function(enumName: string, currentEnum: object) {
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