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

    static getTypeDef = Service.getTypeDef;

    static getRecord = Service.getRecord;
  }
}