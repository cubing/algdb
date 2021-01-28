import { EnumService, SimpleService } from ".";
import { generateEnumPaginatorTypeDef } from "../generators";

export class EnumPaginatorService extends SimpleService {
  constructor(service: EnumService) {
    super(service.typename + "EnumPaginator");
    this.typeDef = generateEnumPaginatorTypeDef(service, this);
    this.presets = {
      default: {
        values: true,
      },
    };

    this.initialize(this.typeDef);
  }
}
