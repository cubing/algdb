import { Service } from ".";

export class AccessorService extends Service {
  constructor(service: Service) {
    super();
    this.__typename = service.__typename + "Accessor";
    this.presets = {
      default: {
        accessorInfo: {
          sufficientPermissions: null,
        },
        data: null,
      },
    };

    this.hasKeys = false;
  }
}
