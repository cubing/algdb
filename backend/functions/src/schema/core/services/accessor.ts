import { NormalService, SimpleService } from ".";
import { generateAccessorTypeDef } from "../generators";

export class AccessorService extends SimpleService {
  constructor(service: NormalService) {
    super(service.typename + "Accessor");
    this.typeDef = generateAccessorTypeDef(service);
    this.presets = {
      default: {
        accessorInfo: {
          sufficientPermissions: true,
        },
        data: true,
      },
    };
  }
}
