import Service from '../service';

export default function(service: any) {
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

    static getTypeDef = Service.getTypeDef;

    static getRecord = Service.getRecord;
  }
}