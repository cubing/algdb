import { Service } from ".";
export class PaginatorService extends Service {
  constructor(service: Service) {
    super();
    this.__typename = service.__typename + "Paginator";
    this.presets = {
      default: {
        paginatorInfo: {
          total: null,
          count: null,
        },
        data: service.presets?.default,
      },
    };

    this.hasKeys = false;
  }
}
